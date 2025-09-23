import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPushEventData } from "../../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_PUSH_EVENT_ID,
} from "../../constants";

export const PushFilesAddedVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PushFilesAdded`,
        description: "An array of files added via the GitHub push's head commit.",
        possibleDataOutput: [ "array" ],
        categories: [ "trigger based", "advanced" ],
        triggers: {
            event: [
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_PUSH_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as GitHubPushEventData)?.headCommit?.added ?? [];
    }
};