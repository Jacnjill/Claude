const VERCEL_API_BASE = "https://api.vercel.com";

export interface DeploymentFile {
  file: string;
  data: string;
}

export interface CreateDeploymentParams {
  name: string;
  files: DeploymentFile[];
  projectSettings?: {
    framework?: string | null;
    buildCommand?: string | null;
    outputDirectory?: string | null;
    installCommand?: string | null;
  };
  target?: "production" | "preview" | "development";
  gitSource?: {
    type: "github" | "gitlab" | "bitbucket";
    repoId: string;
    ref: string;
  };
}

export interface Deployment {
  id: string;
  name: string;
  url: string;
  state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
  target: string | null;
  createdAt: number;
  readyAt?: number;
}

export class VercelApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "VercelApiError";
  }
}

async function vercelFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${VERCEL_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new VercelApiError(
      res.status,
      body?.error?.message ?? res.statusText,
      body?.error?.code
    );
  }

  return res.json() as Promise<T>;
}

/**
 * Create a new Vercel deployment.
 * Docs: https://vercel.com/docs/rest-api/endpoints/deployments#create-a-new-deployment
 */
export async function createDeployment(
  params: CreateDeploymentParams,
  token: string
): Promise<Deployment> {
  return vercelFetch<Deployment>("/v13/deployments", token, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/**
 * Get a deployment by its ID or URL.
 * Docs: https://vercel.com/docs/rest-api/endpoints/deployments#get-a-deployment-by-id-or-url
 */
export async function getDeployment(
  idOrUrl: string,
  token: string
): Promise<Deployment> {
  return vercelFetch<Deployment>(
    `/v13/deployments/${encodeURIComponent(idOrUrl)}`,
    token
  );
}

/**
 * List recent deployments for the authenticated user / team.
 */
export async function listDeployments(
  token: string,
  projectId?: string,
  limit = 20
): Promise<Deployment[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (projectId) params.set("projectId", projectId);
  const data = await vercelFetch<{ deployments: Deployment[] }>(
    `/v6/deployments?${params}`,
    token
  );
  return data.deployments;
}
