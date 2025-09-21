import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
import { EventManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import { ReplaceVariableManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { WebhookConfig, WebhookManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/webhook-manager";
import { webhooks } from "@octokit/openapi-webhooks-types";

import { GitHubEventSource } from "./events";
import { GitHubVariables } from "./variables";

import { GitHubEventData, GitHubEventType, GitHubWebhookEventDefinition } from "./github-types";

import {
    PLUGIN_ID,
    PLUGIN_NAME,
    GITHUB_EVENT_SOURCE_ID,
    GITHUB_RELEASE_PUBLISHED_EVENT_ID
} from "./constants";

const packageInfo = require("../package.json");

let logger: Logger;
let eventManager: EventManager;
let replaceVariableManager: ReplaceVariableManager;
let webhookManager: WebhookManager;

const logDebug = (msg: string, ...meta: any[]) => logger.debug(`[${PLUGIN_NAME}] ${msg}`, ...meta);
const logInfo = (msg: string, ...meta: any[]) => logger.info(`[${PLUGIN_NAME}] ${msg}`, ...meta);
const logWarn = (msg: string, ...meta: any[]) => logger.warn(`[${PLUGIN_NAME}] ${msg}`, ...meta);
const logError = (msg: string, ...meta: any[]) => logger.error(`[${PLUGIN_NAME}] ${msg}`, ...meta);

const processWebhook = ({ config, headers, payload }: { config: WebhookConfig, headers: Record<string, string>, payload: any }) => {
    logDebug(`Got webhook for ${config.name}`);
    if (config.name !== PLUGIN_NAME) {
        logDebug(`Received unknown webhook event for ${config.name}. Ignoring.`);
        return;
    }

    const eventName = headers["x-github-event"];
    const fullEventName = `${eventName}-${payload.action}` as GitHubEventType;

    logDebug(`Webhook type: ${fullEventName}`);

    let eventId: string, eventData: GitHubEventData;
    const baseEventData = {
        type: fullEventName
    };

    switch (fullEventName as keyof webhooks)
    {
        case GITHUB_RELEASE_PUBLISHED_EVENT_ID:
            {
                eventId = GITHUB_RELEASE_PUBLISHED_EVENT_ID;
                const typedPayload = payload as GitHubWebhookEventDefinition<"release-published">;
                eventData = {
                    type: fullEventName,
                    ...baseEventData,
                    repoName: typedPayload.repository.name,
                    repoFullName: typedPayload.repository.full_name,
                    repoUrl: typedPayload.repository.html_url,
                    releaseVersion: typedPayload.release.tag_name
                };
            }
            break;

        default:
            logWarn(`Unknown event type ${fullEventName}. Skipping.`);
            break;
    }

    eventManager.triggerEvent(GITHUB_EVENT_SOURCE_ID, eventId, eventData);
}

const script: Firebot.CustomScript<{
    copyWebhookUrl: void;
}> = {
    getScriptManifest: () => ({
        name: PLUGIN_NAME,
        description: packageInfo.description,
        author: packageInfo.author,
        version: packageInfo.version,
        firebotVersion: "5",
        startupOnly: true,
        initBeforeShowingParams: true
    }),
    getDefaultParameters: () => ({
        copyWebhookUrl: {
            type: "button",
            title: "Webhook URL",
            description: "Copy this URL then go to your GitHub repo settings. Under Settings > Webhooks, create a new webhook, paste the copied URL into the **Payload URL** field, select which events you want GitHub to send for that repo, and click \"Add webhook\".",
            backendEventName: `${PLUGIN_ID}:copy-webhook-url`,
            buttonText: "Copy URL",
            icon: "fa-copy",
            sync: true
        }
    }),
    run: ({ modules }) => {
        ({ logger, eventManager, replaceVariableManager, webhookManager } = modules);

        logInfo(`Starting ${PLUGIN_NAME} plugin...`);

        if (webhookManager == null) {
            logError(`Cannot start ${PLUGIN_NAME} plugin. You must be on Firebot 5.65 or higher.`);
            return;
        }

        logDebug("Registering events...");
        eventManager.registerEventSource(GitHubEventSource);

        logDebug("Registering variables...");
        for (const variable of GitHubVariables) {
            replaceVariableManager.registerReplaceVariable(variable);
        }

        logDebug("Registering frontend listener");
        const frontendCommunicator = modules.frontendCommunicator;
        frontendCommunicator.on(`${PLUGIN_ID}:copy-webhook-url`, () => {
            frontendCommunicator.send("copy-to-clipboard", { 
                text: webhookManager.getWebhookUrl(PLUGIN_NAME),
            });
        });


        logDebug("Registering webhook listener...");
        webhookManager.on("webhook-received", processWebhook);

        logDebug("Checking for webhook...");
        let webhook = webhookManager.getWebhook(PLUGIN_NAME);

        if (webhook == null) {
            logDebug("Webhook not found. Registering...");

            webhook = webhookManager.saveWebhook(PLUGIN_NAME);
        }

        if (webhook == null) {
            logError("Something went wrong while registering webhook. Exiting.");
            return;
        }

        logDebug("Webhook registered");
        logInfo("Plugin ready. Listening for events.");
    },
    stop: (uninstalling: boolean) => {
        logDebug(`Stopping ${PLUGIN_NAME} plugin`);

        logDebug("Stopping webhook listener");
        webhookManager.removeListener("webhook-received", processWebhook);

        if (uninstalling === true) {
            logDebug("Removing webhook...");

            webhookManager.deleteWebhook(PLUGIN_NAME);

            logInfo("Plugin uninstalled");
        } else {
            logInfo("Plugin stopped");
        }
    }
}

export default script;