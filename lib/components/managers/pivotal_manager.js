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
const request = require("request-promise");
class PivotalManager extends merapi_1.Component {
    constructor(config, logger) {
        super();
        this.config = config;
        this.logger = logger;
        this.token = this.config.default("pivotal.token", "");
        this.projectId = this.config.default("pivotal.projectId", "");
    }
    createStory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.action === "opened") {
                const issue = data.issue;
                const repo = data.repository;
                try {
                    yield request({
                        method: "POST",
                        uri: "https://www.pivotaltracker.com/services/v5/projects/" + this.projectId + "/stories",
                        body: {
                            description: issue.body + "\n\nRequester: " + issue.user.html_url + "\nIssue URL: " + issue.html_url,
                            name: issue.title,
                            labels: [repo.name, "github-issue"],
                        },
                        headers: {
                            "X-TrackerToken": this.token,
                        },
                        json: true
                    });
                    this.logger.info(`Success creating story in pivotal`);
                }
                catch (e) {
                    this.logger.error(e);
                }
            }
        });
    }
}
exports.default = PivotalManager;
//# sourceMappingURL=pivotal_manager.js.map