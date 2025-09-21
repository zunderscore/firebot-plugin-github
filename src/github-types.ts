import { webhooks } from "@octokit/openapi-webhooks-types";

export type GitHubEventType = 
    | "release-released";

type GitHubEventDataBase = {
    type: GitHubEventType
}

export type GitHubRepoEventData = {
    repoName: string;
    repoFullName: string;
    repoUrl: string;
}

export type GitHubReleaseReleasedEventData = GitHubEventDataBase &
    GitHubRepoEventData & {
    type: "release-released",
    releaseVersion: string;
}

export type GitHubEventData = 
    | GitHubReleaseReleasedEventData

// Borrowed partially from 

export type GitHubWebhookEventDefinition<TEventName extends keyof webhooks> =
  webhooks[TEventName]["post"]["requestBody"]["content"]["application/json"];