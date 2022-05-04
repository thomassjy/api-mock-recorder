"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var msw_1 = require("msw");
var artifact_js_1 = __importDefault(require("./client/artifact.js"));
var worker = (0, msw_1.setupWorker)(msw_1.rest.all("*", function (req, res, ctx) {
    var urlHref = req.url.href.replace("http://", "").replace("https://", "");
    var resJson = artifact_js_1["default"][urlHref];
    return res(ctx.json(resJson));
}));
exports["default"] = worker;
//# sourceMappingURL=mockService.client.js.map