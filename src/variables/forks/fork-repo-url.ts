import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepo } from "../../github-types";
import {
    EVENT_SOURCE_ID,
    FORKED_EVENT_ID,
    VARIABLE_PREFIX,
} from "../../constants";

export const ForkRepoUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}ForkRepoUrl`,
        description: "The URL of the new fork GitHub repo.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${FORKED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.forkedRepo as GitHubRepo)?.url ?? "";
    }
};