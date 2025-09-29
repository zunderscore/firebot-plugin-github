import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPushEventData } from "../../github-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    PUSH_EVENT_ID,
} from "../../constants";

export const PushFilesRemovedVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PushFilesRemoved`,
        description: "An array of files removed via the GitHub push's head commit.",
        possibleDataOutput: [ "array" ],
        categories: [ "trigger based", "advanced" ],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${PUSH_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as GitHubPushEventData)?.headCommit?.removed ?? [];
    }
};