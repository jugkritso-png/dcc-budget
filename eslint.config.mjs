import nextInstall from "@next/eslint-plugin-next"

export default [
  {
    plugins: {
      "@next/next": nextInstall,
    },
    rules: {
      ...nextInstall.configs.recommended.rules,
      ...nextInstall.configs["core-web-vitals"].rules,
    },
  },
];
