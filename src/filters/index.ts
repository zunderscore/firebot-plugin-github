import type { EventSourceAndId } from "@crowbartools/firebot-types";
import { GitHubEventSource } from "../events";
import { EVENT_SOURCE_ID } from "../constants";
import { RepoFullNameFilter } from "./repo-full-name";
import { RepoNameFilter } from "./repo-name";

export const GitHubFilters = [
    RepoFullNameFilter,
    RepoNameFilter
]

export function getAllEventFilters(): EventSourceAndId[] {
    return GitHubEventSource.events.reduce((out, e) => {
        out.push({ eventSourceId: EVENT_SOURCE_ID, eventId: e.id });
        return out;
    }, [] as EventSourceAndId[]);
}

export function getEventFiltersMatchingPrefix(prefix: string): EventSourceAndId[] {
    return GitHubEventSource.events.reduce((out, e) => {
        if (e.id.startsWith(prefix)) {
            out.push({ eventSourceId: EVENT_SOURCE_ID, eventId: e.id });
        }
        return out;
    }, [] as EventSourceAndId[]);
}