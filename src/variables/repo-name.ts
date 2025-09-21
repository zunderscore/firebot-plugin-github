import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepoEventData } from "../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_PUBLISHED_EVENT_ID
} from "../constants";

export const RepoNameVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoName`,
        description: "The short name of the GitHub repo (e.g. `Firebot`).",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_RELEASE_PUBLISHED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as GitHubRepoEventData)?.repoName;
    }
};