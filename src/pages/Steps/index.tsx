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
import { format, getTime, getYear } from "date-fns";
import storage from "@react-native-firebase/storage";
import { Buttom } from "../../Components/Buttom";
import { Input } from "../../Components/FormInput";
import { Selection } from "../../Components/Selection";
import { IUserInc, IUsersDto } from "../../dtos";
import { useAuth } from "../../hooks/AuthContext";
import * as S from "./styles";
import getValidationErrors from "../../utils/getValidationErrors";
import { date, number } from "../../utils/mask";
import { Header } from "../../Components/Header";
import { Contrato } from "../../Components/Contrato";
import theme from "../../global/styles/theme";
import { _validadeName, _validarCPF } from "../../utils/validation";
import {
  sendExpoPushNotification,
  sendPushNotification,
} from "../../notifications/sendNotification";

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

type IbodyOrCine = "BODYBOARDING" | "CINEGRAFISTA" | "";

const category: ICategory[] = [
  { type: "TOW IN LAJE DO SHOCK - SURFISTA", id: "1", cat: "tow", exp: "" },
  { type: "TOW IN LAJE DO SHOCK - PILOTO", id: "2", cat: "pilot", exp: "" },
  {
    type: "REMADA PRAIA DE ITACOATIARA - SURFISTA",
    id: "3",
    cat: "remada",
    exp: "",
  },
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
  const { navigate, reset } = useNavigation();
  const [load, setLoad] = React.useState(false);

  const [expTow, setExpTow] = React.useState("");
  const [expRemada, setExpRemada] = React.useState("");
  const [bodyOrcine, setBodyOrcine] = React.useState<IbodyOrCine>("");
  const [selectCategory, setSelectCategory] = React.useState<ICategory[]>([]);

  const [sex, setSex] = React.useState("");

  const [regulamento, setRegulamento] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const [resonse, setResponse] = React.useState<IUserInc[]>([]);
  const [modalSucces, setModalSucces] = React.useState(false);

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
      setBodyOrcine("");
    },
    [selectCategory]
  );

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
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

  const filCategoryA = selectCategory.filter((h) => {
    if (h.id === "1") {
      return h;
    }
  });

  const filCategoryB = selectCategory.filter((h) => {
    if (h.id === "2") {
      return h;
    }
  });

  const handleSubmit = React.useCallback(
    async (data: Credentials) => {
      const { name, email, cpf, birthday, localy } = data;
      setLoad(true);

      if (!regulamento) {
        setLoad(false);
        return Alert.alert(
          "Atenção",
          "Leia o regulamento para encerrar sua inscrição"
        );
      }

      const findCpf = resonse.find((h) => {
        const { cpf } = data;

        if (h.cpf === cpf) {
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

      if (
        name === "" ||
        cpf === "" ||
        birthday === "" ||
        localy === "" ||
        email === ""
      ) {
        setLoad(false);
        return Alert.alert("Erro", "Preencha todo o formulário");
      }

      if (filCategoryA.length > 0 && expTow === "") {
        setLoad(false);
        return Alert.alert("Erro", "Informe sua experiência");
      }

      if (filCategoryB.length > 0 && expRemada === "") {
        setLoad(false);
        return Alert.alert("Erro", "Informe sua experiência");
      }

      if (selectCategory.length === 0 && bodyOrcine === "") {
        setLoad(false);
        return Alert.alert("Erro", "Selecione um categoria");
      }

      if (sex === "") {
        setLoad(false);
        return Alert.alert("Erro", "Informe o seu sexo");
      }

      if (image === null) {
        setLoad(false);
        return Alert.alert("Erro", "Faça o upload de uma imagem");
      }

      // if (cpf.length < 14) {
      //   return Alert.alert("Erro", "Cpf inválido");
      // }

      if (birthday.length < 8) {
        setLoad(false);
        return Alert.alert("Erro", "Data de aniversário inválido");
      }

      const cat = selectCategory.map((h) => {
        let exp = "";

        if (h.id === "1") {
          exp = expTow;
        }

        if (h.id === "2") {
          exp = expRemada;
        }

        return {
          ...h,
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
          cpf,
          birthday: date(birthday),
          sexo: sex,
          category: cat,
          bodyboarding: bodyOrcine === "BODYBOARDING" ? bodyOrcine : "",
          cinegrafista: bodyOrcine === "CINEGRAFISTA" ? bodyOrcine : "",
          photo: photoUrl,
          status: "Inscrição solicitada",
          created_at: getTime(new Date()),
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
        console.log(err);
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
    [
      bodyOrcine,
      event_id,
      expRemada,
      expTow,
      filCategoryA,
      filCategoryB,
      image,
      regulamento,
      resonse,
      selectCategory,
      sex,
      user,
    ]
  );

  const selectBodyOrCine = React.useCallback(
    async (item: IbodyOrCine) => {
      if (bodyOrcine === "") {
        setBodyOrcine(item);
        setSelectCategory([]);
      } else {
        setBodyOrcine("");
      }
    },
    [bodyOrcine]
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
            <Input nome="CPF ou Passaporte" name="cpf" maxLength={14} />
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

            <S.boxCategory
              style={{ marginTop: 20 }}
              onPress={() => selectBodyOrCine("BODYBOARDING")}
              select={bodyOrcine === "BODYBOARDING"}
            >
              <S.subText>BODYBOARDING</S.subText>
            </S.boxCategory>

            <S.boxCategory
              onPress={() => selectBodyOrCine("CINEGRAFISTA")}
              select={bodyOrcine === "CINEGRAFISTA"}
            >
              <S.subText>CINEGRAFISTA</S.subText>
            </S.boxCategory>

            {bodyOrcine === "" && (
              <FlatList
                style={{ marginTop: 10, marginBottom: 30 }}
                data={category}
                renderItem={({ item: h }) => (
                  <S.boxCategory
                    onPress={() => toggleSecectionCategory(h)}
                    select={
                      selectCategory.findIndex((i) => i.id === h.id) !== -1
                    }
                  >
                    <S.subText>{h.type}</S.subText>
                  </S.boxCategory>
                )}
              />
            )}

            {filCategoryA.length > 0 && bodyOrcine === "" && (
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

            {filCategoryB.length > 0 && bodyOrcine === "" && (
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
              <Buttom
                load={load}
                pres={() => ref.current?.submitForm()}
                nome="FINALIZAR"
              />
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
