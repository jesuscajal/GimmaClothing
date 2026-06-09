/**
 * PM2 — procesos de producción.
 * Uso desde la raíz del repo:
 *   pm2 start deploy/ecosystem.config.cjs
 *   pm2 save && pm2 startup
 */
const path = require("path")

const root = path.join(__dirname, "..")

module.exports = {
  apps: [
    {
      name: "gimma-backend",
      cwd: path.join(root, "apps/backend/.medusa/server"),
      script: path.join(root, "node_modules/.bin/medusa"),
      args: "start",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "800M",
      error_file: path.join(root, "logs/backend-error.log"),
      out_file: path.join(root, "logs/backend-out.log"),
      merge_logs: true,
      time: true,
    },
    {
      name: "gimma-storefront",
      cwd: path.join(root, "apps/storefront"),
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: "8000",
      },
      max_memory_restart: "600M",
      error_file: path.join(root, "logs/storefront-error.log"),
      out_file: path.join(root, "logs/storefront-out.log"),
      merge_logs: true,
      time: true,
    },
  ],
}
