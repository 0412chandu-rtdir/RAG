import React from 'react';
import { Database, FileText, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

export default function Header({ health }) {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-group">
          <div className="brand-icon">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="brand-title">RAG Document Ingestion Studio</h1>
            <p className="brand-subtitle">
              Phase 1: PDF Validation, Local Storage & PyMuPDF Text Extraction with SQL Server
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Database Health Badge */}
          <div className={`health-badge ${isHealthy ? 'healthy' : 'warning'}`}>
            <Database className="w-4 h-4" />
            <span>
              {isHealthy ? 'SQL Server Connected' : 'Checking Database...'}
            </span>
          </div>

          {/* Swagger Docs Link */}
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="swagger-btn"
            title="Open Interactive FastAPI Swagger Documentation"
          >
            <span>Swagger API Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* RAG Pipeline Road-Map Bar */}
      <div className="pipeline-bar">
        <span className="pipeline-label">RAG Pipeline Architecture:</span>
        <div className="pipeline-steps">
          <div className="pipeline-step active">
            <span className="step-num">1</span>
            <span className="step-name">Document Ingestion</span>
            <span className="step-tag active">Active Module</span>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step pending">
            <span className="step-num">2</span>
            <span className="step-name">Text Chunking</span>
            <span className="step-tag">Future Step</span>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step pending">
            <span className="step-num">3</span>
            <span className="step-name">Embeddings (Vectors)</span>
            <span className="step-tag">Future Step</span>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step pending">
            <span className="step-num">4</span>
            <span className="step-name">Vector Search & LLM</span>
            <span className="step-tag">Future Step</span>
          </div>
        </div>
      </div>
    </header>
  );
}

