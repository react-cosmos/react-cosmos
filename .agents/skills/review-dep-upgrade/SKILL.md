---
name: review-dep-upgrade
description: Review npm dependency upgrade diffs. Use when comparing upgraded direct dependency versions between refs or package.json changes, fetching npm release dates, sorting by release gap, and summarizing upstream changes plus repo-specific impact.
---

# Review Dependency Upgrades

## Workflow

1. Identify the comparison range.
   - If the user gives refs, use them.
   - If not, inspect `git status --short` and `git diff -- package.json '**/package.json'`.
   - For clean worktrees, ask for the base/head refs unless the conversation already provides enough version pairs.

2. Collect direct dependency upgrades only.
   - Include `dependencies`, `devDependencies`, `peerDependencies`, and `optionalDependencies` from changed `package.json` files.
   - Collapse duplicates by package name/version pair.
   - Do not include transitive-only `package-lock.json` churn unless the user explicitly asks for transitive packages.
   - Mention added or removed direct dependencies separately only when they explain a repo-impact change.
   - Use `scripts/collect-dep-upgrades.mjs` for version/date/release-gap data when practical.

3. Add publish dates and release gap.
   - Use `npm view <pkg> time --json` for exact npm publish timestamps.
   - If network fails, request escalation for npm registry access.
   - Format versions as `` `version` (YYYY-MM-DD) ``.
   - Compute `current release date - previous release date`.
   - Sort largest positive elapsed time first.
   - Keep negative or same-day anomalies, but call them out briefly.

4. Add concise analysis.
   - `Notable changes`: only upstream changes likely to matter for this repo or the upgrade risk. Prefer official changelogs, migration guides, release notes, or docs. Avoid irrelevant metadata trivia.
   - `Repo impact`: concrete local files, config changes, test fixes, build/lint failures, or `None observed`.
   - Mark uncertainty explicitly instead of overstating causes.

5. Verify claims.
   - Run relevant repo commands when practical, especially tests/build/lint/type-check if discussing required changes.
   - Note commands not run, network failures, missing changelogs, and any claims inferred from local experiments.

## Output

Produce a Markdown table with this column order:

| Dependency | Previous version | Current version | Release gap | Notable changes | Repo impact |
| ---------- | ---------------- | --------------- | ----------- | --------------- | ----------- |

Guidelines:

- Use backticks around package names and versions.
- Use `YYYY-MM-DD` for release dates.
- Use compact release gaps such as `3y 5mo`, `54d 1h`, or `3d 23h`.
- The helper script scaffolds `Notable changes` and `Repo impact` as `TODO`; fill them before presenting the table.
- Keep `Notable changes` and `Repo impact` to one short sentence each.
- Link sources after the table when upstream summaries depend on browsed pages.
- Add a short verification note after the table.

## Helper Script

Run from a repository root:

```bash
node .agents/skills/review-dep-upgrade/scripts/collect-dep-upgrades.mjs --base HEAD~1 --head HEAD
```

Useful options:

- `--base <ref>`: git ref for previous versions.
- `--head <ref>`: git ref for current versions. Use `--head worktree` for current files on disk.
- `--json`: emit JSON instead of Markdown.
- `--no-network`: skip npm publish-date lookups and emit blank date/release-gap fields.
- `--npm-timeout <ms>`: timeout per `npm view` call. Default: `15000`.

The script only collects version/date/release-gap data. The agent must still review upstream changes and local impact.
