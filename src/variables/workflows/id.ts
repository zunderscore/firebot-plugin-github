import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubWorkflow } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const WorkflowIdVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}WorkflowId`,
        description: "The ID of the GitHub workflow.",
        possibleDataOutput: [ "number" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("workflow-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.workflow as GitHubWorkflow)?.id ?? 0;
    }
};