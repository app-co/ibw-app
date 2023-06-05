/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import React from "react";
import { TextInputProps } from "react-native";

export function cep(e: string) {
  let value = e;

  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  const vl = value;

  return vl;
}

export function _cpf(e: string) {
  let value = e;

  value = value.replace(/\D/g, "");

  value = value.replace(
    /(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/,
    function (match, p1, p2, p3, p4) {
      if (p2 === undefined) {
        return p1;
      }
      if (p3 === undefined) {
        return `${p1}.${p2}`;
      }
      if (p4 === undefined) {
        return `${p1}.${p2}.${p3}`;
      }
      return `${p1}.${p2}.${p3}-${p4}`;
    }
  );
  // value = value.replace(/^(\d{3})(\d{1})/, "$1.$2");
  // value = value.replace(/^(\d{3})(\d{1})/, "$1.$2");
  // value = value.replace(/(?=(\d{3})+(\D))$/, ".");

  const vl = value;
  return vl;
}

export function currency(e: string) {
  let value = e;

  value = value.replace(/\D/g, "");

  // value = value.replace(/(\d)(\d{2})$/, "$1.$2");

  // value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");

  const vl = value;
  return vl;
}

export function number(e: string) {
  let value = e;

  value = value.replace(/\D/g, "");

  const vl = value;
  return vl;
}

export function _date(e: string) {
  let value = e;

  value = value.replace(/\D/g, "");
  value = value.replace(
    /(\d{2})(\d{1,2})?(\d{1,4})?/,
    function (match, p1, p2, p3) {
      if (p2 === undefined) {
        return p1;
      }
      if (p3 === undefined) {
        return `${p1}/${p2}`;
      }

      return `${p1}/${p2}/${p3}`;
    }
  );

  const vl = value;

  return vl;
}

export function texto(e: string) {
  return e;
}
