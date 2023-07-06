import React, { ReactNode } from "react";

import { AuthProvider } from "./AuthContext";

type T = { children: ReactNode };

function AppProvider({ children }: T) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default AppProvider;
