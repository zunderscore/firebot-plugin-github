import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubIssue } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const IssueBodyVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}IssueBody`,
        description: "The body of the GitHub issue.",
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
        return (trigger.metadata?.eventData?.issue as GitHubIssue)?.body ?? "";
    }
};