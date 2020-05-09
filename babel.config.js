module.exports = {
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-syntax-dynamic-import",
    [
      "babel-plugin-import",
      { libraryName: "antd", libraryDirectory: "es", style: true },
      "antd",
    ],
  ].filter(Boolean),
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: 2,
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  overrides: [
    {
      test: ["./config"],
      presets: [["@babel/preset-env"]],
    },
  ],
};
