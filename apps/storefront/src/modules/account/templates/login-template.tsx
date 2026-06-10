"use client"

import { useState } from "react"

import GimmaBrandTitle from "@modules/demo/components/gimma-brand-title"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-4">
      <GimmaBrandTitle size="sm" className="mb-6" />
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
