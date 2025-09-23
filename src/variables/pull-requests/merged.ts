import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubPullRequest } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const PullRequestMergedVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}PullRequestMerged`,
        description: "`true` if the GitHub pull request has been merged, or `false` otherwise.",
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
        return (trigger.metadata?.eventData?.pullRequest as GitHubPullRequest)?.merged ?? false;
    }
};