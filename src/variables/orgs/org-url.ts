import type { ReplaceVariable } from "@crowbartools/firebot-types";
import { GitHubOrganization } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getAllEvents } from "../../events";

export const OrgUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}OrgUrl`,
        description: "The URL of the GitHub organization.",
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
        return (trigger.metadata?.eventData?.org as GitHubOrganization)?.url ?? "";
    }
};