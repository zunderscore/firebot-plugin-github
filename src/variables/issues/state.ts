import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubIssue } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const IssueStateVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}IssueState`,
        description: "The state of the GitHub issue, either `open` or `closed`.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("issue-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.issue as GitHubIssue)?.state ?? "";
    }
};