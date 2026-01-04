# Stroma

Desktop knowledge work environment for deep reading, extraction, and long-term learning.

## Development

```bash
pnpm install
pnpm dev
```

## Unsigned macOS builds

macOS may block unsigned builds with a "damaged" or "untrusted" warning.

Finder:
- Right-click `Stroma.app`
- Choose `Open`
- Click `Open` in the dialog

Terminal:
```bash
xattr -dr com.apple.quarantine /path/to/Stroma.app
open /path/to/Stroma.app
```
