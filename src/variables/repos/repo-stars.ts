import type { ReplaceVariable } from "@crowbartools/firebot-types";
import { GitHubRepo } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const RepoStarsVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoStars`,
        description: "The number of times the GitHub repo has been starred.",
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
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.stars ?? 0;
    }
};