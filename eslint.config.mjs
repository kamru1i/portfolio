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
      "*.log",
    ],
  },
];

export default eslintConfig;
