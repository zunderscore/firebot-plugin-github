import { ForkVariables } from "./forks";
import { IssueVariables } from "./issues";
import { OrganizationVariables } from "./orgs";
import { PullRequestVariables } from "./pull-requests";
import { PushVariables } from "./pushes";
import { ReleaseVariables } from "./releases";
import { RepoVariables } from "./repos";
import { StarVariables } from "./stars";
import { UserVariables } from "./users";
import { WebhookVariables } from "./webhooks";
import { WorkflowRunVariables } from "./workflow-runs";
import { WorkflowVariables } from "./workflows";

export const GitHubVariables = [
    ...ForkVariables,
    ...IssueVariables,
    ...OrganizationVariables,
    ...PullRequestVariables,
    ...PushVariables,
    ...ReleaseVariables,
    ...RepoVariables,
    ...StarVariables,
    ...UserVariables,
    ...WebhookVariables,
    ...WorkflowRunVariables,
    ...WorkflowVariables
];