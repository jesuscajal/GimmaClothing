import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Sin HTTPS (Cloudflare), las cookies Secure no se guardan en el navegador.
const cookieSecure = process.env.MEDUSA_COOKIE_SECURE === 'true'

const medusaBackendUrl =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const fileUploadDir = process.env.MEDUSA_FILE_UPLOAD_DIR || "static"
const fileBackendUrl =
  process.env.MEDUSA_FILE_BACKEND_URL || `${medusaBackendUrl}/static`

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    cookieOptions: {
      secure: cookieSecure,
      sameSite: cookieSecure ? 'none' : 'lax',
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: fileUploadDir,
              backend_url: fileBackendUrl,
            },
          },
        ],
      },
    },
  ],
})
