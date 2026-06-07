import firebot, { Plugin, PluginWebhookEventHandler } from "@crowbartools/firebot-types";
import { EmitterWebhookEvent } from "@octokit/webhooks";

import { GitHubEventData } from "./github-types";
import { githubEventHandler, githubEvents } from "./webhook-processor";

import { GitHubEventSource } from "./events";
import { GitHubVariables } from "./variables";
import { GitHubFilters } from "./filters";

import {
    PLUGIN_ID,
    PLUGIN_NAME,
    EVENT_SOURCE_ID
} from "./constants";

const packageInfo = require("../package.json");

let writeDebugOnUnknown = false;

const processWebhook: PluginWebhookEventHandler = ({ webhook, headers, payload }) => {
    firebot.logger.debug(`Got webhook for ${webhook.name}`);
    if (webhook.name !== PLUGIN_NAME) {
        firebot.logger.debug(`Received unknown webhook event for ${webhook.name}. Ignoring.`);
        return;
    }

    const githubPayload = payload as any;

    const eventName = headers["x-github-event"].replace("_", "-");
    let fullEventName = eventName;
    if (githubPayload.action) {
        fullEventName = `${eventName}-${githubPayload.action}`;
    }

    firebot.logger.debug(`Webhook type: ${fullEventName}`);

    githubEventHandler.receive({
        id: headers["x-github-delivery"],
        name: headers["x-github-event"] as any,
        payload: githubPayload
    });
}

const triggerWebhookEvent = ({ eventData }: { eventData: GitHubEventData }) => {
    firebot.logger.debug(`Triggering event ${EVENT_SOURCE_ID}:${eventData.type}`);
    firebot.events.trigger(EVENT_SOURCE_ID, eventData.type, eventData);
}

function setupWebhookListeners() {
    for (const event of githubEvents) {
        firebot.logger.debug(`Registering webhook event ${event}`);
        githubEventHandler.on(event, triggerWebhookEvent);
    }

    githubEventHandler.onAny((event: EmitterWebhookEvent & { eventData: GitHubEventData }) => {
        if (event.eventData.type == "unknown") {
            firebot.logger.warn(`Unknown event type received. Skipping.`);
            if (writeDebugOnUnknown) {
                firebot.logger.debug("Unknown event data", event.eventData.rawData);
            }
        }
    })
}

function removeWebhookListeners() {
    for (const event of githubEvents) {
        firebot.logger.debug(`Unregistering webhook event ${event}`);
        githubEventHandler.removeListener(event, triggerWebhookEvent);
    }
}

