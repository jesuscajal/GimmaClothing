const c = require("ansi-colors");

const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    // TODO: we need a good doc to point this to
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
];

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    c;
    return !process.env[env.key];
  });

  const placeholderKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (
    placeholderKey === "pk_demo_visual_preview" ||
    placeholderKey === "pk_reemplazar_tras_db_setup"
  ) {
    console.warn(
      c.yellow.bold(
        "\n⚠️  Publishable key de demo detectada. Para datos reales ejecutá:\n"
      )
    )
    console.warn(c.dim("   npm run docker:up && npm run db:setup\n"))
  }

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    );

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`));
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`));
      }
    });

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env file or environment before starting the application.\n"
      )
    );

    process.exit(1);
  }
}

module.exports = checkEnvVariables;
