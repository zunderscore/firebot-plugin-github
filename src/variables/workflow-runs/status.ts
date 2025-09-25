import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubWorkflowRun } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const WorkflowRunStatusVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}WorkflowRunStatus`,
        description: "The status of the GitHub workflow run.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("workflow-run-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.workflowRun as GitHubWorkflowRun)?.status ?? "";
    }
};