import { JsonArray, JsonObject } from "merapi";

export interface IPivotalManager {
    createStory(data : JsonObject) : Promise<void>;
}
