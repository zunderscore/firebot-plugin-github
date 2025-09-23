import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
import { EventManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import { ReplaceVariableManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { WebhookConfig, WebhookManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/webhook-manager";
import { EmitterWebhookEvent } from "@octokit/webhooks";

import { GitHubEventData } from "./github-types";
import { githubEventHandler, githubEvents } from "./webhook-processor";

import { GitHubEventSource } from "./events";
import { GitHubVariables } from "./variables";


import {
    PLUGIN_ID,
    PLUGIN_NAME,
    GITHUB_EVENT_SOURCE_ID
} from "./constants";

const packageInfo = require("../package.json");

let logger: Logger;
let eventManager: EventManager;
let replaceVariableManager: ReplaceVariableManager;
let webhookManager: WebhookManager;

let writeDebugOnUnknown = false;

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

    const eventName = headers["x-github-event"].replace("_", "-");
    let fullEventName = eventName;
    if (payload.action) {
        fullEventName = `${eventName}-${payload.action}`;
    }

    logDebug(`Webhook type: ${fullEventName}`);

    githubEventHandler.receive({
        id: headers["x-github-delivery"],
        name: headers["x-github-event"] as any,
        payload
    });
}

const triggerWebhookEvent = ({ eventData }: { eventData: GitHubEventData }) => {
    logDebug(`Triggering event ${GITHUB_EVENT_SOURCE_ID}:${eventData.type}`);
    eventManager.triggerEvent(GITHUB_EVENT_SOURCE_ID, eventData.type, eventData);
}

function setupWebhookListeners() {
    for (const event of githubEvents) {
        logDebug(`Registering webhook event ${event}`);
        githubEventHandler.on(event, triggerWebhookEvent);
    }

    githubEventHandler.onAny((event: EmitterWebhookEvent & { eventData: GitHubEventData }) => {
        if (event.eventData.type == "unknown") {
            logWarn(`Unknown event type received. Skipping.`);
            if (writeDebugOnUnknown) {
                logDebug("Unknown event data", event.eventData.rawData);
            }
        }
    })
}

function removeWebhookListeners() {
    for (const event of githubEvents) {
        logDebug(`Unregistering webhook event ${event}`);
        githubEventHandler.removeListener(event, triggerWebhookEvent);
    }
}

const script: Firebot.CustomScript<{
    copyWebhookUrl: void;
    writeDebugOnUnknown: boolean;
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
        },
        writeDebugOnUnknown: {
            type: "boolean",
            title: "Log Raw Data for Unknown Events",
            description: "When an unknown event is received, log the raw data received from the GitHub event. Firebot debug logs must be enabled for this to take effect.",
            default: false
        }
    }),
    parametersUpdated: (params) => {
        ({ writeDebugOnUnknown } = params);
    },
    run: ({ modules, parameters }) => {
        ({ logger, eventManager, replaceVariableManager, webhookManager } = modules);
        ({ writeDebugOnUnknown } = parameters);

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

        logDebug("Registering frontend listener...");
        const frontendCommunicator = modules.frontendCommunicator;
        frontendCommunicator.on(`${PLUGIN_ID}:copy-webhook-url`, () => {
            frontendCommunicator.send("copy-to-clipboard", { 
                text: webhookManager.getWebhookUrl(PLUGIN_NAME),
            });
        });


        logDebug("Registering webhook listener...");
        setupWebhookListeners();
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
        logDebug(`Stopping ${PLUGIN_NAME} plugin...`);

        logDebug("Stopping webhook listener...");
        webhookManager.removeListener("webhook-received", processWebhook);
        removeWebhookListeners();

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