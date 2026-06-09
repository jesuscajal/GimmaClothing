import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Sin HTTPS (Cloudflare), las cookies Secure no se guardan en el navegador.
const cookieSecure = process.env.MEDUSA_COOKIE_SECURE === 'true'

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
})
