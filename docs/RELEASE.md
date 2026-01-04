# Release Process

This document describes how to release new versions of Stroma.

## Overview

Stroma uses GitHub Actions for automated builds and releases. The workflow:

1. Triggers on git tags matching `v*` (e.g., `v0.1.0`)
2. Builds macOS packages for both Intel (x64) and Apple Silicon (arm64)
3. Creates a draft GitHub Release with all artifacts

## Creating a Release

### Prerequisites

1. Ensure all changes are committed and pushed to `main`
2. Verify the build passes locally: `pnpm build`
3. Update version in `apps/desktop/package.json` if not already updated

### Steps

1. **Create and push a version tag:**

   ```bash
   # Update version in apps/desktop/package.json
   cd apps/desktop
   npm version patch  # or minor, major, or specific version

   # Push the tag
   git push origin v$(node -p "require('./package.json').version")
   ```

2. **Monitor the build:**
   - Go to Actions tab in GitHub
   - Watch the "Release" workflow progress
   - Build takes approximately 10-15 minutes

3. **Publish the release:**
   - Navigate to Releases in GitHub
   - Find the draft release created by the workflow
   - Review the auto-generated release notes
   - Edit description if needed
   - Click "Publish release"

### Manual Workflow Dispatch

You can also trigger a release manually from the Actions tab:

1. Go to Actions > Release workflow
2. Click "Run workflow"
3. Enter the version number (without 'v' prefix)
4. Click "Run workflow"

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible

Pre-release versions use suffixes: `0.1.0-beta.1`, `0.1.0-rc.1`

## Artifacts

Each release produces:

### macOS

| File                             | Description               |
| -------------------------------- | ------------------------- |
| `Stroma-{version}-mac-x64.dmg`   | Intel Mac disk image      |
| `Stroma-{version}-mac-arm64.dmg` | Apple Silicon disk image  |
| `Stroma-{version}-mac-x64.zip`   | Intel Mac zip archive     |
| `Stroma-{version}-mac-arm64.zip` | Apple Silicon zip archive |

### Windows

| File                             | Description             |
| -------------------------------- | ----------------------- |
| `Stroma-{version}-win-x64.exe`   | Windows x64 installer   |
| `Stroma-{version}-win-arm64.exe` | Windows ARM64 installer |

### Linux

| File                                  | Description           |
| ------------------------------------- | --------------------- |
| `Stroma-{version}-x64.AppImage`       | Linux x64 AppImage    |
| `Stroma-{version}-arm64.AppImage`     | Linux ARM64 AppImage  |
| `stroma_{version}_amd64.deb`          | Debian/Ubuntu package |
| `Stroma-{version}-linux-x64.tar.gz`   | Linux x64 tarball     |
| `Stroma-{version}-linux-arm64.tar.gz` | Linux ARM64 tarball   |

## Code Signing

Currently, releases are unsigned. Users will see a warning on first launch.

To bypass on macOS:

- Right-click the app > Open, or
- System Settings > Privacy & Security > Open Anyway

### Enabling Code Signing (Future)

To enable code signing, you'll need:

1. Apple Developer Program membership ($99/year)
2. Developer ID Application certificate
3. Add the following secrets to GitHub:
   - `MAC_CERTS`: Base64-encoded .p12 certificate
   - `MAC_CERTS_PASSWORD`: Certificate password
   - `APPLE_ID`: Your Apple ID email
   - `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password for notarization
   - `APPLE_TEAM_ID`: Your Apple Developer Team ID

Then uncomment the code signing environment variables in `.github/workflows/release.yml`.

## Local Testing

To test the build locally without publishing:

```bash
# Build all packages
pnpm build

# Create a macOS package (unpacked, for testing)
cd apps/desktop
pnpm pack

# Create full DMG
pnpm dist:mac
```

The output will be in `apps/desktop/release/`.

## Troubleshooting

### Build fails with "electron-builder" error

Ensure `electron-builder` is installed:

```bash
pnpm install
```

### DMG shows wrong icon

Regenerate `icon.icns` from a 1024x1024 PNG:

```bash
mkdir icon.iconset
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset -o apps/desktop/build/icon.icns
```

### Release not appearing

Check if the release was created as a draft. Navigate to Releases and publish it manually.
