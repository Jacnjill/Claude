"use client";

import { useState, FormEvent } from "react";
import type { Deployment } from "@/lib/vercel";

interface ApiError {
  error: string;
  code?: string;
}

const DEFAULT_FILES = JSON.stringify(
  [{ file: "index.html", data: "<h1>Hello from Vercel Deploy</h1>" }],
  null,
  2
);

export default function HomePage() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState<"production" | "preview">("preview");
  const [filesJson, setFilesJson] = useState(DEFAULT_FILES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Deployment | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    let files: unknown;
    try {
      files = JSON.parse(filesJson);
    } catch {
      setError("Files must be valid JSON.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, files, target }),
      });

      const data: Deployment | ApiError = await res.json();

      if (!res.ok) {
        setError((data as ApiError).error ?? "Unknown error");
      } else {
        setResult(data as Deployment);
      }
    } catch {
      setError("Network error — could not reach the API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Vercel Deploy</h1>
      <p className="subtitle">Create a new deployment via the Vercel REST API.</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Project name</label>
          <input
            id="name"
            type="text"
            placeholder="my-project"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="target">Target environment</label>
          <select
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value as "production" | "preview")}
          >
            <option value="preview">Preview</option>
            <option value="production">Production</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="files">Files (JSON)</label>
          <textarea
            id="files"
            value={filesJson}
            onChange={(e) => setFilesJson(e.target.value)}
            spellCheck={false}
            required
          />
          <span className="hint">
            Array of <code>{"{ file: string; data: string }"}</code> objects.
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Deploying…" : "Deploy"}
        </button>
      </form>

      {error && (
        <div className="result error">
          <h2>Deployment failed</h2>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result success">
          <h2>Deployment created</h2>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>{result.id}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{result.name}</td>
              </tr>
              <tr>
                <td>URL</td>
                <td>
                  <a
                    href={`https://${result.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.url}
                  </a>
                </td>
              </tr>
              <tr>
                <td>State</td>
                <td>
                  <span className={`status-badge status-${result.state}`}>
                    {result.state}
                  </span>
                </td>
              </tr>
              {result.target && (
                <tr>
                  <td>Target</td>
                  <td>{result.target}</td>
                </tr>
              )}
              <tr>
                <td>Created</td>
                <td>{new Date(result.createdAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
