import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    PLUGIN_NAME,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_RELEASED_EVENT_ID
} from "../constants";

export const GitHubEventSource: EventSource = {
    id: GITHUB_EVENT_SOURCE_ID,
    name: PLUGIN_NAME,
    events: [
        {
            id: GITHUB_RELEASE_RELEASED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Released`,
            description: "When a release has been released in a GitHub repo"
        }
    ]
}