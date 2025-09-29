import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPushEventData } from "../../github-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    PUSH_EVENT_ID,
} from "../../constants";

export const PushWasForcedVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PushWasForced`,
        description: "`true` if the GitHub push was forced, or `false` otherwise.",
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
        return (trigger.metadata?.eventData as GitHubPushEventData)?.forced ?? false;
    }
};