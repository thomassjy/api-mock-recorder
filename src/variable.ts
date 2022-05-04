import yargs from "yargs";

export const ARGV = yargs
  .option("file", {
    alias: "f",
    description: "Main file path to temp path import",
    type: "string",
  })
  .option("output", {
    alias: "o",
    description: "Output generated file",
    type: "string",
  })
  .help()
  .alias("help", "h").argv;

export const RECORDER_PATH = "api-mock-recorder/dist/recorder";
export const MOCK_ENDPOINT = "http://mock.dev";
export const GENERATED = ARGV.output || "generated";
export const MOCK_FOLDER = "mock";
export const TYPE_FOLDER = "type";

export const FilePath = {
  MOCK: GENERATED + "/" + MOCK_FOLDER,
  TYPE: GENERATED + "/" + TYPE_FOLDER,
};
