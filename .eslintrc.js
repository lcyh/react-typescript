/** @format */

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
      legacyDecorators: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./tsconfig.json",
    createDefaultProgram: true,
  },
  globals: {
    __DEV__: true,
    __ENV__: true,
    __TOKEN__: true,
  },
  rules: {
    "@typescript-eslint/camelcase": [
      "error",
      {
        allow: [
          "^UNSAFE_",
          "child_process",
          "drop_debugger",
          "drop_console",
          "keep_classnames",
          "keep_fnames",
        ],
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-console": "off",
    // 'no-console': [
    // 	'error',
    // 	{
    // 		allow: ['warn', 'error', 'info']
    // 	}
    // ],
    "prefer-destructuring": [
      "error",
      {
        // 变量声明中的数组及对象解构
        VariableDeclarator: {
          array: false,
          object: true,
        },
        // 赋值表达式的数组及对象解构，赋值使用解构代码不易读
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        // 强制属性重命名
        enforceForRenamedProperties: false,
      },
    ],

    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/media-has-caption": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": "warn",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "no-restricted-syntax": "off",
    "no-unused-expressions": "off",
    "import/no-unresolved": "off",
    "react/destructuring-assignment": "warn",
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
    "react/prefer-stateless-function": "off",
    // 使用 TS 无需使用 prop-types
    "react/prop-types": "off",
    "prettier/prettier": "off",
  },
  settings: {
    "import/resolver": {
      alias: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        map: [["@", "./src"]],
      },
    },
  },
};
