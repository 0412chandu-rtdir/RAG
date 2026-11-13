import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Clock, Server, FileText, Database, Layers } from 'lucide-react';

export default function ProcessingTracker({ statusInfo }) {
  if (!statusInfo) return null;

  const { filename, stage, error, result, processingTime } = statusInfo;

  const steps = [
    {
      id: 'validate',
      name: 'Format & Size Validation',
      desc: 'Verify genuine PDF extension, MIME type, and size limit',
      icon: FileText,
    },
    {
      id: 'upload',
      name: 'Transfer & Local Storage',
      desc: 'Save safely into backend uploads/ directory with UUID',
      icon: Server,
    },
    {
      id: 'extract',
      name: 'PyMuPDF Text Extraction',
      desc: 'Parse digital text and metadata from every page',
      icon: Layers,
    },
    {
      id: 'database',
      name: 'SQL Server Persistence',
      desc: 'Insert document header and page-by-page records into database',
      icon: Database,
    },
  ];

  // Helper to determine status of each step: 'done', 'active', 'pending', 'error'
  const getStepStatus = (stepId) => {
    if (error) {
      if (stage === stepId) return 'error';
      // steps before this stage might be done
      const stepIndex = steps.findIndex((s) => s.id === stepId);
      const currentFailedIndex = steps.findIndex((s) => s.id === stage);
      return stepIndex < currentFailedIndex ? 'done' : 'pending';
    }

    if (stage === 'completed') return 'done';

    const currentIndex = steps.findIndex((s) => s.id === stage);
    const thisIndex = steps.findIndex((s) => s.id === stepId);

    if (thisIndex < currentIndex) return 'done';
    if (thisIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className={`tracker-card ${error ? 'tracker-error' : stage === 'completed' ? 'tracker-success' : 'tracker-active'}`}>
      <div className="tracker-header">
        <div className="tracker-title-group">
          <Clock className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="tracker-title">
              {stage === 'completed' ? 'Ingestion Completed' : error ? 'Ingestion Failed' : 'Pipeline in Progress'}
            </h3>
            <span className="tracker-file">File: <strong>{filename}</strong></span>
          </div>
        </div>

        {processingTime && (
          <span className="timing-pill">
            Completed in {processingTime} ms
          </span>
        )}
      </div>

      {/* Steps visualization */}
      <div className="tracker-steps-grid">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className={`tracker-step-item status-${status}`}>
              <div className="step-icon-wrapper">
                {status === 'done' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : status === 'active' ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : status === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : (
                  <Icon className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="step-details">
                <span className="step-title">{step.name}</span>
                <span className="step-desc">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error alert banner */}
      {error && (
        <div className="tracker-error-box">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div className="error-text">
            <strong>Error during processing:</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Success banner with stats */}
      {stage === 'completed' && result && (
        <div className="tracker-success-box">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="success-text">
            <strong>Extracted Successfully:</strong> {result.page_count} Pages, {result.total_words?.toLocaleString()} Words, {result.total_characters?.toLocaleString()} Characters.
            {result.error_message && (
              <p className="notice-subtext">{result.error_message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

