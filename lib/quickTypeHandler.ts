import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";

import fs from "fs";
import { GENERATED_TYPE } from "./constant";

export default async function quicktypeJSON(
  typeName: string,
  jsonString: string
) {
  const jsonInput = jsonInputForTargetLanguage("typescript");
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inputData,
    lang: "typescript",
    rendererOptions: {
      "just-types": "true",
    },
    inferBooleanStrings: true,
    inferDateTimes: true,
    inferEnums: true,
    inferIntegerStrings: true,
    inferMaps: true,
    inferUuids: true,
  });

  if (!fs.existsSync("generated")) {
    fs.mkdirSync("generated");
  }
  if (!fs.existsSync("generated/types")) {
    fs.mkdirSync("generated/types");
  }
  fs.writeFileSync(GENERATED_TYPE + typeName + ".d.ts", lines.join("\n"));
}
