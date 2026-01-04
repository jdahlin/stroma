import React, { useEffect, useState } from 'react';
import type { IDockviewPanelProps } from 'dockview';
import { PaneMenu } from './PaneMenu';
import './Pane.css';

export const HomePane: React.FC<IDockviewPanelProps> = () => {
  const [appVersion, setAppVersion] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    window.stroma
      ?.appVersion()
      .then((version) => {
        if (isMounted) {
          setAppVersion(version);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAppVersion('unknown');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="pane pane-home">
      <PaneMenu />
      <h1>Welcome to Stroma</h1>
      <p>Your knowledge work environment.</p>
      <div className="home-info">
        <p>
          Platform: <code>{window.stroma?.platform ?? 'unknown'}</code>
        </p>
        <p>
          Electron: <code>{window.stroma?.versions.electron ?? 'unknown'}</code>
        </p>
        <p>
          App: <code>{appVersion ?? 'unknown'}</code>
        </p>
      </div>
    </div>
  );
};
