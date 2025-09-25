import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepo } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const RepoIsForkVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoIsFork`,
        description: "`true` if the GitHub repo is a fork of another repo, or `false` otherwise.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getAllEvents()
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.isFork ?? false;
    }
};