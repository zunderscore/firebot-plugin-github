# GitHub Plugin for Firebot

This plugin adds support for GitHub events and related variables to Firebot.

## Prerequisites
- Firebot 5.65 or higher

## Setup

1. Copy the `firebot-github.js` file into your Firebot profile's `scripts` folder (e.g. `%appdata%\Firebot\v5\profiles\Main Profile\scripts`)
2. Go to Settings > Scripts in Firebot
3. Click on "Manage Startup Scripts"
4. Click "Add New Script"
5. Select the `firebot-github.js` file from the dropdown list
6. Click "Add & Configure"
7. Click the "Copy URL" button under "Webhook URL", then close both the script settings and the "Startup Scripts" modals
8. In the GitHub repo(s) you want to receive events from, under Settings > Webhooks, create a new webhook, paste the copied URL into the **Payload URL** field, select which events you want GitHub to send for that repo, and click "Add webhook"

## Events

New events:
- **GitHub: Release Released**

## Variables

New variables:
- `$githubReleaseVersion`
- `$githubRepoFullName`
- `$githubRepoName`
- `$githubRepoUrl`