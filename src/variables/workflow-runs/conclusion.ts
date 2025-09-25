import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubWorkflowRun } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const WorkflowRunConclusionVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}WorkflowRunConclusion`,
        description: "The conclusion of the GitHub workflow tun.",
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
        return (trigger.metadata?.eventData?.workflowRun as GitHubWorkflowRun)?.conclusion ?? "";
    }
};