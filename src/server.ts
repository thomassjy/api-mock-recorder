import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { JsonDB } from "node-json-db";
import cors from "cors";
import express, { Request, Response } from "express";

import { filePath, MockFolder } from "./constant";
import { initFolder, injectRecorder, writeFileHandler } from "./fileWriter";
import quicktypeJSON from "./typeHandler";

export interface BodyType {
  url: string;
  spec: string;
  result: string;
  method: "post" | "get";
}

const PORT = 3005;

initFolder();
const dbJson = new JsonDB(new Config("generated/artifact", true, false, "~"));

/**
 * Setup Express service
 */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/record-api", async function (req: Request, res: Response) {
  const { url, spec, result, method } = req.body as BodyType;

  const prefix = [
    method[0].toUpperCase(),
    method.substring(1).toLowerCase(),
  ].join("");

  // Tidy up URL
  const splitProtocol = url.split("://");
  splitProtocol.shift();
  let sanitizedUrl = splitProtocol[0].split("/");
  sanitizedUrl.shift();
  sanitizedUrl = sanitizedUrl.map((each: string) =>
    each
      ? String(each[0]).toUpperCase() + String(each.substring(1)).toLowerCase()
      : ""
  );

  const fileName = prefix + sanitizedUrl.join("");
  const requestFile = filePath.mock + "/" + fileName + "Req.json";
  const responseFile = filePath.mock + "/" + fileName + "Res.json";

  const jsonReq = spec || "";
  const jsonRes = result || "";

  await Promise.all([
    writeFileHandler(requestFile, jsonReq),
    writeFileHandler(responseFile, jsonRes),
    quicktypeJSON(fileName + "Req", jsonReq),
    quicktypeJSON(fileName + "Res", jsonRes),
  ]).catch((error) => console.error(error));

  dbJson.push("~" + splitProtocol[0], {
    request: MockFolder + "/" + fileName + "Req.json",
    response: MockFolder + "/" + fileName + "Res.json",
  });

  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Record Proxy listening at http://localhost:${PORT}`);
});

// Return back main file
process.stdin.resume();
process.on("SIGINT", async () => {
  injectRecorder(false);
  process.exit();
});
