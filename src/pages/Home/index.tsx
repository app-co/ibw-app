/* eslint-disable array-callback-return */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { Modalize } from "react-native-modalize";
import YoutubePlayer from "react-native-youtube-iframe";

import Firebase from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { Box, Center, Text } from "native-base";
import { ButtonFlutuante } from "../../Components/ButtonFlutuante";
import { Engajamento } from "../../Components/Engajamento";
import { ILive, IUsersDto } from "../../dtos";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import { registerToken } from "../../notifications/sendNotification";
import { sizeH, sizeW } from "../../utils";
import { Live } from "../AMD/Live";
import {
  BoxPlayer,
  BoxText,
  Container,
  Title,
  TitleDesciption,
} from "./styles";

export function Home() {
  const modalRef = useRef<Modalize>(null);

  //* * ESTADOS ................................................................
  const { user, updateUser } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [data, setData] = useState<ILive>(null);
  const [load, setLoad] = useState(true);
  const [activi, setActive] = useState(true);

  const [showModalUpdates, setModalUpdates] = React.useState(false);

  //* * ........................................................................

  // todo FUNÇÕES ..............................................................

  const OpenModal = useCallback(() => {
    modalRef.current?.open();
  }, []);

  const CloseModal = useCallback(() => {
    modalRef.current?.close();
  }, []);

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const loadDAta = React.useCallback(async () => {
    Firebase()
      .collection("live")
      .onSnapshot((h) => {
        const ids = h.docs.map((i) => i.id);

        if (ids[0]) {
          ids.map((i) => {
            Firebase()
              .collection("live")
              .doc(i)
              .get()
              .then((p) => {
                const dc = p.data() as ILive;
                setData(dc);
              });
          });
        } else {
          setData(null);
        }
      });

    // await OneSignal.getDeviceState().then((h) => {
    //   const token = h?.userId ? h.userId : "";

    //   Firebase().collection("users").doc(user?.id).update({
    //     token,
    //   });

    //   const dt = {
    //     ...user,
    //     token,
    //   } as IUsersDto;

    //   updateUser(dt);
    // });

    const token = await registerToken();
    console.log(token);

    Firebase().collection("users").doc(user?.id).update({
      token,
    });

    const dt = {
      ...user,
      token,
    } as IUsersDto;

    updateUser(dt);
  }, []);

  useEffect(() => {
    loadDAta();
  }, [loadDAta]);

  useFocusEffect(
    useCallback(() => {
      setActive(true);
      if (data) {
        setLoad(false);
      } else {
        setTimeout(() => {
          setActive(false);
        }, 5000);
      }
    }, [data])
  );

  // todo ......................................................................

  return (
    <Container>
      <Modalize ref={modalRef}>
        <Live closeModal={CloseModal} />
      </Modalize>

      {load ? (
        <Center mt="40%">
          {activi && <ActivityIndicator />}
          <Text
            fontFamily={theme.fonts.REGULAR}
            fontSize="xl"
            color={theme.colors.text[2]}
          >
            Fique atento para a proxima live
          </Text>
          <Box h={200}>
            <YoutubePlayer
              height={sizeH(0.6)}
              width={sizeW(0.7)}

            // onChangeState={onStateChange}
            />
          </Box>
        </Center>
      ) : (
        <BoxPlayer>
          <YoutubePlayer
            height={sizeH(0.3)}
            width={sizeW(1)}
            videoId={data.video}
            onChangeState={onStateChange}
          />
          <BoxText>
            <Title>{data.title}</Title>
            <TitleDesciption>{data.descricao}</TitleDesciption>
          </BoxText>
        </BoxPlayer>
      )}
      {user.adm && <ButtonFlutuante pres={OpenModal} />}

      <Engajamento />
    </Container>
  );
}
