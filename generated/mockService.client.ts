import { rest, setupWorker } from "msw";
// @ts-ignore
import artifact from "./client/artifact.js";

const worker = setupWorker(
  rest.all("*", (req, res, ctx) => {
    const urlHref = req.url.href.replace("http://", "").replace("https://", "");
    const resJson = artifact[urlHref];
    return res(ctx.json(resJson));
  })
);

export default worker;
