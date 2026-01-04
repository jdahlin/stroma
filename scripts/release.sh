#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Usage: scripts/release.sh <version>"
  exit 1
fi

PACKAGE_JSON="apps/desktop/package.json"
TAG="v$VERSION"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "Missing $PACKAGE_JSON"
  exit 1
fi

if git rev-parse -q --verify "refs/tags/$TAG" >/dev/null; then
  echo "Tag $TAG already exists"
  exit 1
fi

LAST_TAG="$(git describe --tags --abbrev=0 2>/dev/null || true)"
if [ -n "$LAST_TAG" ]; then
  RANGE="${LAST_TAG}..HEAD"
  echo "Stats since $LAST_TAG"
else
  RANGE="HEAD"
  echo "Stats (all commits)"
fi

echo "Commits: $(git rev-list --count $RANGE)"
git shortlog -sne $RANGE
git log --oneline $RANGE

node -e "const fs=require('fs');const p='$PACKAGE_JSON';const v=process.argv[1];const j=JSON.parse(fs.readFileSync(p,'utf8'));j.version=v;fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');" "$VERSION"

if git diff --quiet -- "$PACKAGE_JSON"; then
  echo "No version change in $PACKAGE_JSON"
  exit 1
fi

git add "$PACKAGE_JSON"
git commit -m "chore: release $TAG" -- "$PACKAGE_JSON"
git tag "$TAG"
git push origin "$TAG"
