import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepo } from "../../github-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    FORKED_EVENT_ID,
} from "../../constants";

export const ForkRepoNameVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}ForkRepoName`,
        description: "The short name of the new fork GitHub repo (e.g. `Firebot`).",
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
        return (trigger.metadata?.eventData?.forkedRepo as GitHubRepo)?.name ?? "";
    }
};