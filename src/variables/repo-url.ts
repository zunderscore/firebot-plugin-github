import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepoEventData } from "../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_RELEASED_EVENT_ID
} from "../constants";

export const RepoUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoUrl`,
        description: "The URL of the GitHub repo.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_RELEASE_RELEASED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as GitHubRepoEventData)?.repoUrl;
    }
};