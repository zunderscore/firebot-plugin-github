import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRepo } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const RepoFullNameVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}RepoFullName`,
        description: "The full name of the GitHub repo (e.g. `crowbartools/Firebot`).",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("release-")
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.repo as GitHubRepo)?.fullName;
    }
};

function getEventIdsWithPrefix(arg0: string) {
    throw new Error("Function not implemented.");
}
