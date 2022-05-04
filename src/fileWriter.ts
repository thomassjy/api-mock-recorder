import fs from "fs";
import path from "path";
import { Generated, filePath } from "./constant";

export function injectRecorder(withRecorder = true) {
  const mainFilePath = process.argv[2];

  if (!fs.existsSync(mainFilePath)) {
    return;
  }

  if (withRecorder) {
    fs.copyFileSync(mainFilePath, mainFilePath + ".bak");
    const data = fs.readFileSync(path.resolve(mainFilePath), "utf8");
    const newData = 'import "api-mock-recorder/dist/recorder";\n' + data;
    fs.writeFileSync(path.resolve(mainFilePath), newData, "utf8");
    return;
  }

  fs.renameSync(mainFilePath + ".bak", mainFilePath);
}

export function initFolder() {
  injectRecorder();
  const filePaths = Object.values(filePath);
  filePaths.unshift(Generated);
  filePaths.forEach((each) => !fs.existsSync(each) && fs.mkdirSync(each));

  fs.copyFileSync(
    path.join(__dirname, "mockService.js"),
    Generated + "/mockService.js"
  );
}

export async function writeFileHandler(fileName: string, jsonbody: string) {
  await fs.writeFileSync(fileName, jsonbody, "utf8");
}
