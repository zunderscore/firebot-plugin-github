import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { GitHubOrganization } from "../../github-types";
import {
    VARIABLE_PREFIX,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_FORKED_EVENT_ID,
    GITHUB_PING_EVENT_ID,
    GITHUB_STARRED_EVENT_ID,
} from "../../constants";
import { getEventsMatchingPrefix } from "../../events";

export const OrgAvatarUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}OrgAvatarUrl`,
        description: "The avatar URL of the GitHub organization.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                ...getEventsMatchingPrefix("pull-request-"),
                ...getEventsMatchingPrefix("release-"),
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_FORKED_EVENT_ID}`,
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_PING_EVENT_ID}`,
                `${GITHUB_EVENT_SOURCE_ID}:${GITHUB_STARRED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData?.org as GitHubOrganization)?.avatarUrl ?? "";
    }
};