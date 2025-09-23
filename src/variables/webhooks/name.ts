import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubWebhook } from "../../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_PING_EVENT_ID,
} from "../../constants";

export const WebhookNameVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}WebhookName`,
        description: "The GitHub webhook name.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based", "advanced" ],
        triggers: {
            event: [
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_PING_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.webhook as GitHubWebhook)?.name ?? "";
    }
};