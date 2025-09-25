import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubIssue } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const IssueIdVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}IssueId`,
        description: "The ID of the GitHub issue.",
        possibleDataOutput: [ "number" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("issue-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.issue as GitHubIssue)?.id ?? 0;
    }
};