import { EventFilter } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager";
import { FILTER_PREFIX } from "../constants";
import { getEventFiltersMatchingPrefix } from "../events";
import { GitHubRepo } from "../github-types";

export const RepoNameFilter: EventFilter = {
    id: `${FILTER_PREFIX}:repo-name`,
    name: "GitHub Repo Name",
    description: "The short name of the GitHub repo, like \"Firebot\"",
    events: [
        ...getEventFiltersMatchingPrefix("") // Everything
    ],
    comparisonTypes: [ "is", "is not" ],
    valueType: "text",
    predicate: async (filterSettings, eventData) => {
        const repoName = (eventData.eventMeta.repo as GitHubRepo).name.toLowerCase();
        const value = (filterSettings.value as string).toLowerCase();

        return filterSettings.comparisonType === "is"
            ? repoName === value
            : repoName !== value;
    }
}