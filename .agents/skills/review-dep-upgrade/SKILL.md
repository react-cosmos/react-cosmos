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

2. Collect direct dependency upgrades.
   - Run the helper script (see Helper Script below); it emits JSON sorted by largest release gap.
   - The script covers `dependencies`, `devDependencies`, `peerDependencies`, and `optionalDependencies`, skips workspace-internal packages, and dedupes by name/version pair.
   - Do not include transitive-only `package-lock.json` churn unless the user explicitly asks for it.
   - Mention added or removed direct dependencies separately only when they explain a repo-impact change.

3. Sanity-check the dates.
   - If any entry has `"lookupError": true`, the `npm view` call failed for that package (the script also exits non-zero and prints the failure to stderr). Treat this as a tooling problem: request escalation for npm registry access and re-run before presenting the report — do not ship a report with `lookupError` entries.
   - If a date is `null` without `lookupError`, that specific version is missing from npm's `time` data — it may have been unpublished or renamed. Call it out in the report.
   - Keep negative or same-day release gaps in the report, but call them out briefly.

4. Add analysis.
   - `Notable changes`: only upstream changes likely to matter for this repo or the upgrade risk. Prefer official changelogs, migration guides, release notes, or docs. Avoid irrelevant metadata trivia.
   - `Repo impact`: concrete local files, config changes, test fixes, build/lint failures, or `None observed`.
   - Mark uncertainty explicitly instead of overstating causes.

5. Verify claims.
   - Run relevant repo commands when practical, especially tests/build/lint/type-check if discussing required changes.
   - Use verification results to inform `Repo impact`.

## Output

Produce a Markdown section for each dependency, sorted by largest positive release gap first:

```markdown
### `dependency` — `previous` (YYYY-MM-DD) → `current` (YYYY-MM-DD)

- **Release gap:** 3y 5mo
- **Notable changes:** TODO
- **Repo impact:** TODO
```

Guidelines:

- Use backticks around package names and versions.
- Use `YYYY-MM-DD` for release dates (slice the script's ISO timestamps).
- Use the script's `releaseGap` string verbatim (compact forms like `3y 5mo`, `54d 1h`).
- If a date is `null`, omit the parens for that version.
- Fill in `Notable changes` and `Repo impact` for every entry before presenting the report.
- `Notable changes` and `Repo impact` may be multiple sentences when needed for important context.
- Use `None observed.` for repo impact when there is nothing concrete.
- End with a `### Sources` section when upstream summaries depend on browsed pages.

## Helper Script

Run from the repo root:

```bash
node .agents/skills/review-dep-upgrade/scripts/collect-dep-upgrades.mjs --base HEAD~1 --head HEAD
```

Defaults: `--base HEAD~1`, `--head worktree`. Options:

- `--base <ref>`: git ref for previous versions.
- `--head <ref>`: git ref for current versions. Use `worktree` for current files on disk.

Emits a JSON array of direct dependency upgrades, sorted by largest release gap, with workspace-internal packages filtered out. Example entry:

```json
{
  "dependency": "ts-loader",
  "previousVersion": "9.5.4",
  "previousDate": "2025-08-24T08:06:29.241Z",
  "currentVersion": "9.5.7",
  "currentDate": "2026-04-02T07:49:53.845Z",
  "releaseGap": "7mo 10d",
  "releaseGapMs": 19093404604
}
```

If `npm view` fails for a package, its entries gain `"lookupError": true`, the failure is logged to stderr, and the script exits non-zero. Render the Markdown report (see Output) from this data and fill in `Notable changes` and `Repo impact`.
