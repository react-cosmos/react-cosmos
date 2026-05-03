---
name: gh-release-notes
description: Generate a clean list of commits between two git tags for GitHub release notes.
argument-hint: '[tag]'
---

# GitHub Release Notes

Generate a clean commit list between two git tags for GitHub release notes.

## Instructions

1. If a tag argument is provided (e.g. `/gh-release-notes v7.2.0`), use it. Otherwise, ask the user for the git tag.
2. Find the previous tag by running `git tag --sort=-v:refname` and picking the tag immediately after the provided one in the sorted list.
3. Run `git log --pretty=oneline <previous_tag>...<provided_tag>` to get the commit list.
4. Remove any commits containing `[release]` from the output.
5. Output the remaining commits as a clean list.
6. Ask the user for confirmation before creating the release. Show them the exact release name (same as the tag) and the exact body (the clean commit list from step 5). Do NOT proceed without explicit confirmation.
7. After confirmation, create the GitHub release using `gh release create <tag> --title "<tag>" --notes "<commit list>"`. The release title must be the tag name and the body must be the exact clean list from step 5. Do NOT include a Co-Authored-By line or any Codex attribution.
