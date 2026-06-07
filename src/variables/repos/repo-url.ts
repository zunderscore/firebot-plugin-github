import type { ReplaceVariable } from "@crowbartools/firebot-types";
import { GitHubRepo } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const RepoUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoUrl`,
        description: "The URL of the GitHub repo.",
        possibleDataOutput: ["text"],
        categories: ["trigger based"],
        triggers: {
            event: [
                ...getAllEvents()
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.url ?? "";
    }
};