"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(
    signup as (
      state: string | null,
      formData: FormData
    ) => Promise<string | null>,
    null as string | null
  )

  return (
    <div className="flex w-full flex-col items-center" data-testid="register-page">
      <h2 className="font-serif text-2xl font-semibold text-black">
        Crear cuenta
      </h2>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Registrate en Gimma Clothing para seguir tus pedidos y guardar tus
        datos.
      </p>
      <form className="mt-8 flex w-full flex-col" action={formAction}>
        <div className="flex w-full flex-col gap-y-3">
          <Input
            label="Nombre"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Apellido"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Teléfono"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Contraseña"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <p className="mt-4 text-center text-xs text-neutral-500">
          Al crear tu cuenta aceptás los términos de uso de Gimma Clothing.
        </p>
        <SubmitButton
          className="mt-6 w-full !rounded-full !bg-black !text-white hover:!bg-neutral-800"
          data-testid="register-button"
        >
          Crear cuenta
        </SubmitButton>
      </form>
      <span className="mt-6 text-center text-sm text-neutral-600">
        ¿Ya tenés cuenta?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-medium text-black underline"
        >
          Iniciar sesión
        </button>
      </span>
    </div>
  )
}

export default Register
