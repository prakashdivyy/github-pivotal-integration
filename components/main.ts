import { Component, ILogger } from "merapi";

export default class Main extends Component {

    constructor(private logger : ILogger) {
        super();
    }

    public async start() {
        this.logger.info("Starting pivgitissue...");
    }
}
