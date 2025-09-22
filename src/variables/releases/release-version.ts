import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubRelease } from "../../github-types";
import { VARIABLE_PREFIX } from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const ReleaseVersionVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}ReleaseVersion`,
        description: "The version/tag name of the GitHub release.",
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
        return (trigger.metadata?.eventData?.release as GitHubRelease)?.version;
    }
};