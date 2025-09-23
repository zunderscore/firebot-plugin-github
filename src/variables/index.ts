import { ForkVariables } from "./forks";
import { OrganizationVariables } from "./orgs";
import { PullRequestVariables } from "./pull-requests";
import { ReleaseVariables } from "./releases";
import { RepoVariables } from "./repos";
import { StarVariables } from "./stars";
import { UserVariables } from "./users";
import { WebhookVariables } from "./webhooks";

export const GitHubVariables = [
    ...ForkVariables,
    ...OrganizationVariables,
    ...PullRequestVariables,
    ...ReleaseVariables,
    ...RepoVariables,
    ...StarVariables,
    ...UserVariables,
    ...WebhookVariables
];