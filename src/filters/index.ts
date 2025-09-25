import { FilterEvent } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager";
import { GitHubEventSource } from "../events";
import { GITHUB_EVENT_SOURCE_ID } from "../constants";
import { RepoFullNameFilter } from "./repo-full-name";
import { RepoNameFilter } from "./repo-name";

export const GitHubFilters = [
    RepoFullNameFilter,
    RepoNameFilter
]

export function getAllEventFilters(): FilterEvent[] {
    return GitHubEventSource.events.reduce((out, e) => {
        out.push({ eventSourceId: GITHUB_EVENT_SOURCE_ID, eventId: e.id });
        return out;
    }, [] as FilterEvent[]);
}

export function getEventFiltersMatchingPrefix(prefix: string): FilterEvent[] {
    return GitHubEventSource.events.reduce((out, e) => {
        if (e.id.startsWith(prefix)) {
            out.push({ eventSourceId: GITHUB_EVENT_SOURCE_ID, eventId: e.id });
        }
        return out;
    }, [] as FilterEvent[]);
}