import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubIssue } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const IssueTypeVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}IssueType`,
        description: "The type of the GitHub issue (e.g. `Bug`).",
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
        return (trigger.metadata?.eventData?.issue as GitHubIssue)?.type?.name ?? "";
    }
};