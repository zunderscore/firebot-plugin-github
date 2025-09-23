import { EventFilter } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager";
import { FILTER_PREFIX } from "../constants";
import { getEventFiltersMatchingPrefix } from "../events";
import { GitHubRepo } from "../github-types";

export const RepoFullNameFilter: EventFilter = {
    id: `${FILTER_PREFIX}:repo-full-name`,
    name: "GitHub Repo Full Name",
    description: "The full name of the GitHub repo, like \"crowbartools/Firebot\"",
    events: [
        ...getEventFiltersMatchingPrefix("") // Everything
    ],
    comparisonTypes: [ "is", "is not" ],
    valueType: "text",
    predicate: async (filterSettings, eventData) => {
        const repoName = (eventData.eventMeta.repo as GitHubRepo).fullName.toLowerCase();
        const value = (filterSettings.value as string).toLowerCase();

        return filterSettings.comparisonType === "is"
            ? repoName === value
            : repoName !== value;
    }
}