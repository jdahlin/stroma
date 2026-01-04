# Editor roadmap

This is a directional implementation plan. Adjust as the shipped editor evolves.

## Phases

1. Package foundation (`packages/editor`): core editor + build/test wiring.
2. Standalone dev harness (`apps/editor-dev`).
3. Core editor features: toolbar, links, placeholder, images.
4. Slash commands.
5. Structure extensions: sections.
6. PDF reference extension.
7. Persistence + desktop integration.

## Testing strategy

- Unit tests for extension commands and serialization.
- Manual testing in `apps/editor-dev` for UX behavior.

## See also

- MVP roadmap: [`../roadmap-mvp.md`](../roadmap-mvp.md)
- Editor architecture: [`architecture.md`](./architecture.md)

