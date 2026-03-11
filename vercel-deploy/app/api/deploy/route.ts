import { NextRequest, NextResponse } from "next/server";
import { createDeployment, VercelApiError } from "@/lib/vercel";

export async function POST(req: NextRequest) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "VERCEL_TOKEN environment variable is not set" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, files, projectSettings, target, gitSource } =
    body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "name is required and must be a string" },
      { status: 400 }
    );
  }

  if (!Array.isArray(files) || files.length === 0) {
    return NextResponse.json(
      { error: "files must be a non-empty array" },
      { status: 400 }
    );
  }

  try {
    const deployment = await createDeployment(
      {
        name,
        files: files as { file: string; data: string }[],
        projectSettings: projectSettings as
          | Record<string, string | null>
          | undefined,
        target: target as "production" | "preview" | "development" | undefined,
        gitSource: gitSource as
          | {
              type: "github" | "gitlab" | "bitbucket";
              repoId: string;
              ref: string;
            }
          | undefined,
      },
      token
    );

    return NextResponse.json(deployment, { status: 201 });
  } catch (err) {
    if (err instanceof VercelApiError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status }
      );
    }
    throw err;
  }
}
