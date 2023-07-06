/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";


import FireStore from "@react-native-firebase/firestore";
import Auth from '@react-native-firebase/auth'
import { IUsersDto } from "../dtos";



interface SignInCred {
  email: string;
  senha: string;
}

interface AuthContexData {
  user: IUsersDto | null;
  loading: boolean;
  signIn(credential: SignInCred): Promise<void>;
  signOut(): void;
  updateUser(user: IUsersDto): Promise<void>;
}

type T = {children: ReactNode}

const User_Collection = "@ibw:user";

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);


export function AuthProvider({ children }: T) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUsersDto | null>(null);


  const LoadingUser = useCallback(async () => {
    setLoading(true);

    const storeUser = await AsyncStorage.getItem(User_Collection);

    if (storeUser) {
      const userData = JSON.parse(storeUser) as IUsersDto;
      setUser(userData);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    LoadingUser();
  }, [LoadingUser]);


  const signIn = useCallback(async ({ email, senha }: SignInCred) => {

    Auth().signInWithEmailAndPassword(email, senha)
      .then(au => {
        FireStore()
          .collection('users')
          .doc(au.user.uid)
          .get()
          .then(async profile => {
            const {
              nome,
              avatar,
              adm,
              token

            } = profile.data() as IUsersDto;

            if (profile.exists) {
              const userData = {
                email: au.user.email,
                id: au.user.uid,
                nome,
                avatar,
                adm,
                token
              };
              await AsyncStorage.setItem(
                User_Collection,
                JSON.stringify(userData),
              );
              setUser(userData);
            }
          })
          .catch(err => {
            Alert.alert(
              "Login",
              "Não foi possível carregar os dados do usuário",
            );
          });
          
      })
      .catch(err => {
        const { code } = err;
        console.log(err, code, 'erro 1')
        if (code === "auth/user-not-found" ) {
          return Alert.alert("Erro na atutenticação", "usuário não encontrado");
        }

        if (code === "auth/wrong-password") {
          return Alert.alert('Erro na autenticação', 'senha inconrreta')
        }
        return Alert.alert("Erro na atutenticação", "usuário nao encontrado");
      });
  }, []);

  useEffect(() => {
    setLoading(true);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(User_Collection);
    // await GoogleSignin.signOut();

    setUser(null);
  }, []);

  const updateUser = useCallback(async (user: IUsersDto) => {
    await AsyncStorage.setItem(User_Collection, JSON.stringify(user));

    setUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContexData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used with ..");
  }

  return context;
}
