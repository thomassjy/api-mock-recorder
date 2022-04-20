import fs from "fs";

export function writeFileHandler(fileName: string, jsonbody: string) {
  if (!fs.existsSync("generated")) {
    fs.mkdirSync("generated");
  }
  if (!fs.existsSync("generated/mocks")) {
    fs.mkdirSync("generated/mocks");
  }
  fs.writeFile(
    fileName,
    jsonbody,
    "utf8",
    (err: NodeJS.ErrnoException | null) => {
      if (err) throw err;
      console.log("write file to: " + fileName);
    }
  );
}
