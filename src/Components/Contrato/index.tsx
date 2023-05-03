import React from "react";
import { Modal } from "react-native";
import Pdf from "react-native-pdf";
import * as S from "./styles";
import pdf from "../../pdf/ibw.pdf";

interface props {
  item: (pg: number) => void;
  page?: number;
}

export function Contrato({ item, page }: props) {
  const source = {
    uri: pdf,
    cache: true,
  };

  return (
    <S.Container>
      <Pdf
        style={{ flex: 1 }}
        trustAllCerts={false}
        source={source.uri}
        page={page}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          item(page);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
      />
    </S.Container>
  );
}
