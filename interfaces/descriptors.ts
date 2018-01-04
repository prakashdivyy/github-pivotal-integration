import { JsonObject } from "merapi";

export interface IIssueDescriptor {
    title : string;
    body : string;
    html_url : string;
    user : JsonObject;
}


export interface IRepoDescriptor {
    name : string;
}
