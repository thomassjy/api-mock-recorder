import fs from "fs";
import path from "path";
import { GENERATED, FilePath, RECORDER_PATH, ARGV } from "./variable";

export function injectRecorder(withRecorder = true) {
  const mainFilePath = ARGV.file;
  if (!fs.existsSync(mainFilePath)) {
    return;
  }

  if (withRecorder) {
    fs.copyFileSync(mainFilePath, mainFilePath + ".bak");
    const data = fs.readFileSync(path.resolve(mainFilePath), "utf8");
    const newData = `import "${RECORDER_PATH}";\n` + data;
    fs.writeFileSync(path.resolve(mainFilePath), newData, "utf8");
    return;
  }

  fs.renameSync(mainFilePath + ".bak", mainFilePath);
}

export function initFileAndFolder() {
  injectRecorder();
  const filePaths = [
    ...GENERATED.split("/").reduce(
      (res: string[], each: string) => [...res, [...res, each].join("/")],
      []
    ),
    ...Object.values(FilePath),
  ];
  filePaths.forEach((each) => !fs.existsSync(each) && fs.mkdirSync(each));

  fs.copyFileSync(
    path.join(__dirname, "mockService.js"),
    GENERATED + "/mockService.js"
  );
}

export async function writeFileHandler(fileName: string, jsonbody: string) {
  await fs.writeFileSync(fileName, jsonbody, "utf8");
}
