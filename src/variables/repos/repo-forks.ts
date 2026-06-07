import type { ReplaceVariable } from "@crowbartools/firebot-types";
import { GitHubRepo } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const RepoForksVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoForks`,
        description: "The number of times the GitHub repo has been forked.",
        possibleDataOutput: ["number"],
        categories: ["trigger based"],
        triggers: {
            event: [
                ...getAllEvents()
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.forks ?? 0;
    }
};