---
title: "How do releases work?"
status: implemented
audience: [maintainer]
last_updated: 2026-01-04
---

# How do releases work?
This document explains how to produce and publish a Stroma release.

## Who is this for?
- Maintainers cutting official releases.

## What is the scope?
- In scope: tagging, CI build flow, artifacts, and troubleshooting.
- Out of scope: day-to-day development workflows.

## What is the mental model?
- A release is a version tag that triggers CI builds and produces platform artifacts.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Version tag | Git tag that triggers the release workflow. | "v0.1.0" |
| Artifact | OS-specific build output. | "macOS DMG" |
| Draft release | CI-created release awaiting publish. | "Draft in GitHub Releases." |

## What are the prerequisites?
- All changes are committed and pushed to `main`.
- Local build passes: `pnpm build`.
- App version is updated in `apps/desktop/package.json`.

## What are the release steps?
1. Create and push a version tag:
   ```bash
   cd apps/desktop
   npm version patch
   git push origin v$(node -p "require('./package.json').version")
   ```
2. Monitor the GitHub Actions release workflow.
3. Publish the draft release after checking notes.

## What artifacts are produced?
| Platform | Artifacts | Example |
| --- | --- | --- |
| macOS | DMG and ZIP for x64/arm64. | `Stroma-0.1.0-mac-arm64.dmg` |
| Windows | EXE for x64/arm64. | `Stroma-0.1.0-win-x64.exe` |
| Linux | AppImage, DEB, tar.gz. | `Stroma-0.1.0-x64.AppImage` |

## What are the manual dispatch steps?
- Run the Release workflow from GitHub Actions.
- Provide the version number without the `v` prefix.

## What are the failure modes or edge cases?
- The tag is missing the `v` prefix, so CI does not trigger.
- The build fails because dependencies were not installed.

## What assumptions and invariants apply?
- Releases are built by GitHub Actions.
- Artifacts are published as drafts first.

## What are the facts?
- Releases are currently unsigned.

## What decisions are recorded?
- Semantic Versioning is the versioning scheme.

## What are the open questions?
- When should code signing be enabled?

## What related docs matter?
- Monorepo layout: [`monorepo.md`](./monorepo.md)

## What this doc does not cover
- The internal CI configuration or packaging scripts.
