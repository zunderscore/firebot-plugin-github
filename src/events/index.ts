import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    PLUGIN_NAME,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_CREATED_EVENT_ID,
    GITHUB_RELEASE_DELETED_EVENT_ID,
    GITHUB_RELEASE_PRERELEASED_EVENT_ID,
    GITHUB_RELEASE_PUBLISHED_EVENT_ID,
    GITHUB_RELEASE_RELEASED_EVENT_ID,
} from "../constants";

export const GitHubEventSource: EventSource = {
    id: GITHUB_EVENT_SOURCE_ID,
    name: PLUGIN_NAME,
    events: [

        // Releases
        {
            id: GITHUB_RELEASE_CREATED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Created`,
            description: "A GitHub release draft was saved, or a release/pre-release was published without previously being saved as a draft"
        },
        {
            id: GITHUB_RELEASE_DELETED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Deleted`,
            description: "A GitHub release, pre-release, or draft release was deleted"
        },
        {
            id: GITHUB_RELEASE_PRERELEASED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Prereleased`,
            description: "A GitHub release was created and identified as a pre-release"
        },
        {
            id: GITHUB_RELEASE_PUBLISHED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Published`,
            description: "A GitHub release, pre-release, or draft of a release was published"
        },
        {
            id: GITHUB_RELEASE_RELEASED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Released`,
            description: "A GitHub release was published, or a pre-release was changed to a release"
        },
    ]
}

export function getEventsMatchingPrefix(prefix: string): string[] {
    return GitHubEventSource.events.reduce((out, e) => {
        if (e.id.startsWith(prefix)) {
            out.push(`${GITHUB_EVENT_SOURCE_ID}:${e.id}`)
        }
        return out;
    }, [] as string[]);
}