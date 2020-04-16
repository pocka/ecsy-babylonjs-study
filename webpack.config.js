const path = require("path");

const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".mjs"],
  },
  plugins: [
    new HtmlPlugin({
      scriptLoading: "defer",
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    compress: true,
  },
};
