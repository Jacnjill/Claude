# CLAUDE.md

This file provides context and guidance for AI assistants (Claude Code and similar tools) working in this repository.

## Repository Overview

**Name:** Claude
**Owner:** Jacnjill
**License:** MIT
**Purpose:** A collection of projects built with or around Claude AI.

This repository serves as a monorepo-style workspace for Claude-related projects. Each top-level directory (beyond repo root files) represents an independent sub-project.

## Repository Structure

```
Claude/
├── CLAUDE.md          # This file — AI assistant guidance
├── README.md          # Public-facing overview
├── LICENSE            # MIT License
└── <project-name>/    # Individual project directories (added over time)
```

As projects are added, each will live in its own subdirectory with its own tooling, dependencies, and README.

## Development Workflow

### Branching Convention

- **Main branch:** `main` (or `master` — currently both exist; prefer `main` for new work)
- **Feature branches:** Use descriptive names, e.g. `feature/add-chat-ui` or `claude/some-task-id`
- Claude Code sessions use branches prefixed with `claude/` and suffixed with a session ID (e.g. `claude/add-claude-documentation-iQ0tN`)

### Git Commit Style

- Write concise, imperative commit messages: `Add authentication module`, not `Added auth`
- Keep the subject line under 72 characters
- For multi-file changes, use a short summary line followed by a blank line and bullet details if needed

### Pull Requests

- Each PR should have a clear title and a summary of what changed and why
- Link to any relevant issues in the PR body
- Prefer small, focused PRs over large sweeping changes

## Adding a New Sub-Project

When adding a new project to this repo:

1. Create a new top-level directory named after the project (kebab-case preferred)
2. Include a `README.md` inside it explaining what the project does
3. Add a `CLAUDE.md` inside the sub-project directory if it has its own conventions
4. Keep dependencies scoped to the sub-project directory (e.g. `package.json`, `pyproject.toml`, `go.mod`)
5. Document the run/build/test commands clearly so AI assistants can operate without guessing

Example structure for a Python sub-project:

```
my-claude-tool/
├── README.md
├── pyproject.toml      # or requirements.txt
├── src/
│   └── main.py
└── tests/
    └── test_main.py
```

## Key Conventions for AI Assistants

### General Rules

- **Read before editing.** Always read the relevant files before making changes.
- **Stay minimal.** Only make changes directly requested or clearly necessary. Do not refactor surrounding code, add unsolicited comments, or introduce extra features.
- **Prefer editing over creating.** Modify existing files rather than creating new ones unless a new file is clearly required.
- **No secrets in code.** Never hardcode API keys, tokens, or credentials. Use environment variables and document them.

### Working with Claude API / Anthropic SDK

Projects in this repo are likely to use the Anthropic Claude API. When working on such code:

- Use the latest stable model: `claude-sonnet-4-6` for general tasks, `claude-opus-4-6` for complex reasoning, `claude-haiku-4-5-20251001` for fast/cheap tasks
- Prefer the official `anthropic` Python SDK or `@anthropic-ai/sdk` Node.js package
- Structure API calls with proper error handling and respect rate limits
- Stream responses when latency matters to users

Example (Python):

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
)
print(message.content[0].text)
```

### Environment Variables

Document required environment variables in each sub-project's README. Common ones:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | API key for Anthropic Claude access |

Never commit `.env` files. Use `.env.example` as a template with placeholder values.

### Testing

- Write tests for non-trivial logic. Place them in a `tests/` directory within the sub-project.
- Run tests before pushing. Document the test command in the sub-project README.
- Do not mark work as complete if tests are failing.

### Security

- Do not introduce command injection, SQL injection, XSS, or other OWASP Top 10 vulnerabilities
- Validate all external input at system boundaries (user input, API responses)
- Do not store sensitive data in logs or error messages

## Current State

As of March 2026, this repository contains only scaffolding (README, LICENSE). Sub-projects will be added over time. When a new project is added, update this file if new repo-wide conventions are introduced.
