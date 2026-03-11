/**
 * Vercel Deploy Agent
 *
 * Uses Claude (claude-opus-4-6) with Vercel API tools to create and inspect
 * deployments through natural language.
 *
 * Usage:
 *   VERCEL_TOKEN=xxx ANTHROPIC_API_KEY=xxx npx tsx scripts/agent.ts \
 *     "Deploy a hello-world page for project my-site"
 *
 * Or interactively (no argument — prompts you):
 *   VERCEL_TOKEN=xxx ANTHROPIC_API_KEY=xxx npx tsx scripts/agent.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";
import { allTools } from "./tools.js";

const SYSTEM_PROMPT = `You are a Vercel deployment assistant. You help users create and inspect
Vercel deployments using the Vercel REST API.

Available tools:
- create_vercel_deployment: Create a new deployment with files
- get_vercel_deployment: Fetch details of a specific deployment
- list_vercel_deployments: List recent deployments

When asked to deploy a site and no files are provided, create a sensible default
index.html that reflects the project name. Always confirm the deployment URL and
state to the user after creation.`;

async function runAgent(userPrompt: string): Promise<void> {
  const client = new Anthropic();

  console.log(`\nUser: ${userPrompt}\n`);

  const runner = client.beta.messages.toolRunner({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    tools: allTools,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Stream each assistant message as it arrives
  for await (const message of runner) {
    for (const block of message.content) {
      if (block.type === "text" && block.text) {
        process.stdout.write(`\nAssistant: ${block.text}\n`);
      } else if (block.type === "tool_use") {
        console.log(`\n[Tool call: ${block.name}]`);
        console.log(JSON.stringify(block.input, null, 2));
      } else if (block.type === "tool_result") {
        console.log(`[Tool result]`);
        const content =
          typeof block.content === "string"
            ? block.content
            : JSON.stringify(block.content);
        console.log(content.slice(0, 500) + (content.length > 500 ? "…" : ""));
      }
    }
  }
}

async function promptUser(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question("What would you like to do with Vercel? ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is not set.");
    process.exit(1);
  }
  if (!process.env.VERCEL_TOKEN) {
    console.error("Error: VERCEL_TOKEN environment variable is not set.");
    process.exit(1);
  }

  const userPrompt = process.argv[2] ?? (await promptUser());
  if (!userPrompt.trim()) {
    console.error("No prompt provided.");
    process.exit(1);
  }

  await runAgent(userPrompt);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
