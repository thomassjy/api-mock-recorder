import webpack from "webpack";
import TerserWebpackPlugin from "terser-webpack-plugin";
import path from "path";

export default function buildClient() {
  return new Promise((resolve) =>
    webpack(
      {
        mode: "production",
        entry: "./generated/client.js",
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            },
            {
              test: /\.node$/,
              loader: "node-loader",
            },
          ],
        },
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".node"],
        },
        optimization: {
          minimize: true,
          minimizer: [new TerserWebpackPlugin()],
        },
        output: {
          filename: "artifact.js",
          path: path.resolve("./generated/client"),
        },
      },
      (err, stats) => {
        resolve(err || stats?.hasErrors());
      }
    )
  );
}
