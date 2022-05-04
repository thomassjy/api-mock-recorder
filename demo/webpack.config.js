const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./demo/client.ts",
  module: {
    rules: [
      {
        test: /\.tsx|\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "client.js",
    path: path.resolve("./demo"),
  },
};
