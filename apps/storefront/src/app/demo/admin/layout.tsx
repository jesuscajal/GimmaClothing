import AdminSidebar from "@modules/demo/admin/admin-sidebar"
import GimmaLogo from "@modules/demo/components/gimma-logo"
import { DemoAdminProvider } from "@modules/demo/admin/demo-admin-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoAdminProvider>
      <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
        <AdminSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
            <p className="text-sm text-neutral-500">
              Panel de administración · demo interactivo
            </p>
            <div className="flex items-center gap-3">
              <GimmaLogo href="/demo/admin" size="sm" />
              <span className="hidden text-sm text-neutral-600 sm:inline">
                admin@gimmaclothing.com
              </span>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DemoAdminProvider>
  )
}
