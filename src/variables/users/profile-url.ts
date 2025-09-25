import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubUser } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const ProfileUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}ProfileUrl`,
        description: "The GitHub user profile URL.",
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
        return (trigger.metadata?.eventData?.user as GitHubUser)?.profileUrl ?? "";
    }
};