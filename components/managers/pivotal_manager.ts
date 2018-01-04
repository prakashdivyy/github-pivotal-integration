import { Component, IConfigReader, ILogger, JsonObject } from "merapi";
import { IPivotalManager } from "interfaces/managers";
import { IIssueDescriptor, IRepoDescriptor } from "interfaces/descriptors";
import * as request from "request-promise";

export default class PivotalManager extends Component implements IPivotalManager {
    private token : any;
    private projectId : any;

    constructor(private config : IConfigReader, private logger : ILogger) {
        super();
        this.token = this.config.default("pivotal.token", "");
        this.projectId = this.config.default("pivotal.projectId", "");
    }

    public async createStory(data : JsonObject) : Promise<void> {
        if (data.action === "opened") {
            const issue : IIssueDescriptor = data.issue as any;
            const repo : IRepoDescriptor = data.repository as any;

            try {
                await request({
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
            } catch (e) {
                this.logger.error(e);
            }
        }
    }
}
