import { Component, IConfigReader, ILogger } from "merapi";
import { Request, Response } from "express";
import * as crypto from "crypto";
import { IPivotalManager } from "interfaces/managers";

export default class IndexController extends Component {
    private secret : any;

    constructor(private config : IConfigReader, private logger : ILogger, private pivotalManager : IPivotalManager) {
        super();
        this.secret = this.config.default("github.secret", "");
    }

    public index(req : Request, res : Response) {
        res.status(200).send("Hello World!");
    }

    public async webhook(req : Request, res : Response) {
        const event = req.header("X-GitHub-Event");
        const signature = req.header("X-Hub-Signature");

        const data = req.body;
        const verify = "sha1=" + crypto.createHmac("sha1", this.secret).update(JSON.stringify(data)).digest("hex");

        if (verify !== signature) {
            res.status(401).send({ status: "error" });
        } else {
            res.status(200).send({ status: "ok" });
            if (event === "issues") {
                await this.pivotalManager.createStory(data);
            }
        }
    }
}
