import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubUser } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const UserIdVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}UserId`,
        description: "The GitHub user ID.",
        possibleDataOutput: [ "number" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getAllEvents()
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.user as GitHubUser)?.userId ?? 0;
    }
};