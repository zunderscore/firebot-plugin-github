import { RepoVariables } from "./repos";
import { ReleaseVariables } from "./releases";
import { UserVariables } from "./users";
import { OrganizationVariables } from "./orgs";

export const GitHubVariables = [
    ...OrganizationVariables,
    ...ReleaseVariables,
    ...RepoVariables,
    ...UserVariables
];