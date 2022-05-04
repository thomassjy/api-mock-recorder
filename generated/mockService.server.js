"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var msw_1 = require("msw");
var node_1 = require("msw/node");
var server = (0, node_1.setupServer)(msw_1.rest.all("*", function (req, res, ctx) {
    var urlHref = req.url.href.replace("http://", "").replace("https://", "");
    var artifactPath = path_1["default"].join(__dirname, "./artifact.json");
    var artifactJson = require(artifactPath);
    var artifact = artifactJson;
    var resPath = artifact[urlHref].response;
    resPath = path_1["default"].join(__dirname, "./" + resPath);
    var resJson = require(resPath);
    return res(ctx.json(resJson));
}));
exports["default"] = server;
//# sourceMappingURL=mockService.server.js.map