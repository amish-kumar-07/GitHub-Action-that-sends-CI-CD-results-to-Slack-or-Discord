import core from "@actions/core";
import github from "@actions/github";
import axios from "axios";

async function run() {
  try {
    const webhookUrl = core.getInput("webhook_url");
    const platform = core.getInput("platform").toLowerCase();
    const status = core.getInput("status").toLowerCase();

    const repo = github.context.repo.repo;
    const owner = github.context.repo.owner;
    const commit = github.context.sha.substring(0, 7);
    const actor = github.context.actor;
    const branch = github.context.ref.replace("refs/heads/", "");

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
      await axios.post(webhookUrl, slackPayload);
    } else if (platform === "discord") {
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
      await axios.post(webhookUrl, discordPayload);
    } else {
      core.setFailed("Unsupported platform. Use 'slack' or 'discord'");
    }

    core.info("Notification sent successfully!");
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed: ${error.message}`);
    } else {
      core.setFailed(`Action failed: ${String(error)}`);
    }
  }
}

run();
console.log("Hello World");
