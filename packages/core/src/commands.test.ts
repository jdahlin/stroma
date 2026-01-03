import { describe, it, expect, beforeEach } from 'vitest';
import { CommandRegistry, commandId, type KeyboardEvent } from './commands';

describe('CommandRegistry', () => {
  let registry: CommandRegistry;

  beforeEach(() => {
    registry = new CommandRegistry();
  });

  const keyEvent = (
    key: string,
    mods: { meta?: boolean; ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
  ): KeyboardEvent => ({
    key,
    metaKey: mods.meta ?? false,
    ctrlKey: mods.ctrl ?? false,
    shiftKey: mods.shift ?? false,
    altKey: mods.alt ?? false,
  });

  describe('execute', () => {
    it('executes a registered handler', async () => {
      const id = commandId('test.command');
      let called = false;

      registry.define({ id, label: 'Test' });
      registry.register(id, () => {
        called = true;
      });
      await registry.execute(id);

      expect(called).toBe(true);
    });

    it('does nothing for unregistered command', async () => {
      const id = commandId('unregistered');
      await expect(registry.execute(id)).resolves.toBeUndefined();
    });
  });

  describe('executeFromShortcut', () => {
    it('executes command matching shortcut', async () => {
      const id = commandId('test.shortcut');
      let called = false;

      registry.define({ id, label: 'Test', shortcut: keyEvent('k', { meta: true }) });
      registry.register(id, () => {
        called = true;
      });

      const result = await registry.executeFromShortcut(keyEvent('k', { meta: true }));

      expect(result).toBe(true);
      expect(called).toBe(true);
    });

    it('returns false when no shortcut matches', async () => {
      const result = await registry.executeFromShortcut(keyEvent('x', { meta: true }));
      expect(result).toBe(false);
    });

    it('matches case-insensitively', async () => {
      const id = commandId('test.case');
      let called = false;

      registry.define({ id, label: 'Test', shortcut: keyEvent('t', { meta: true }) });
      registry.register(id, () => {
        called = true;
      });

      const result = await registry.executeFromShortcut(keyEvent('T', { meta: true }));

      expect(result).toBe(true);
      expect(called).toBe(true);
    });

    it('requires exact modifier match', async () => {
      const id = commandId('test.mods');
      let callCount = 0;

      registry.define({ id, label: 'Test', shortcut: keyEvent('a', { meta: true, shift: true }) });
      registry.register(id, () => {
        callCount++;
      });

      expect(await registry.executeFromShortcut(keyEvent('a', { meta: true }))).toBe(false);
      expect(await registry.executeFromShortcut(keyEvent('a', { meta: true, shift: true }))).toBe(
        true
      );
      expect(callCount).toBe(1);
    });

    it('matches ctrl as alternative to meta', async () => {
      const id = commandId('test.ctrl');
      let called = false;

      registry.define({ id, label: 'Test', shortcut: keyEvent('b', { meta: true }) });
      registry.register(id, () => {
        called = true;
      });

      const result = await registry.executeFromShortcut(keyEvent('b', { ctrl: true }));

      expect(result).toBe(true);
      expect(called).toBe(true);
    });
  });

  describe('register/unregister', () => {
    it('returns unregister function', () => {
      const id = commandId('test.unreg');

      registry.define({ id, label: 'Test' });
      const unregister = registry.register(id, () => {});

      expect(registry.isRegistered(id)).toBe(true);
      unregister();
      expect(registry.isRegistered(id)).toBe(false);
    });
  });

  describe('getAvailableCommands', () => {
    it('returns only commands with registered handlers', () => {
      const id1 = commandId('cmd.one');
      const id2 = commandId('cmd.two');

      registry.define({ id: id1, label: 'One' });
      registry.define({ id: id2, label: 'Two' });
      registry.register(id1, () => {});

      const available = registry.getAvailableCommands();

      expect(available).toHaveLength(1);
      expect(available[0]?.id).toBe(id1);
    });
  });
});
