import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubReleasePublishedEventData } from "../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_PUBLISHED_EVENT_ID
} from "../constants";

export const ReleaseVersionVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}ReleaseVersion`,
        description: "The version/tag name of the GitHub release.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_RELEASE_PUBLISHED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as GitHubReleasePublishedEventData)?.releaseVersion;
    }
};