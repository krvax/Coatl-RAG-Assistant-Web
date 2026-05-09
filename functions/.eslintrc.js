module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "import/no-unresolved": 0,

    // Reglas cosméticas del estilo Google desactivadas: ruido sin valor real.
    "quotes": "off",
    "max-len": "off",
    "indent": "off",
    "object-curly-spacing": "off",
    "padded-blocks": "off",
    "operator-linebreak": "off",
    "comma-dangle": "off",
    "eol-last": "off",
    "valid-jsdoc": "off",
    "require-jsdoc": "off",
    "new-cap": "off",
    "no-trailing-spaces": "off",
    "no-multiple-empty-lines": "off",
    "arrow-parens": "off",
    "block-spacing": "off",
    "brace-style": "off",
    "key-spacing": "off",
    "keyword-spacing": "off",
    "semi-spacing": "off",
    "space-before-blocks": "off",
    "space-before-function-paren": "off",
    "space-in-parens": "off",
    "space-infix-ops": "off",
    "spaced-comment": "off",
    "camelcase": "off",
    "guard-for-in": "off",
  },
};
