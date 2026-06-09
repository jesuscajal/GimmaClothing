import { DemoCartProvider } from "@modules/demo/demo-cart-context"

export default function DemoRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DemoCartProvider>{children}</DemoCartProvider>
}
