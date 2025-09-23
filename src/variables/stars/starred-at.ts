import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_STARRED_EVENT_ID,
} from "../../constants";

export const StarredAtVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}StarredAt`,
        description: "The date and time when the GitHub repo was starred.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_STARRED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return trigger.metadata?.eventData?.starredAt ?? "";
    }
};