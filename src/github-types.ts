export type GitHubEventType = 
    | "unknown"
    | "forked"
    | "ping"
    | "pull-request-opened"
    | "pull-request-closed"
    | "release-created"
    | "release-deleted"
    | "release-published"
    | "release-prereleased"
    | "release-released"
    | "starred"

// Shared Types

export type GitHubBaseEventData = {
    type: GitHubEventType;
}

export type GitHubMergeBase = {
    label: string;
    ref: string;
    repo: GitHubRepo;
    sha: string;
    user: GitHubUser;
}

export type GitHubOrganization = {
    name: string;
    description: string;
    url: string;
    avatarUrl: string;
}

export type GitHubPullRequest = {
    number: number;
    title: string;
    body: string;
    url: string;
    createdAt: Date;
    assignee: GitHubUser;
    merged: boolean;
    mergedAt?: Date;
    mergedBy?: GitHubUser;
    base: GitHubMergeBase;
    head: GitHubMergeBase;
}

export type GitHubRelease = {
    version: string;
    url: string;
}

export type GitHubRepo = {
    name: string;
    fullName: string;
    url: string;
    forks: number;
    stars: number;
    isFork: boolean;
}

export type GitHubUser = {
    username: string;
    userId: number;
    profileUrl: string;
    avatarUrl: string;
}

export type GitHubWebhook = {
    id: number;
    name: string;
    active: boolean;
    events: string[];
}

// Forks

type GitHubForkedEventData = GitHubBaseEventData & {
    type: "forked",
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    forkedRepo: GitHubRepo;
}

// Ping

type GitHubPingEventData = GitHubBaseEventData & {
    type: "ping",
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    webhook: GitHubWebhook;
    zen: string;
}

// Pull Requests

export type GitHubPullRequestEventData = GitHubBaseEventData & {
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    pullRequest: GitHubPullRequest;
}

type GitHubPullRequestOpenedEventData = GitHubPullRequestEventData & {
    type: "pull-request-opened";
}

type GitHubPullRequestClosedEventData = GitHubPullRequestEventData & {
    type: "pull-request-closed";
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

// Stars

export type GitHubStar = GitHubBaseEventData & {
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    starredAt: Date;
}

type GitHubStarCreatedEventData = GitHubStar & {
    type: "starred";
}

// Unknown event

export type GitHubUnknownEventData = {
    type: "unknown";
    rawData: any;
}

// Final export

export type GitHubEventData = 
    | GitHubUnknownEventData
    | GitHubForkedEventData
    | GitHubPingEventData
    | GitHubPullRequestOpenedEventData
    | GitHubPullRequestClosedEventData
    | GitHubReleaseCreatedEventData
    | GitHubReleaseDeletedEventData
    | GitHubReleasePrereleasedEventData
    | GitHubReleasePublishedEventData
    | GitHubReleaseReleasedEventData
    | GitHubStarCreatedEventData