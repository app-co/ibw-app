/* eslint-disable camelcase */
export interface IUsersDto {
  id: string;
  nome: string;
  email: string;
  avatar: string | null;
  adm: boolean;
  senha?: string;
  token?: string;
}

export interface INewsDto {
  id: string;
  title: string;
  descricao: string;
  type: string;
  video: string;
  image: string;
}

export interface ILive {
  descricao: string;
  title: string;
  video: string;
}

export interface IUserInc {
  id: string;
  name: string;
  cpf: string;
  email: string;
  birthday: string;
  sexo: "M" | "F";
  category: { type: string; exp: string }[];
  expTow: string;
  expRemada: string;
  photo: string;
  created_at: string;
  status: string;
  user_id: string;
  token: string;
}
