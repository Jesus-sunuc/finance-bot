import eslintJs from "@eslint/js";
import globalsBrowser from "globals";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import typescriptEslint from "typescript-eslint";

const ignoredPaths = {
  ignores: ["dist"],
};

const targetFiles = ["**/*.{ts,tsx}"];

const languageConfig = {
  ecmaVersion: 2020,
  globals: globalsBrowser.browser,
};

const pluginRegistry = {
  "react-hooks": pluginReactHooks,
  "react-refresh": pluginReactRefresh,
};

const customRules = {
  ...pluginReactHooks.configs.recommended.rules,

  "react-refresh/only-export-components": [
    "warn",
    { allowConstantExport: true },
  ],

  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    },
  ],

  "jsx-a11y/no-access-key": "off",
};

const mainConfig = {
  extends: [
    eslintJs.configs.recommended,
    ...typescriptEslint.configs.recommended,
  ],
  files: targetFiles,
  languageOptions: languageConfig,
  plugins: pluginRegistry,
  rules: customRules,
};

export default typescriptEslint.config(ignoredPaths, mainConfig);
