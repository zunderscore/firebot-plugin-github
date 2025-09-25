import { createEventHandler, EmitterWebhookEventName } from "@octokit/webhooks";
import { components } from "@octokit/openapi-webhooks-types";
import {
    GitHubEventData,
    GitHubUnknownEventData,
    GitHubAuthor,
    GitHubCommit,
    GitHubIssue,
    GitHubOrganization,
    GitHubPullRequest,
    GitHubRelease,
    GitHubRepo,
    GitHubUser,
    GitHubWebhook,
    GitHubWorkflow,
    GitHubWorkflowRun,
} from "./github-types";

import {
    GITHUB_FORKED_EVENT_ID,
    GITHUB_ISSUE_OPENED_EVENT_ID,
    GITHUB_ISSUE_CLOSED_EVENT_ID,
    GITHUB_PING_EVENT_ID,
    GITHUB_PULL_REQUEST_OPENED_EVENT_ID,
    GITHUB_PULL_REQUEST_CLOSED_EVENT_ID,
    GITHUB_PUSH_EVENT_ID,
    GITHUB_RELEASE_CREATED_EVENT_ID,
    GITHUB_RELEASE_DELETED_EVENT_ID,
    GITHUB_RELEASE_PRERELEASED_EVENT_ID,
    GITHUB_RELEASE_PUBLISHED_EVENT_ID,
    GITHUB_RELEASE_RELEASED_EVENT_ID,
    GITHUB_STARRED_EVENT_ID,
    GITHUB_WORKFLOW_RUN_REQUESTED_EVENT_ID,
    GITHUB_WORKFLOW_RUN_COMPLETED_EVENT_ID,
} from "./constants";

function createUnknownEvent(event: any): GitHubUnknownEventData {
    return {
        type: "unknown",
        rawData: event
    };
}

function getOrganizationInfo(org: components["schemas"]["organization-simple-webhooks"]): GitHubOrganization {
    return {
        name: org?.login,
        description: org?.description,
        url: org?.login ? `https://github.com/${org.login}` : undefined,
        avatarUrl: org?.avatar_url
    };
}

function getPullRequestInfo(pr: components["schemas"]["pull-request"]): GitHubPullRequest {
    return {
        number: pr?.number,
        title: pr?.title,
        body: pr?.body,
        url: pr?.html_url,
        assignee: pr?.assignee ? getUserInfo(pr.assignee) : undefined,
        createdAt: pr?.created_at ? new Date(pr.created_at) : undefined,
        merged: pr?.merged,
        mergedAt: pr?.merged_at ? new Date(pr.merged_at) : undefined,
        mergedBy: pr?.merged_by ? getUserInfo(pr.merged_by) : undefined,
        base: pr?.base ? {
            label: pr?.base?.label,
            ref: pr?.base?.ref,
            repo: pr?.base?.repo ? getRepoInfo(pr.base.repo) : undefined,
            sha: pr?.base?.sha,
            user: pr?.base?.user ? getUserInfo(pr.base.user) : undefined,
        } : undefined,
        head: pr?.head ? {
            label: pr?.head?.label,
            ref: pr?.head?.ref,
            repo: pr?.head?.repo ? getRepoInfo(pr.head.repo) : undefined,
            sha: pr?.head?.sha,
            user: pr?.head?.user ? getUserInfo(pr.head.user) : undefined,
        } : undefined
    };
}

function getAuthorInfo(pusher: components["schemas"]["webhook-push"]["pusher"]): GitHubAuthor {
    return {
        username: pusher?.username,
        name: pusher?.name,
        email: pusher?.email,
        date: pusher?.date ? new Date(pusher.date) : undefined
    };
}

function getCommitInfo(
    commit: Partial<components["schemas"]["webhook-push"]["head_commit"]>
): GitHubCommit {
    return {
        message: commit?.message,
        id: commit?.id,
        treeId: commit?.tree_id,
        timestamp: commit?.timestamp ? new Date(commit.timestamp) : undefined,
        author: commit?.author ? getAuthorInfo(commit.author) : undefined,
        committer: commit?.committer ? getAuthorInfo(commit.committer) : undefined,
        added: commit?.added,
        modified: commit?.modified,
        removed: commit?.removed,
    }
}

function getIssueInfo(issue: components["schemas"][
        "webhook-issues-opened" | "webhook-issues-closed"
    ]["issue"]
): GitHubIssue {
    return {
        id: issue?.id,
        state: issue?.state,
        type: issue?.type ? {
            id: issue.type.id,
            name: issue.type.name,
            description: issue.type.description,
            color: issue.type.color,
            enabled: issue.type.is_enabled
        } : undefined,
        title: issue?.title,
        body: issue?.body,
        labels: issue?.labels?.map(l => ({
            id: l.id,
            name: l.name,
            description: l.description,
            color: l.color,
            default: l.default
        })),
        url: issue?.html_url,
        createdAt: issue?.created_at ? new Date(issue.created_at) : undefined,
        closedAt: issue?.closed_at ? new Date(issue.closed_at) : undefined
    };
}

function getReleaseInfo(release: components["schemas"]["webhooks_release"]): GitHubRelease {
    return {
        version: release?.tag_name,
        url: release?.html_url
    };
}

function getRepoInfo(
    repo: components["schemas"]["repository"]
        | components["schemas"]["webhook-push"]["repository"]
): GitHubRepo {
    return {
        name: repo?.name,
        fullName: repo?.full_name,
        url: repo?.html_url,
        forks: repo?.forks ?? repo?.forks_count,
        stars: repo?.stargazers_count,
        isFork: repo?.fork
    };
}

