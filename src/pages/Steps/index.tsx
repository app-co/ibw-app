/* eslint-disable camelcase */
import { zodResolver } from "@hookform/resolvers/zod";
import fire from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { FormHandles } from "@unform/core";
import { getTime, getYear } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { Box, Center, HStack, VStack } from "native-base";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Yup from "yup";
import { Buttom } from "../../Components/Buttom";
import { Contrato } from "../../Components/Contrato";
import { FormInput } from "../../Components/forms/FormInput";
import { Selection } from "../../Components/forms/Selection";
import { IUserInc, IUsersDto } from "../../dtos";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import { sendExpoPushNotification } from "../../notifications/sendNotification";
import getValidationErrors from "../../utils/getValidationErrors";
import { _date } from "../../utils/mask";
import { _validadeName } from "../../utils/validation";
import { TRegister, schemaRegister } from "./schemas";
import * as S from "./styles";

const sexo = [
  {
    label: "Masculino",
    value: "Masculino",
  },
  {
    label: "Feminino",
    value: "Feminino",
  },
  {
    label: "Outros",
    value: "Outros",
  },
];

export function Steps() {
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegister>({
    resolver: zodResolver(
      schemaRegister.omit({ born: true, regulamento: true, sex: true })
    ),
  });
  const ref = useRef<FormHandles>(null);
  const { navigate, reset } = useNavigation();
  const [load, setLoad] = React.useState(false);

  const [regulamento, setRegulamento] = React.useState(false);
  const [modalAlert, setModalAlert] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const [resonse, setResponse] = React.useState<IUserInc[]>([]);
  const [modalSucces, setModalSucces] = React.useState(false);

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  React.useEffect(() => {
    fire()
      .collection("inscricao")
      .get()
      .then((h) => {
        const rs = h.docs.map((p) => p.data() as IUserInc);

        setResponse(rs);
      });
  }, []);

  const event_id = `${getYear(new Date())}${user!.id}`;

  const submit = React.useCallback(
    async (data: TRegister) => {
      const { name, email, born, country, cpf_passport } = data;
      setLoad(true);
      setModalAlert(false);

      const findCpf = resonse.find((h) => {
        if (h.cpf === cpf_passport) {
          setLoad(false);
          return h;
        }
      });

      const validName = _validadeName(data.name);

      if (findCpf) {
        setLoad(false);
        return Alert.alert("Erro", "Candidato ja registrado");
      }

      if (!validName) {
        setLoad(false);
        return Alert.alert("Erro", "Digite seu nome completo");
      }

      if (!image) {
        setLoad(false);
        return Alert.alert("Erro", "Você precisa selecionar uma imagem");
      }

      try {
        const fileName = new Date().getTime();
        const reference = storage().ref(`/candidato/${fileName}.png`);

        await reference.putFile(image!);
        const photoUrl = await reference.getDownloadURL();

        const dados = {
          name: name.toLocaleUpperCase(),
          email,
          localy: country,
          cpf: cpf_passport,
          birthday: _date(born),
          sexo: sex,
          photo: photoUrl,
          status: "Inscrição solicitada",
          created_at: getTime(new Date()),
          update_at: getTime(new Date()),
          user_id: user?.id,
          token: user?.token,
          event_id,
        };

        fire()
          .collection("inscricao")
          .add(dados)
          .then((h) => {
            setLoad(false);
            setModalSucces(true);
          });
      } catch (err) {
        setLoad(false);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          ref.current?.setErrors(errors);
          Alert.alert(err.message);
        } else {
          Alert.alert(
            "Erro",
            "Estomos com problemas no servidor, tente novamente mais tarde."
          );
        }
      }
    },
    [resonse, image, user?.id, user?.token, event_id]
  );


  React.useEffect(() => {
    if (regulamento) {
      setShowModal(false);
    }
  }, [regulamento]);

  const closedModalSucces = React.useCallback(async () => {
    // setModalSucces(false);
    const title = "NOVA SOLICITAÇÃO DE INSCRIÇÃO";
    const text = "";

    fire()
      .collection("users")
      .get()
      .then((h) => {
        const rs = h.docs.map((p) => p.data() as IUsersDto);

        rs.forEach((p) => {
          if (p.adm === true && p.token !== "null") {
            const tk = p.token!;
            sendExpoPushNotification({ title, text, token: tk });
          }
        });
      });

    reset({
      routes: [{ name: "steps" }],
    });
    navigate("HOME");
  }, [navigate, reset]);

  return (
    <S.box>
      <S.Container>
        <Modal visible={showModal}>
          <S.closeModal onPress={() => setShowModal(false)}>
            <S.text style={{ color: theme.colors.focus[1] }}>SAIR</S.text>
          </S.closeModal>

          <S.boxSelect
            style={{
              backgroundColor: theme.colors.secundary[1],
              padding: 10,
            }}
          >
            <S.text
              style={{
                color: theme.colors.focus[1],
                fontFamily: theme.fonts.Bold,
              }}
            >
              Role a tela, leia o regulamento até o final e clique no botão,
              caso de acordo.
            </S.text>
          </S.boxSelect>

          <Contrato page={page} item={(h) => setPage(h)} />

          {page === 14 && (
            <S.boxSelect style={{ backgroundColor: theme.colors.secundary[1] }}>
              <Selection
                pres={() => setRegulamento(!regulamento)}
                select={regulamento}
                text="LI E CONCORDO"
              />
            </S.boxSelect>
          )}
        </Modal>

        <Modal visible={modalSucces}>
          <S.sucessBox>
            <S.sucessTitle>SOLICITAÇÃO REALIZADA COM SUCESSO!</S.sucessTitle>
            <S.sucessText>
              Agradecemos o envio da solicitação de inscrição. Os requsitos de
              participação serão verificados e em até 3 dias você será informado
              do status da sua inscricão consultando seu passaporte no menu
              principal do aplicativo.
            </S.sucessText>

            <Buttom nome="OK" pres={closedModalSucces} />
          </S.sucessBox>
        </Modal>

        <Modal visible={modalAlert}>
          <Center bg="gray.600" flex="1">
            <S.title>
              Ao clicar em continuar você concorda com o regulamento
            </S.title>

            <HStack w="full" space={8} justifyContent="center">
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary[3],
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => setModalAlert(false)}
              >
                <S.text
                  style={{
                    color: "#fff",
                    fontFamily: theme.fonts.REGULAR,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  CANCELAR
                </S.text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={load}
                style={{
                  backgroundColor: theme.colors.primary[2],
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  ref.current?.submitForm();
                  setModalAlert(false);
                }}
              >
                {load ? (
                  <ActivityIndicator />
                ) : (
                  <S.text
                    style={{
                      color: "#fff",
                      fontFamily: theme.fonts.REGULAR,
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    CONTINUAR
                  </S.text>
                )}
              </TouchableOpacity>
            </HStack>
          </Center>
        </Modal>

        <S.title style={{ alignSelf: "center" }}>
          International Tow Association (ITA) - AFILIATION
        </S.title>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          style={{ width: "100%" }}
        >
          <VStack space={4}>
            <FormInput
              control={control}
              error={errors.name}
              placeholder="Digite seu nome completo"
              name="name"
              label="Nome completo"
            />

            <FormInput
              control={control}
              error={errors.born}
              placeholder="Data de nacimento (date of birth)"
              name="born"
              label="Data de nacimento (date of birth)"
            />
            <Box mt={2}>
              <Selection
                placeholder="Selecione um sexo"
                itemSelected={(h) => console.log(h)}
                itens={sexo}
              />
            </Box>
            <FormInput
              control={control}
              error={errors.name}
              placeholder="País de origem"
              name="name"
              label="País (country)"
            />

            <FormInput
              control={control}
              error={errors.name}
              placeholder="Onda de origim"
              name="name"
              label="Onda de origem (Local Spot"
            />

            <FormInput
              control={control}
              error={errors.cpf_passport}
              placeholder="Digite seu CPF ou Passaporte"
              name="cpf_passport"
              label="CPF/PASSPORT"
            />

            <FormInput
              control={control}
              error={errors.email}
              placeholder="E-mail"
              name="email"
              label="E-mail"
            />
            <TouchableOpacity style={{ marginTop: 10 }}>
              <S.text>Click aqui e Leia o Regulamento</S.text>
            </TouchableOpacity>
          </VStack>

          <TouchableOpacity
            onPress={() => navigate("HOME")}
            style={{ marginTop: 20 }}
          >
            <S.boxCancel>
              <S.text style={{ color: "#fff" }}>CANCELAR INSCRIÇÃO</S.text>
            </S.boxCancel>
          </TouchableOpacity>
        </ScrollView>
      </S.Container>
    </S.box>
  );
}
