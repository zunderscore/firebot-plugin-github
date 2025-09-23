import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPullRequest } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const PullRequestBodyVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PullRequestBody`,
        description: "The body of the GitHub pull request.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("pull-request-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.pullRequest as GitHubPullRequest)?.body ?? "";
    }
};