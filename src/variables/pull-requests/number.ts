import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPullRequest } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const PullRequestNumberVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PullRequestNumber`,
        description: "The number of the GitHub pull request.",
        possibleDataOutput: [ "number" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("pull-request-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.pullRequest as GitHubPullRequest)?.number ?? 0;
    }
};