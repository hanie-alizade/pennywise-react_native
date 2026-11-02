import expoConfig from "eslint-config-expo/flat.js";

const tsConfig = expoConfig.find((c) => c.plugins && c.plugins["@typescript-eslint"]);
const tsPlugin = tsConfig ? tsConfig.plugins["@typescript-eslint"] : undefined;

export default [
  ...expoConfig,
  {
    rules: {
      "no-console": "error",
      eqeqeq: ["error", "always"],
    },
  },
  ...(tsPlugin
    ? [
        {
          files: ["**/*.ts", "**/*.tsx"],
          plugins: {
            "@typescript-eslint": tsPlugin,
          },
          rules: {
            "@typescript-eslint/consistent-type-imports": [
              "error",
              { prefer: "type-imports", fixStyle: "separate-type-imports" },
            ],
          },
        },
      ]
    : []),
  {
    // Prohibit default exports outside the app/ directory and config files
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-exports": [
        "error",
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
    },
  },
];
