import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "scripts/**",
      ".qa/**",
      "playwright-report/**",
      "test-results/**",
      "*.log",
    ],
  },
];

export default eslintConfig;
