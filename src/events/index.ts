import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    PLUGIN_NAME,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_PUBLISHED_EVENT_ID
} from "../constants";

export const GitHubEventSource: EventSource = {
    id: GITHUB_EVENT_SOURCE_ID,
    name: PLUGIN_NAME,
    events: [
        {
            id: GITHUB_RELEASE_PUBLISHED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Published`,
            description: "When a release has been published in a GitHub repo"
        }
    ]
}