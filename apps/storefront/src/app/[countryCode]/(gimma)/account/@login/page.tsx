import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Ingresá a tu cuenta de Gimma Clothing.",
}

export default function Login() {
  return <LoginTemplate />
}
