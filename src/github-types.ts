export type GitHubEventType = 
    | "unknown"
    | "forked"
    | "issue-closed"
    | "issue-opened"
    | "ping"
    | "pull-request-opened"
    | "pull-request-closed"
    | "push"
    | "release-created"
    | "release-deleted"
    | "release-published"
    | "release-prereleased"
    | "release-released"
    | "starred"
    | "workflow-run-requested"
    | "workflow-run-completed"

// Shared Types

export type GitHubBaseEventData = {
    type: GitHubEventType;
}

export type GitHubAuthor = {
    username: string;
    name: string;
    email: string;
    date: Date;
}

export type GitHubCommit = {
    message: string;
    id: string;
    treeId: string;
    timestamp: Date;
    author: GitHubAuthor;
    committer: GitHubAuthor;
    added: string[];
    modified: string[];
    removed: string[];
}

export type GitHubIssue = {
    id: number;
    type: GitHubIssueType;
    state: "open" | "closed";
    title: string;
    body: string;
    labels: GitHubLabel[];
    url: string;
    createdAt: Date;
    closedAt: Date;
}

export type GitHubIssueType = {
    id: number;
    name: string;
    description: string;
    color: string;
    enabled: boolean;
}

export type GitHubLabel = {
    id: number;
    name: string;
    description: string;
    color: string;
    default: boolean;
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

export type GitHubWorkflow = {
    id: number;
    name: string;
    state: string;
    url: string;
    badgeUrl: string;
}

export type GitHubWorkflowRun = {
    id: number;
    name: string;
    headCommit: GitHubCommit;
    status: "requested" | "in_progress" | "completed" | "queued" | "pending" | "waiting";
    runNumber: number;
    runAttempt: number;
    conclusion: "success" | "failure" | "neutral" | "cancelled" | "timed_out" | "action_required" | "stale" | "skipped" | "startup_failure";
    url: string;
}

// Forks

type GitHubForkedEventData = GitHubBaseEventData & {
    type: "forked";
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    forkedRepo: GitHubRepo;
}

// Issues

type GitHubIssueEventData = GitHubBaseEventData & {
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    issue: GitHubIssue;
}

type GitHubIssueClosedEventData = GitHubIssueEventData & {
    type: "issue-closed";
}

type GitHubIssueOpenedEventData = GitHubIssueEventData & {
    type: "issue-opened";
}

// Ping

type GitHubPingEventData = GitHubBaseEventData & {
    type: "ping";
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    webhook: GitHubWebhook;
    zen: string;
}

// Pull Requests

type GitHubPullRequestEventData = GitHubBaseEventData & {
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

// Push

export type GitHubPushEventData = GitHubBaseEventData & {
    type: "push";
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    pusher: GitHubAuthor;
    previousCommit: string;
    newCommit: string;
    compareUrl: string;
    ref: string;
    createdRef: boolean;
    deletedRef: boolean;
    forced: boolean;
    headCommit: GitHubCommit;
    commits: GitHubCommit[];
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

// Workflow Runs

type GitHubWorkflowRunEventData = GitHubBaseEventData & {
    user: GitHubUser;
    org: GitHubOrganization;
    repo: GitHubRepo;
    workflow: GitHubWorkflow;
    workflowRun: GitHubWorkflowRun;
}

type GitHubWorkflowRunRequestedEventData = GitHubWorkflowRunEventData & {
    type: "workflow-run-requested";
}

type GitHubWorkflowRunCompletedEventData = GitHubWorkflowRunEventData & {
    type: "workflow-run-completed";
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
    | GitHubIssueClosedEventData
    | GitHubIssueOpenedEventData
    | GitHubPingEventData
    | GitHubPullRequestOpenedEventData
    | GitHubPullRequestClosedEventData
    | GitHubPushEventData
    | GitHubReleaseCreatedEventData
    | GitHubReleaseDeletedEventData
    | GitHubReleasePrereleasedEventData
    | GitHubReleasePublishedEventData
    | GitHubReleaseReleasedEventData
    | GitHubStarCreatedEventData
    | GitHubWorkflowRunRequestedEventData
    | GitHubWorkflowRunCompletedEventData