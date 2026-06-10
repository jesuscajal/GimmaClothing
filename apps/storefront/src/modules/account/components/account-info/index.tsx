import { Disclosure } from "@headlessui/react"
import { Badge, Button, clx } from "@modules/common/components/ui"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "Ocurrió un error, intentá de nuevo",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="text-sm" data-testid={dataTestid}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {label}
          </span>
          <div className="mt-1">
            {typeof currentInfo === "string" ? (
              <span className="font-medium text-black" data-testid="current-info">
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          className="shrink-0 rounded-full px-4 py-1.5 text-xs"
          onClick={handleToggle}
          type={state ? "reset" : "button"}
          data-testid="edit-button"
          data-active={state}
        >
          {state ? "Cancelar" : "Editar"}
        </Button>
      </div>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <Badge className="my-4 p-2" color="green">
            <span>{label} actualizado correctamente</span>
          </Badge>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <Badge className="my-4 p-2" color="red">
            <span>{errorMessage}</span>
          </Badge>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-visible transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-2 py-4">
            <div>{children}</div>
            <div className="mt-2 flex items-center justify-end">
              <Button
                isLoading={pending}
                className="w-full rounded-full bg-black text-white hover:bg-neutral-800 small:max-w-[160px]"
                type="submit"
                data-testid="save-button"
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
