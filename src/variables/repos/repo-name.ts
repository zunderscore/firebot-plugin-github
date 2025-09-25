import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepo } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const RepoNameVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoName`,
        description: "The short name of the GitHub repo (e.g. `Firebot`).",
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
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.name ?? "";
    }
};