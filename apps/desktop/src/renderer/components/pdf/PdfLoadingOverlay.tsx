import React from 'react';
import './PdfLoadingOverlay.css';

export const PdfLoadingOverlay: React.FC = () => {
  return (
    <div className="pdf-loading-overlay" aria-live="polite">
      <div className="pdf-loading-spinner" />
      <div className="pdf-loading-text">Loading PDF...</div>
    </div>
  );
};
