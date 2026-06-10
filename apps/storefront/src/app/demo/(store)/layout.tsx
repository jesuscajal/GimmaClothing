import DemoNav from "@modules/demo/components/demo-nav"
import DemoFooter from "@modules/demo/components/demo-footer"

export default function DemoStoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-300 text-black antialiased">
      <DemoNav />
      {children}
      <DemoFooter />
    </div>
  )
}
