import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubWorkflowRun } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const WorkflowRunIdVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}WorkflowRunId`,
        description: "The ID of the GitHub workflow run.",
        possibleDataOutput: [ "number" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("workflow-run-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.workflowRun as GitHubWorkflowRun)?.id ?? 0;
    }
};