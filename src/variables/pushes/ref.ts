import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPushEventData } from "../../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_PUSH_EVENT_ID,
} from "../../constants";

export const PushRefVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PushRef`,
        description: "The full git ref of the GitHub push (e.g. `refs/heads/main` or `refs/tags/1.0.0`).",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based", "advanced" ],
        triggers: {
            event: [
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_PUSH_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as GitHubPushEventData)?.ref ?? "";
    }
};