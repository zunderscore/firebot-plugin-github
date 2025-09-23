import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepo } from "../../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_FORKED_EVENT_ID,
    GITHUB_PING_EVENT_ID,
    GITHUB_STARRED_EVENT_ID,
} from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const RepoFullNameVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoFullName`,
        description: "The full name of the GitHub repo (e.g. `crowbartools/Firebot`).",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("pull-request-"),
                ...getEventsMatchingPrefix("release-"),
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_FORKED_EVENT_ID}`,
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_PING_EVENT_ID}`,
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_STARRED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.fullName ?? "";
    }
};