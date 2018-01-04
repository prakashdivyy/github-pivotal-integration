"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const merapi_1 = require("merapi");
const crypto = require("crypto");
class IndexController extends merapi_1.Component {
    constructor(config, logger, pivotalManager) {
        super();
        this.config = config;
        this.logger = logger;
        this.pivotalManager = pivotalManager;
        this.secret = this.config.default("github.secret", "");
    }
    index(req, res) {
        res.status(200).send("Hello World!");
    }
    webhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = req.header("X-GitHub-Event");
            const signature = req.header("X-Hub-Signature");
            const data = req.body;
            const verify = "sha1=" + crypto.createHmac("sha1", this.secret).update(JSON.stringify(data)).digest("hex");
            if (verify !== signature) {
                res.status(401).send({ status: "error" });
            }
            else {
                res.status(200).send({ status: "ok" });
                if (event === "issues") {
                    yield this.pivotalManager.createStory(data);
                }
            }
        });
    }
}
exports.default = IndexController;
//# sourceMappingURL=index_controller.js.map