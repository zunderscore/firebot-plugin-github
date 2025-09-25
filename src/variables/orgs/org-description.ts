import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubOrganization } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const OrgDescriptionVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}OrgDescription`,
        description: "The description of the GitHub organization.",
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
        return (trigger.metadata?.eventData?.org as GitHubOrganization)?.description ?? "";
    }
};