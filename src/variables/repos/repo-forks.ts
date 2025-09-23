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

export const RepoForksVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoForks`,
        description: "The number of times the GitHub repo has been forked.",
        possibleDataOutput: [ "number" ],
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
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.forks ?? 0;
    }
};