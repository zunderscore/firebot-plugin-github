import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPushEventData } from "../../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_PUSH_EVENT_ID,
} from "../../constants";

export const PushPreviousCommitVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PushPreviousCommit`,
        description: "The SHA of the most recent commit before the GitHub push.",
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
        return (trigger.metadata?.eventData as GitHubPushEventData)?.previousCommit ?? "";
    }
};