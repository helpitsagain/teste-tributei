const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx", // O ponto de entrada do seu código
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
    hot: true, // Ativa o Hot Module Replacement
    open: true, // Abre o navegador automaticamente
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
