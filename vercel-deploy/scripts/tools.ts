/**
 * Vercel API tools for the Claude agent, defined using betaZodTool.
 * Each tool maps directly to a Vercel REST API operation.
 */

import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import {
  createDeployment,
  getDeployment,
  listDeployments,
  VercelApiError,
} from "../lib/vercel.js";

function requireToken(): string {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN environment variable is not set.");
  return token;
}

/** Create a new Vercel deployment. */
export const createDeploymentTool = betaZodTool({
  name: "create_vercel_deployment",
  description:
    "Create a new Vercel deployment. Provide a project name, one or more files to deploy, " +
    "and optionally a target environment (preview or production).",
  inputSchema: z.object({
    name: z.string().describe("Vercel project name, e.g. 'my-site'"),
    files: z
      .array(
        z.object({
          file: z.string().describe("Relative path of the file, e.g. 'index.html'"),
          data: z.string().describe("UTF-8 text content of the file"),
        })
      )
      .min(1)
      .describe("Files to include in the deployment"),
    target: z
      .enum(["production", "preview"])
      .optional()
      .default("preview")
      .describe("Target environment — 'preview' (default) or 'production'"),
  }),
  run: async ({ name, files, target }) => {
    try {
      const deployment = await createDeployment({ name, files, target }, requireToken());
      return JSON.stringify({
        id: deployment.id,
        name: deployment.name,
        url: `https://${deployment.url}`,
        state: deployment.state,
        target: deployment.target,
        createdAt: new Date(deployment.createdAt).toISOString(),
      });
    } catch (err) {
      if (err instanceof VercelApiError) {
        return `Error ${err.status}: ${err.message}${err.code ? ` (${err.code})` : ""}`;
      }
      throw err;
    }
  },
});

/** Get a single deployment by its ID or URL. */
export const getDeploymentTool = betaZodTool({
  name: "get_vercel_deployment",
  description:
    "Retrieve details of a single Vercel deployment by its deployment ID or URL.",
  inputSchema: z.object({
    idOrUrl: z
      .string()
      .describe("Deployment ID (e.g. 'dpl_abc123') or URL (e.g. 'my-site-abc.vercel.app')"),
  }),
  run: async ({ idOrUrl }) => {
    try {
      const deployment = await getDeployment(idOrUrl, requireToken());
      return JSON.stringify({
        id: deployment.id,
        name: deployment.name,
        url: `https://${deployment.url}`,
        state: deployment.state,
        target: deployment.target,
        createdAt: new Date(deployment.createdAt).toISOString(),
        readyAt: deployment.readyAt
          ? new Date(deployment.readyAt).toISOString()
          : undefined,
      });
    } catch (err) {
      if (err instanceof VercelApiError) {
        return `Error ${err.status}: ${err.message}`;
      }
      throw err;
    }
  },
});

/** List recent deployments. */
export const listDeploymentsTool = betaZodTool({
  name: "list_vercel_deployments",
  description:
    "List recent Vercel deployments for the authenticated account, optionally filtered by project.",
  inputSchema: z.object({
    projectId: z
      .string()
      .optional()
      .describe("Optional Vercel project ID to filter results"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .default(10)
      .describe("Maximum number of deployments to return (1-100, default 10)"),
  }),
  run: async ({ projectId, limit }) => {
    try {
      const deployments = await listDeployments(requireToken(), projectId, limit);
      if (deployments.length === 0) return "No deployments found.";
      return JSON.stringify(
        deployments.map((d) => ({
          id: d.id,
          name: d.name,
          url: `https://${d.url}`,
          state: d.state,
          target: d.target,
          createdAt: new Date(d.createdAt).toISOString(),
        }))
      );
    } catch (err) {
      if (err instanceof VercelApiError) {
        return `Error ${err.status}: ${err.message}`;
      }
      throw err;
    }
  },
});

export const allTools: Parameters<typeof Anthropic.prototype.beta.messages.toolRunner>[0]["tools"] =
  [createDeploymentTool, getDeploymentTool, listDeploymentsTool];
