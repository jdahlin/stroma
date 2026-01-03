import React, { useState, useEffect, useMemo, useRef } from 'react';
import { commandRegistry, type CommandId } from '@repo/core';
import './CommandPalette.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const availableCommands = commandRegistry.getAvailableCommands();
  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return availableCommands;
    return availableCommands.filter((command) => command.label.toLowerCase().includes(normalizedQuery));
  }, [availableCommands, query]);

  const executeCommand = (id: CommandId) => {
    commandRegistry.execute(id);
    onClose();
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filteredCommands[0]) {
              executeCommand(filteredCommands[0].id);
            }
          }}
          placeholder="Type a command..."
          className="command-palette-input"
        />
        <div className="command-palette-list">
          {filteredCommands.length === 0 ? (
            <div className="command-palette-empty">No commands found</div>
          ) : (
            filteredCommands.map((command) => (
              <button
                key={command.id}
                type="button"
                className="command-palette-item"
                onClick={() => executeCommand(command.id)}
              >
                <span className="command-palette-item-label">{command.label}</span>
                {command.category ? (
                  <span className="command-palette-item-category">{command.category}</span>
                ) : null}
              </button>
            ))
          )}
        </div>
        <div className="command-palette-hint">
          Press <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};
