"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhookUrl = core_1.default.getInput("webhook_url");
            const platform = core_1.default.getInput("platform").toLowerCase();
            const status = core_1.default.getInput("status").toLowerCase();
            const repo = github_1.default.context.repo.repo;
            const owner = github_1.default.context.repo.owner;
            const commit = github_1.default.context.sha.substring(0, 7);
            const actor = github_1.default.context.actor;
            const branch = github_1.default.context.ref.replace("refs/heads/", "");
            const emoji = status === "success" ? "✅" : status === "failure" ? "❌" : "⚠️";
            const color = status === "success" ? "good" : status === "failure" ? "danger" : "warning";
            const colorCode = status === "success" ? 0x2ecc71 : status === "failure" ? 0xe74c3c : 0xf1c40f;
            console.log("Webhook URL:", webhookUrl);
            console.log("Platform:", platform);
            console.log("Status:", status);
            console.log("Repo:", `${owner}/${repo}`);
            console.log("Branch:", branch);
            console.log("Commit:", commit);
            console.log("Actor:", actor);
            if (platform === "slack") {
                const slackPayload = {
                    text: `${emoji} CI/CD Job *${status.toUpperCase()}*`,
                    attachments: [
                        {
                            color,
                            title: `${owner}/${repo}`,
                            text: `*Branch:* ${branch}\n*Commit:* ${commit}\n*Actor:* ${actor}`,
                            mrkdwn_in: ["text"],
                        },
                    ],
                };
                yield axios_1.default.post(webhookUrl, slackPayload);
            }
            else if (platform === "discord") {
                const discordPayload = {
                    username: "CI/CD Bot",
                    embeds: [
                        {
                            title: `${emoji} CI/CD Job ${status.toUpperCase()}`,
                            description: `**Repo:** ${owner}/${repo}\n**Branch:** ${branch}\n**Commit:** ${commit}\n**Author:** @${actor}`,
                            color: colorCode,
                        },
                    ],
                };
                yield axios_1.default.post(webhookUrl, discordPayload);
            }
            else {
                core_1.default.setFailed("Unsupported platform. Use 'slack' or 'discord'");
            }
            core_1.default.info("Notification sent successfully!");
        }
        catch (error) {
            if (error instanceof Error) {
                core_1.default.setFailed(`Action failed: ${error.message}`);
            }
            else {
                core_1.default.setFailed(`Action failed: ${String(error)}`);
            }
        }
    });
}
run();
console.log("Hello World");
