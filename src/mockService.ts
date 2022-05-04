import path from "path";

import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.all("*", (req, res, ctx) => {
    const urlHref = req.url.href.replace("http://", "").replace("https://", "");

    const artifactPath = path.join(__dirname, "./artifact.json");
    const artifactJson = require(artifactPath);

    const artifact = artifactJson as Record<string, { response: string }>;
    let resPath = artifact[urlHref].response;
    resPath = path.join(__dirname, "./" + resPath);

    const resJson = require(resPath);
    return res(ctx.json(resJson));
  })
);

export default server;
