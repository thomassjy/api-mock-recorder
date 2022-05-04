import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";
import fs from "fs";

import { FilePath } from "./variable";

export default async function quicktypeJSON(
  fileName: string,
  jsonString: string
) {
  // Test parse the JSON object, bail out if failed
  try {
    JSON.parse(jsonString);
  } catch {
    return;
  }

  const jsonInput = jsonInputForTargetLanguage("typescript");
  await jsonInput.addSource({
    name: fileName,
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

  fs.writeFileSync(FilePath.TYPE + "/" + fileName + ".ts", lines.join("\n"));
}
