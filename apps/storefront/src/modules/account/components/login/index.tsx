import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="flex w-full flex-col items-center"
      data-testid="login-page"
    >
      <h2 className="font-serif text-2xl font-semibold text-black">
        Bienvenida de nuevo
      </h2>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Iniciá sesión para ver tus pedidos y gestionar tu cuenta en Gimma
        Clothing.
      </p>
      <form className="mt-8 w-full" action={formAction}>
        <div className="flex w-full flex-col gap-y-3">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Ingresá un email válido."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="mt-6 w-full !rounded-full !bg-black !text-white hover:!bg-neutral-800"
        >
          Iniciar sesión
        </SubmitButton>
      </form>
      <span className="mt-6 text-center text-sm text-neutral-600">
        ¿No tenés cuenta?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-medium text-black underline"
          data-testid="register-button"
        >
          Crear cuenta
        </button>
      </span>
    </div>
  )
}

export default Login
