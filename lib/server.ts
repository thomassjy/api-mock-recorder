import cors from 'cors';
import express, { Request, Response } from 'express';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

import { GENERATED_MOCK } from './constant';

import { writeFileHandler } from './fileWriter';
import quicktypeJSON from './quickTypeHandler';

const app = express();
const port = 3005;
const dbJson = new JsonDB(new Config('generated/artifact', true, false, '~'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export interface BodyType {
  url: string;
  spec: string;
  result: string;
  method: 'post' | 'get';
}

app.post('/recordAPI', async function (req: Request, res: Response) {
  try {
    const { url, spec: jsonReq, result: jsonRes, method } = req.body as BodyType;

    const prefix = method[0].toUpperCase() + method.substring(1).toLowerCase() + '_';

    const splitProtocol = url.split('://');
    splitProtocol.shift();
    const sanitizedUrl = splitProtocol[0].split('/');
    sanitizedUrl.shift();

    const fileName =
      prefix +
      sanitizedUrl
        .map((each: string) => (each ? String(each[0]).toUpperCase() + String(each.substring(1)).toLowerCase() : null))
        .join('');

    writeFileHandler(GENERATED_MOCK + fileName + 'Req.json', jsonReq);
    writeFileHandler(GENERATED_MOCK + fileName + 'Res.json', jsonRes);

    dbJson.push('~' + splitProtocol[0], {
      request: GENERATED_MOCK + fileName + 'Req.json',
      response: GENERATED_MOCK + fileName + 'Res.json',
    });

    await Promise.all([quicktypeJSON(fileName + 'Request', jsonReq), quicktypeJSON(fileName + 'Result', jsonRes)]);
  } catch (error) {
    console.error(error);
  }

  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`Record Proxy listening at http://localhost:${port}`);
});
