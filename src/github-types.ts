export type GitHubEventType = 
    | "unknown"
    | "release-created"
    | "release-deleted"
    | "release-published"
    | "release-prereleased"
    | "release-released"

// Shared Types

export type GitHubBaseEventData = {
    type: GitHubEventType;
}

export type GitHubUser = {
    username: string;
    userId: number;
    profileUrl: string;
    avatarUrl: string;
}

export type GitHubOrganization = {
    name: string;
    description: string;
    url: string;
    avatarUrl: string;
}

export type GitHubRepo = {
    name: string;
    fullName: string;
    url: string;
}

export type GitHubRelease = {
    version: string;
    url: string;
}

// Releases

export type GitHubReleaseEventData = GitHubBaseEventData & {
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    release: GitHubRelease;
}

type GitHubReleaseCreatedEventData = GitHubReleaseEventData & {
    type: "release-created";
}

type GitHubReleaseDeletedEventData = GitHubReleaseEventData & {
    type: "release-deleted";
}

type GitHubReleasePublishedEventData = GitHubReleaseEventData & {
    type: "release-published";
}

type GitHubReleasePrereleasedEventData = GitHubReleaseEventData & {
    type: "release-prereleased";
}

type GitHubReleaseReleasedEventData = GitHubReleaseEventData & {
    type: "release-released";
}

// Unknown event

export type GitHubUnknownEventData = {
    type: "unknown";
    rawData: any;
}

// Final export

export type GitHubEventData = 
    | GitHubUnknownEventData
    | GitHubReleaseCreatedEventData
    | GitHubReleaseDeletedEventData
    | GitHubReleasePrereleasedEventData
    | GitHubReleasePublishedEventData
    | GitHubReleaseReleasedEventData