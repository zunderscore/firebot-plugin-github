import { createEventHandler, EmitterWebhookEventName } from "@octokit/webhooks";
import { components } from "@octokit/openapi-webhooks-types";
import {
    GitHubEventData,
    GitHubUnknownEventData,
    GitHubUser,
    GitHubOrganization,
    GitHubRepo,
    GitHubRelease
} from "./github-types";

import {
    GITHUB_RELEASE_CREATED_EVENT_ID,
    GITHUB_RELEASE_DELETED_EVENT_ID,
    GITHUB_RELEASE_PRERELEASED_EVENT_ID,
    GITHUB_RELEASE_PUBLISHED_EVENT_ID,
    GITHUB_RELEASE_RELEASED_EVENT_ID,
} from "./constants";

function createUnknownEvent(event: any): GitHubUnknownEventData {
    return {
        type: "unknown",
        rawData: event
    }
}

function getUserInfo(user: components["schemas"]["simple-user"]): GitHubUser {
    return {
        username: user?.login,
        userId: user?.id,
        profileUrl: user?.html_url,
        avatarUrl: user?.avatar_url
    };
}

function getOrganizationInfo(org: components["schemas"]["organization-simple-webhooks"]): GitHubOrganization {
    return {
        name: org?.login,
        description: org?.description,
        url: org?.url,
        avatarUrl: org?.avatar_url
    }
}

function getRepoInfo(repository: components["schemas"]["repository"]): GitHubRepo {
    return {
        name: repository?.name,
        fullName: repository?.full_name,
        url: repository?.html_url,
    };
}

function getReleaseInfo(release: components["schemas"]["webhooks_release"]): GitHubRelease {
    return {
        version: release?.tag_name,
        url: release?.html_url
    }
}

export const githubEventHandler = createEventHandler({
    async transform(githubEvent): Promise<{ eventData: GitHubEventData }> {
        let eventData: Partial<GitHubEventData> = createUnknownEvent(githubEvent);
        
        switch (githubEvent.name) {
            case "release":
                eventData = {
                    user: getUserInfo(githubEvent.payload.sender),
                    org: getOrganizationInfo(githubEvent.payload.organization),
                    repo: getRepoInfo(githubEvent.payload.repository),
                    release: getReleaseInfo(githubEvent.payload.release)
                }
                switch (githubEvent.payload.action){
                    case "created":
                        eventData.type = GITHUB_RELEASE_CREATED_EVENT_ID;
                        break;
                    case "deleted":
                        eventData.type = GITHUB_RELEASE_DELETED_EVENT_ID;
                        break;
                    case "prereleased":
                        eventData.type = GITHUB_RELEASE_PRERELEASED_EVENT_ID;
                        break;
                    case "published":
                        eventData.type = GITHUB_RELEASE_PUBLISHED_EVENT_ID;
                        break;
                    case "released": 
                        eventData.type = GITHUB_RELEASE_RELEASED_EVENT_ID;
                        break;
                }
                break;
        }

        return { eventData: eventData as GitHubEventData };
    }
});

export const githubEvents: EmitterWebhookEventName[] = [
    "release.created",
    "release.deleted",
    "release.prereleased",
    "release.published",
    "release.released"
]