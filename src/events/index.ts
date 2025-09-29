import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    PLUGIN_NAME,
    EVENT_SOURCE_ID,
    FORKED_EVENT_ID,
    PING_EVENT_ID,
    PULL_REQUEST_OPENED_EVENT_ID,
    PULL_REQUEST_CLOSED_EVENT_ID,
    RELEASE_CREATED_EVENT_ID,
    RELEASE_DELETED_EVENT_ID,
    RELEASE_PRERELEASED_EVENT_ID,
    RELEASE_PUBLISHED_EVENT_ID,
    RELEASE_RELEASED_EVENT_ID,
    STARRED_EVENT_ID,
    ISSUE_OPENED_EVENT_ID,
    ISSUE_CLOSED_EVENT_ID,
    WORKFLOW_RUN_REQUESTED_EVENT_ID,
    WORKFLOW_RUN_COMPLETED_EVENT_ID,
} from "../constants";

export const GitHubEventSource: EventSource = {
    id: EVENT_SOURCE_ID,
    name: PLUGIN_NAME,
    events: [
        // Forks
        {
            id: FORKED_EVENT_ID,
            name: `${PLUGIN_NAME}: Repo Forked`,
            description: "A GitHub repo was forked"
        },

        // Issues
        {
            id: ISSUE_OPENED_EVENT_ID,
            name: `${PLUGIN_NAME}: Issue Opened`,
            description: "A GitHub issue was opened"
        },
        {
            id: ISSUE_CLOSED_EVENT_ID,
            name: `${PLUGIN_NAME}: Issue Closed`,
            description: "A GitHub issue was closed"
        },

        // PING?
        {
            id: PING_EVENT_ID,
            name: `${PLUGIN_NAME}: Ping`,
            description: "A test message sent when a GitHub webhook is created"
        },
        // PONG!

        // Pull Requests
        {
            id: PULL_REQUEST_OPENED_EVENT_ID,
            name: `${PLUGIN_NAME}: Pull Request Opened`,
            description: "A GitHub pull request was created"
        },
        {
            id: PULL_REQUEST_CLOSED_EVENT_ID,
            name: `${PLUGIN_NAME}: Pull Request Closed`,
            description: "A GitHub pull request was either merged or closed without being merged"
        },

        // Releases
        {
            id: RELEASE_CREATED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Created`,
            description: "A GitHub release draft was saved, or a release/pre-release was published without previously being saved as a draft"
        },
        {
            id: RELEASE_DELETED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Deleted`,
            description: "A GitHub release, pre-release, or draft release was deleted"
        },
        {
            id: RELEASE_PRERELEASED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Prereleased`,
            description: "A GitHub release was created and identified as a pre-release"
        },
        {
            id: RELEASE_PUBLISHED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Published`,
            description: "A GitHub release, pre-release, or draft of a release was published"
        },
        {
            id: RELEASE_RELEASED_EVENT_ID,
            name: `${PLUGIN_NAME}: Release Released`,
            description: "A GitHub release was published, or a pre-release was changed to a release"
        },

        // Stars
        {
            id: STARRED_EVENT_ID,
            name: `${PLUGIN_NAME}: Repo Starred`,
            description: "When someone stars a GitHub repo"
        },
        
        // Workflow Runs
        {
            id: WORKFLOW_RUN_REQUESTED_EVENT_ID,
            name: `${PLUGIN_NAME}: Workflow Run Requested`,
            description: "When a GitHub workflow run is requested"
        },
        {
            id: WORKFLOW_RUN_COMPLETED_EVENT_ID,
            name: `${PLUGIN_NAME}: Workflow Run Completed`,
            description: "When a GitHub workflow run is completed"
        },
    ]
}

export function getAllEvents(): string[] {
    return GitHubEventSource.events.reduce((out, e) => {
        out.push(`${EVENT_SOURCE_ID}:${e.id}`);
        return out;
    }, [] as string[]);
}

export function getEventsMatchingPrefix(prefix: string): string[] {
    return GitHubEventSource.events.reduce((out, e) => {
        if (e.id.startsWith(prefix)) {
            out.push(`${EVENT_SOURCE_ID}:${e.id}`);
        }
        return out;
    }, [] as string[]);
}