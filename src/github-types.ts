import { webhooks } from "@octokit/openapi-webhooks-types";

export type GitHubEventType = 
    | "release-published";

type GitHubEventDataBase = {
    type: GitHubEventType
}

export type GitHubRepoEventData = {
    repoName: string;
    repoFullName: string;
    repoUrl: string;
}

export type GitHubReleasePublishedEventData = GitHubEventDataBase &
    GitHubRepoEventData & {
    type: "release-published",
    releaseVersion: string;
}

export type GitHubEventData = 
    | GitHubReleasePublishedEventData

// Borrowed partially from 

export type GitHubWebhookEventDefinition<TEventName extends keyof webhooks> =
  webhooks[TEventName]["post"]["requestBody"]["content"]["application/json"];