import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepoEventData } from "../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_RELEASED_EVENT_ID
} from "../constants";

export const RepoFullNameVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoFullName`,
        description: "The full name of the GitHub repo (e.g. `crowbartools/Firebot`).",
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
        return (trigger.metadata?.eventData as GitHubRepoEventData)?.repoFullName;
    }
};