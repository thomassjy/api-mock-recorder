import fs from "fs";
import path from "path";
import { Generated, filePath } from "./constant";

export function initFolder() {
  const filePaths = Object.values(filePath);
  filePaths.unshift(Generated);
  filePaths.forEach((each) => !fs.existsSync(each) && fs.mkdirSync(each));

  fs.copyFile(
    path.join(__dirname, "generated/mockService.js"),
    Generated + "/mockService.js",
    (err) => {
      !!err && console.error(err);
    }
  );
}

export async function writeFileHandler(fileName: string, jsonbody: string) {
  await fs.writeFile(
    fileName,
    jsonbody,
    "utf8",
    (err: NodeJS.ErrnoException | null) => {
      if (err) throw err;
      console.log("write file to: " + fileName);
    }
  );
}
