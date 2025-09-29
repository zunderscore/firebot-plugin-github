import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPushEventData } from "../../github-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    PUSH_EVENT_ID,
} from "../../constants";

export const PushCompareUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PushCompareUrl`,
        description: "The compare URL of the GitHub push.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based", "advanced" ],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${PUSH_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as GitHubPushEventData)?.compareUrl ?? "";
    }
};