function getUserInfo(user: components["schemas"]["simple-user"]): GitHubUser {
    return {
        username: user?.login,
        userId: user?.id,
        profileUrl: user?.html_url,
        avatarUrl: user?.avatar_url
    };
}

function getWebhookInfo(hook: components["schemas"]["webhook-ping"]["hook"]): GitHubWebhook {
    return {
        id: hook?.id,
        name: hook?.name,
        active: hook?.active,
        events: hook?.events
    };
}

function getWorkflowInfo(
    workflow: components["schemas"][
        "webhook-workflow-run-requested" | "webhook-workflow-run-completed"
    ]["workflow"]
): GitHubWorkflow {
    return {
        id: workflow?.id,
        name: workflow?.name,
        state: workflow?.state,
        url: workflow?.html_url,
        badgeUrl: workflow?.badge_url
    }
}

function getWorkflowRunInfo(
    run: components["schemas"][
        "webhook-workflow-run-requested" | "webhook-workflow-run-completed"
    ]["workflow_run"]
): GitHubWorkflowRun {
    return {
        id: run?.id,
        name: run?.name,
        headCommit: run?.head_commit ? getCommitInfo(run?.head_commit) : undefined,
        status: run?.status,
        runNumber: run?.run_number,
        runAttempt: run?.run_attempt,
        conclusion: run?.conclusion,
        url: run?.html_url
    }
}

export const githubEventHandler = createEventHandler({
    async transform(event): Promise<{ eventData: GitHubEventData }> {
        let eventData: Partial<GitHubEventData> = createUnknownEvent(event);
        
        switch (event.name) {
            case "fork":
                eventData = {
                    type: GITHUB_FORKED_EVENT_ID,
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository),
                    forkedRepo: getRepoInfo(event.payload.forkee)
                };
                break;

            case "issues":
                eventData = {
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository),
                }
                switch (event.payload.action) {
                    case "opened":
                        eventData = {
                            ...eventData,
                            type: GITHUB_ISSUE_OPENED_EVENT_ID,
                            issue: getIssueInfo(event.payload.issue)
                        }
                        break;
                    case "closed":
                        eventData = {
                            ...eventData,
                            type: GITHUB_ISSUE_CLOSED_EVENT_ID,
                            issue: getIssueInfo(event.payload.issue)
                        }
                        break;
                }
                break;

            case "ping":
                eventData = {
                    type: GITHUB_PING_EVENT_ID,
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository),
                    webhook: getWebhookInfo(event.payload.hook),
                    zen: event.payload.zen
                }
                break;

            case "pull_request":
                eventData = {
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository)
                }
                switch (event.payload.action) {
                    case "opened":
                        eventData = {
                            ...eventData,
                            type: GITHUB_PULL_REQUEST_OPENED_EVENT_ID,
                            pullRequest: getPullRequestInfo(event.payload.pull_request)
                        };
                        break;
                    case "closed":
                        eventData = {
                            ...eventData,
                            type: GITHUB_PULL_REQUEST_CLOSED_EVENT_ID,
                            pullRequest: getPullRequestInfo(event.payload.pull_request)
                        };
                        break;
                }
                break;

            case "push":
                eventData = {
                    type: GITHUB_PUSH_EVENT_ID,
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository),
                    pusher: getAuthorInfo(event.payload.pusher),
                    previousCommit: event.payload.before,
                    newCommit: event.payload.after,
                    compareUrl: event.payload.compare,
                    ref: event.payload.ref,
                    createdRef: event.payload.created,
                    deletedRef: event.payload.deleted,
                    forced: event.payload.forced,
                    headCommit: getCommitInfo(event.payload.head_commit),
                    commits: event.payload.commits.map(getCommitInfo)
                }
                break;

            case "release":
                eventData = {
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository),
                    release: getReleaseInfo(event.payload.release)
                }
                switch (event.payload.action){
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
            
            case "star":
                eventData = {
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository),
                    starredAt: event.payload.starred_at ? new Date(event.payload.starred_at) : undefined
                };
                switch (event.payload.action) {
                    case "created":
                        eventData.type = GITHUB_STARRED_EVENT_ID;
                        break;
                }

            case "workflow_run":
                eventData = {
                    user: getUserInfo(event.payload.sender),
                    org: getOrganizationInfo(event.payload.organization),
                    repo: getRepoInfo(event.payload.repository),
                };
                switch (event.payload.action) {
                    case "requested":
                        eventData = {
                            ...eventData,
                            type: GITHUB_WORKFLOW_RUN_REQUESTED_EVENT_ID,
                            workflow: getWorkflowInfo(event.payload.workflow),
                            workflowRun: getWorkflowRunInfo(event.payload.workflow_run)
                        }
                        break;
                    case "completed":
                        eventData = {
                            ...eventData,
                            type: GITHUB_WORKFLOW_RUN_COMPLETED_EVENT_ID,
                            workflow: getWorkflowInfo(event.payload.workflow),
                            workflowRun: getWorkflowRunInfo(event.payload.workflow_run)
                        }
                        break;
                }
        }

        return { eventData: eventData as GitHubEventData };
    }
});

export const githubEvents: EmitterWebhookEventName[] = [
    "fork",
    "issues.opened",
    "issues.closed",
    "ping",
    "pull_request.closed",
    "pull_request.opened",
    "release.created",
    "release.deleted",
    "release.prereleased",
    "release.published",
    "release.released",
    "star.created",
    "workflow_run.completed",
    "workflow_run.requested"
]