const plugin: Plugin<{
    copyWebhookUrl: void;
    writeDebugOnUnknown: boolean;
}> = {
    manifest: {
        type: "plugin",
        name: PLUGIN_NAME,
        description: packageInfo.description,
        author: packageInfo.author,
        version: packageInfo.version,
        repo: "https://github.com/zunderscore/firebot-plugin-github",
        icon: {
            type: "custom",
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACWCAMAAAD61NpdAAAAP1BMVEVHcEz///////////////////////////////////////////////////////////////////////////////9KjZoYAAAAFHRSTlMA8w/6Bul4ZDMbUsdC35i41ImoJr889TkAAAbTSURBVHjazVxto7IgDBWQdxFR/v9vfaqnW1nKhoC1z/fWaWxjO2zruiKhWhkRZm8nTliMkRE3WT8GOSy0774kPVUyzJO7IXoXxp2dhVno6bAuqEbLtzC9CnE2mOVE3dEheB6Rwtws1SngeiUsGtZduJdLa1xazrmw7pobh5Y2t4iJxaNCvNSNcKngYpEw2wTbUorrJvWxaTHFOmJlTXuj0sZqwvxQLYiomcSawkOdGEKFi7XFmr6GwlisL2QsVVsvXWwjdihzyZHEVsJFgZMqHxsKGw/HNjPFtmLVj5nYU5w5AkyQ2F6czA4fNJwB7BI+RCY0OrIYfxEaHeNpkgXtTGBZ0HrB4rnQfsorV9eBxCGTZwPDxrXBxfNlQtwGi43fEA/eodTH78gIZB59+BKwyAAHNeRbyCJPppLLXt7D53H21pXhJs76y+fs0Q82YWr9vPehob8SZosRnh9ViRdXtu/yObsGM/b5keypaarCAW6DWKEeFj7s/Thiss8yWrrigzIDC/Pm9aDo/tfsnGe/f4+/6VmvS1BGuLvSs1exdnKckxRfsG8zN6PZ8st9ExJ7VShxfhRyUFrTP9F6GYwM850s3agsRaZ/JmLshgFQwck0i0HTfdZbBs+30mm5f/Dz1sdJlvVTejNoMK+iSuUFTbKRdeiEWXPV1ZQhEXn8p9JS2aJbTkPGJD5iXJHVJQpVKlp/RI5kgu3oecjelaaTwfNMnb1bmkzeOCfa2bvSgHyR10UGpFq+x/8tH6oiSx/Q6tt6oPIlpioyAWQA4SVkQOWSqAkM0kOcFqx6kzndAbIcSqKePtCD9dKkTwsat3v9TxEKrH2dOi1orKKUhCuumqcJEzp/x5nIMVNZU4GheeRxgp7p6iZBCPO5H6dhZ8aMm0BMwD2AhjMdE5NA/AVb8NTrqwyOoLeEAzIz16KhYZkQXwqRLGOTdoGAMDRx6m2ODbcCjma2TZMFdHlebmroT0Kj7g/gqCyFHICZRsgGArkAcOCuVasR4J2XxBZg/22rPiMg9SISOu+xayUj5Jzj+RcAygXGDribTDNkQCLhu3TQYEMzZEMame0AF1HNkAHlwNS5H0XmOvKjyEjHfhYZkGl8DVkEkH3PNyFkLeNZLEP2tTsgduRH703SAXboWzWDQzQP775ROWGYAQfcTu1yWogZmKBco1kdADEDvoOIoEZJLcgfzJCLtKo3wSaHsROncrQPz4SOigm4P8mpL1ya1woFZk1DfaXBrTSXqk6DTbMNlAbT205jWpSqWxoFmeErgdbDPY28tnsieu+u2gA59+p80ILoupYw9dHgdQc+y0iuGatG/AIiK/olpvP0xlr3iJ9Q09RQDZ7/nyoE4i+jq1UQGFSDp0C+UF1vi0mdCIz814PGDShMFQ60l7jGur/HEWTX5YFe/nevxLb2j9iM5E/HoSyuoQeUHom0xs6bMF9gbFSix1qeD+n4Jlon9GGF4RtLn4F9wP8Ts+ZA+t1nzVi+pNFbrxWMO7c5PE18LrY+cyb19Zr+CLZuNGpZlBndpt5Exii3NnNm97xIlKXPoTe1Pb/mZomZgu8XM2a3364z1XG3Xup3JsWY88Go/VbH696B4N2BuZEx8ai37lBSu6Uh49O8F0cMPOKfvJkemlkrzZtFY6Bdgi/dTXYOdnjPffIllHH7MjKr9mJkaiAIe0emVbbV4MSebtDvtCezZMF3bDhp7hHPx8/Epw+bqyoCLU6rQZVtd4U9u262aj8GjY7A3TMYlW22xLxEj09Tg4Eh0+X9qPD4GLbd0HGPAjwfGKp+Q7B1G5TW66mv82Tk/HHmKNC0oDmt10JzeEGOHXVXWZFjt3jccILVu5MW9oadWPR6gLzBrv0+t43JtfUlpgcphBwyssccH0iVZ58RtfSxLiMpTRMBoTalkeGdaWfXvjJvQNETSBaw3c+IWkhRYW8omJ74NLUynnasYWQ7XE0ZRYWLtQzz8z/zCl4CTRRGspXRfhwAL2A0UMg8MnLrD6st2NIhKrhlKnYcX6UjymL/R3z8vO74vF55tehayPI4ww1okdwKzOu04aLkOMlKyHLJTD1vL6mb7EUmcmfsKyDL35hCA4PfEsqR+QPv9BQoZWsgY/OhBgJgxUwFZCQcDUaDbYqsJIAviR1LxcjK9j/R/RMtRFa+M2vwrAUyV2F13N7+sxJkZK7zVrRNmBcgm6rt2qPGsnrIai2zu19Wn7sOkJWL/DjIoXLDgH7bf4ktRNcFJ5lNgz6ji95Yfh36yh+QudXyUG0eiz/wN/Fjy0/bpab9ECxnxOW8Jw7+8h/ciuZbavVgMvf0UmWMOn/vcDP5B0/RM1wztth2AAAAAElFTkSuQmCC",
            backgroundColor: "#000000"
        },
        minimumFirebotVersion: { major: 5, minor: 67 },
        initBeforeShowingParams: true
    },
    parametersSchema: [
        {
            name: "copyWebhookUrl",
            type: "button",
            title: "Webhook URL",
            description: "Copy this URL then go to your GitHub repo settings. Under Settings > Webhooks, create a new webhook, paste the copied URL into the **Payload URL** field, select which events you want GitHub to send for that repo, and click \"Add webhook\".",
            backendEventName: `${PLUGIN_ID}:copy-webhook-url`,
            buttonText: "Copy URL"
        },
        {
            name: "writeDebugOnUnknown",
            type: "boolean",
            title: "Log Raw Data for Unknown Events",
            description: "When an unknown event is received, log the raw data received from the GitHub event. Firebot debug logs must be enabled for this to take effect.",
            default: false
        }
    ],
    registers: {
        eventSources: [GitHubEventSource],
        variables: GitHubVariables,
        filters: GitHubFilters,
        webhooks: {
            handler: processWebhook,
            webhookNames: [
                PLUGIN_NAME
            ]
        }
    },
    onLoad: () => {
        firebot.frontendCommunicator.on(`${PLUGIN_ID}:copy-webhook-url`, () => {
            firebot.frontendCommunicator.send("copy-to-clipboard", {
                text: firebot.webhooks.getUrl(PLUGIN_NAME),
            });
        });

        setupWebhookListeners();
    },
    onUnload: () => {
        removeWebhookListeners();
    }
}

export default plugin;