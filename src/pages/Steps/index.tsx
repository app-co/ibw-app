/* eslint-disable camelcase */
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import { Box, Center, Image } from "native-base";
import React, { useCallback, useReducer, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Yup from "yup";
import fire from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { format, getYear } from "date-fns";
import storage from "@react-native-firebase/storage";
import { Buttom } from "../../Components/Buttom";
import { Input } from "../../Components/FormInput";
import { Selection } from "../../Components/Selection";
import { IUserInc } from "../../dtos";
import { useAuth } from "../../hooks/AuthContext";
import * as S from "./styles";
import getValidationErrors from "../../utils/getValidationErrors";
import { date, number } from "../../utils/mask";
import { Header } from "../../Components/Header";
import { Contrato } from "../../Components/Contrato";
import theme from "../../global/styles/theme";
import { _validadeName, _validarCPF } from "../../utils/validation";

type IExp = "INTERMEDIÁIA" | "BÁSICA" | "AVANÇADA" | "";

interface ICategory {
  type: string;
  id: string;
  cat: string;
  exp: IExp;
}

interface PropsExp {
  cat: string;
  exp: "INTERMEDIÁIA" | "BÁSICA" | "AVANÇADA" | "";
  id?: string;
}

const category: ICategory[] = [
  { type: "TOW IN LAJE DO SHOCK - SURFISTA", id: "1", cat: "tow", exp: "" },
  {
    type: "REMADA PRAIA DE ITACOATIARA - SURFISTA",
    id: "2",
    cat: "remada",
    exp: "",
  },
  { type: "TOW IN LAJE DO SHOCK - PILOTO", id: "3", cat: "pilot", exp: "" },

  { type: "BODYBOARDING", id: "4", cat: "body", exp: "" },
  { type: "CINEGRAFISTA", id: "5", cat: "cine", exp: "" },
];

const experienc: PropsExp[] = [
  { cat: "tow", exp: "" },
  { cat: "remada", exp: "" },
  { cat: "body", exp: "" },
];

interface Credentials {
  name: string;
  email: string;
  cpf: string;
  birthday: string;
  localy: string;
}

export function Steps() {
  const { user } = useAuth();
  const ref = useRef<FormHandles>(null);
  const { navigate } = useNavigation();
  const [load, setLoad] = React.useState(false);

  const [expTow, setExpTow] = React.useState("");
  const [expRemada, setExpRemada] = React.useState("");

  const [sex, setSex] = React.useState("");
  const [selectCategory, setSelectCategory] = React.useState<ICategory[]>([]);

  const [regulamento, setRegulamento] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const [resonse, setResponse] = React.useState<IUserInc[]>([]);

  const toggleSecectionCategory = useCallback(
    (item: ICategory) => {
      const index = selectCategory.findIndex((i) => i.id === item.id);
      const arrSelect = [...selectCategory];
      if (index !== -1) {
        arrSelect.splice(index, 1);
      } else {
        arrSelect.push(item);
      }

      setSelectCategory(arrSelect);
    },
    [selectCategory]
  );

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    setImage(result.uri);
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

  const event_id = `${getYear(new Date())}${user.id}`;

  const handleSubmit = React.useCallback(
    async (data: Credentials) => {
      const { name, email, cpf, birthday, localy } = data;
      setLoad(true);

      if (!regulamento) {
        return Alert.alert(
          "Atenção",
          "Leia o regulamento para encerrar sua inscrição"
        );
      }

      const findCpf = resonse.find((h) => {
        const cpf = data.cpf.replace(/[^\d]/g, "");

        if (h.cpf === cpf) {
          return h;
        }
      });

      const validName = _validadeName(data.name);
      const validatCpf = _validarCPF(data.cpf);

      if (findCpf) {
        return Alert.alert("Erro", "Candidato ja registrado");
      }

      if (!validName) {
        return Alert.alert("Erro", "Digite seu nome completo");
      }

      // if (!validatCpf) {
      //   return Alert.alert("Erro", "CPF inválido");
      // }

      if (
        name === "" ||
        cpf === "" ||
        birthday === "" ||
        localy === "" ||
        email === ""
      ) {
        return Alert.alert("Erro", "Preencha todo o formulário");
      }

      if (expRemada === "" && expTow === "") {
        return Alert.alert("Erro", "Informe sua experiência");
      }

      if (selectCategory.length === 0) {
        return Alert.alert("Erro", "Selecione um categoria");
      }

      if (sex === "") {
        return Alert.alert("Erro", "Informe o seu sexo");
      }

      if (image === null) {
        return Alert.alert("Erro", "Faça o upload de uma imagem");
      }

      // if (cpf.length < 14) {
      //   return Alert.alert("Erro", "Cpf inválido");
      // }

      if (birthday.length < 8) {
        return Alert.alert("Erro", "Data de aniversário inválido");
      }

      const cat = selectCategory.map((h) => {
        const exp =
          h.type === "TOW IN LAJE DO SHOCK - SURFISTA" ? expTow : expRemada;

        return {
          type: h.type,
          exp,
        };
      });

      try {
        const fileName = new Date().getTime();
        const reference = storage().ref(`/candidato/${fileName}.png`);

        await reference.putFile(image);
        const photoUrl = await reference.getDownloadURL();

        const dados = {
          name: name.toLocaleUpperCase(),
          email,
          localy,
          cpf: number(cpf),
          birthday: date(birthday),
          sexo: sex,
          category: cat,
          photo: photoUrl,
          expTow,
          expRemada,
          status: "Inscrição solicitada",
          created_at: format(new Date(), "dd/MM/yyyy - HH:mm"),
          user_id: user.id,
          event_id,
        };

        fire()
          .collection("inscricao")
          .add(dados)
          .then((h) => {
            Alert.alert(
              ".",
              "Agradecemos o envio da solicitação de inscrição. Os requsitos de participação serão verificados e em até 3 dias você será informado do status da sua inscricão consultando seu passaporte no menu principal do aplicativo."
            );
            setLoad(false);
            navigate("HOME");
          });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          ref.current?.setErrors(errors);
          Alert.alert(err.message);
        }

        Alert.alert(
          "Erro",
          "Estomos com problemas no servidor, tente novamente mais tarde."
        );

        setLoad(false);
      }
    },
    [
      event_id,
      expRemada,
      expTow,
      image,
      navigate,
      regulamento,
      resonse,
      selectCategory,
      sex,
      user.id,
    ]
  );

  React.useEffect(() => {
    if (regulamento) {
      setShowModal(false);
    }
  }, [regulamento]);

  const filCategoryA = selectCategory.filter((h) => {
    if (h.type.includes('TOW IN')) {
      return h;
    }
  });

  const filCategoryB = selectCategory.filter((h) => {
    if (h.id === "2") {
      return h;
    }
  });

  console.log("cat", filCategoryA)

  return (
    <S.box>
      <S.Container>
        <Header icon="menu" />

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

        <S.title style={{ alignSelf: "center" }}>
          Formulário de solicitação de inscrição
        </S.title>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 60 }}
          style={{ width: "100%" }}
        >
          <S.form onSubmit={handleSubmit} ref={ref}>
            <Input nome="Nome completo" name="name" />
            <Input keyboardType="email-address" nome="E-mail" name="email" />
            <Input
              nome="CPF ou Passaporte"
              name="cpf"
              maxLength={14}
            />
            <Input
              keyboardType="numeric"
              mask={{ type: "date" }}
              nome="Data de nascimento"
              name="birthday"
              maxLength={10}
            />
            <Input nome="Onda de origem" name="localy" />

            <S.subText>SEXO</S.subText>

            <S.boxRow>
              <Selection
                pres={() => setSex("M")}
                text="Masculino"
                select={sex === "M"}
                variant="secundary"
              />

              <Box ml="20">
                <Selection
                  pres={() => setSex("F")}
                  text="Feminino"
                  select={sex === "F"}
                  variant="secundary"
                />
              </Box>
            </S.boxRow>

            <S.subText>
              Escolha as categorias que deseja participar (pode ser uma ou mais)
            </S.subText>

            <FlatList
              style={{ marginTop: 20, marginBottom: 30 }}
              data={category}
              renderItem={({ item: h }) => (
                <S.boxCategory
                  onPress={() => toggleSecectionCategory(h)}
                  select={selectCategory.findIndex((i) => i.id === h.id) !== -1}
                >
                  <S.subText>{h.type}</S.subText>
                </S.boxCategory>
              )}
            />

            {filCategoryA.length > 0 && (
              <Box>
                <S.subText>
                  Experiência prévia no surf de tow in em ondas grande ou lajes
                </S.subText>

                <Selection
                  pres={() => setExpTow("BASICA")}
                  select={expTow === "BASICA"}
                  text="básica"
                  variant="secundary"
                />
                <Selection
                  pres={() => setExpTow("INTERMEDIARIA")}
                  select={expTow === "INTERMEDIARIA"}
                  text="intermediária"
                  variant="secundary"
                />
                <Selection
                  pres={() => setExpTow("AVANÇADA")}
                  select={expTow === "AVANÇADA"}
                  text="avançada"
                  variant="secundary"
                />
              </Box>
            )}


            {filCategoryB.length > 0 && (
              <Box>
                <S.subText>
                  Experiência prévia em pilotagem de jet ski no tow in
                </S.subText>

                <Selection
                  pres={() => setExpRemada("BASICA")}
                  select={expRemada === "BASICA"}
                  variant="secundary"
                  text="básica"
                />
                <Selection
                  pres={() => setExpRemada("INTERMEDIARIA")}
                  select={expRemada === "INTERMEDIARIA"}
                  variant="secundary"
                  text="intermediária"
                />
                <Selection
                  pres={() => setExpRemada("AVANÇADA")}
                  select={expRemada === "AVANÇADA"}
                  variant="secundary"
                  text="avançada"
                />
              </Box>
            )}

            {/* {filCategoryA.length > 1 && (
              <Box>
                <S.subText>
                  Experiência prévia no surf de tow in em ondas grande ou lajes
                </S.subText>

                <Selection
                  pres={() => setExpTow("BASICA")}
                  select={expTow === "BASICA"}
                  text="básica"
                  variant="secundary"
                />
                <Selection
                  pres={() => setExpTow("INTERMEDIARIA")}
                  select={expTow === "INTERMEDIARIA"}
                  text="intermediária"
                  variant="secundary"
                />
                <Selection
                  pres={() => setExpTow("AVANÇADA")}
                  select={expTow === "AVANÇADA"}
                  text="avançada"
                  variant="secundary"
                />

                <S.subText style={{ marginTop: 20 }}>
                  Experiência prévia em pilotagem de jet ski no tow in
                </S.subText>

                <Selection
                  pres={() => setExpRemada("BASICA")}
                  select={expRemada === "BASICA"}
                  text="básica"
                  variant="secundary"
                />
                <Selection
                  pres={() => setExpRemada("INTERMEDIARIA")}
                  select={expRemada === "INTERMEDIARIA"}
                  text="intermediária"
                  variant="secundary"
                />
                <Selection
                  pres={() => setExpRemada("AVANÇADA")}
                  select={expRemada === "AVANÇADA"}
                  text="avançada"
                  variant="secundary"
                />
              </Box>
            )} */}

            <S.subText style={{ marginTop: 30 }}>
              Faça upload de foto para indentificação
            </S.subText>

            <Center flexDirection="row" mt="1" mb="10">
              <S.boxImg>
                <Image
                  w={150}
                  h="150"
                  resizeMode="contain"
                  alt="photo"
                  source={{ uri: image }}
                />
              </S.boxImg>

              <TouchableOpacity
                onPress={pickImage}
                style={{ marginLeft: "5%", padding: 5 }}
              >
                <S.subText>Escolher imagem</S.subText>
              </TouchableOpacity>
            </Center>

            <Center px="10">
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <S.text
                  style={{
                    color: theme.colors.focus[1],
                    fontFamily: theme.fonts.Bold,
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  CLICK AQUI E LEIA O REGULAMENTO
                </S.text>
              </TouchableOpacity>
            </Center>

            <S.boxSelect>
              <Selection
                variant="secundary"
                select={regulamento}
                text="LI E CONCORDO"
              />
            </S.boxSelect>

            <Center>
              <Buttom pres={() => ref.current?.submitForm()} nome="FINALIZAR" />
            </Center>
          </S.form>

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
