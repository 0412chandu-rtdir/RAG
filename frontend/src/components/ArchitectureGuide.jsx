import React from 'react';
import { BookOpen, FileCheck, Layers, Cpu, Database, ArrowRight } from 'lucide-react';

export default function ArchitectureGuide() {
  return (
    <div className="guide-card">
      <div className="card-header">
        <div className="card-title-group">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="card-title">Beginner Guide: Understanding RAG Ingestion</h2>
        </div>
        <span className="badge-pill info">Architecture Overview</span>
      </div>

      <div className="guide-content">
        <p className="guide-lead">
          In a production Retrieval-Augmented Generation (RAG) system, <strong>Document Ingestion</strong> is the foundational phase.
          Keeping ingestion decoupled from chunking, embeddings, and vector databases ensures stability, data provenance, and clean debugging.
        </p>

        <div className="architecture-grid">
          {/* Phase 1 */}
          <div className="arch-box arch-active">
            <div className="arch-badge">Phase 1 (Current Scope)</div>
            <div className="arch-icon-wrap">
              <FileCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="arch-box-title">Document Ingestion</h3>
            <ul className="arch-points">
              <li>Digital PDF format validation</li>
              <li>Magic bytes & size checking</li>
              <li>Local filesystem storage</li>
              <li>PyMuPDF page-by-page text parsing</li>
              <li>Metadata tracking in SQL Server</li>
            </ul>
          </div>

          <div className="arch-connector">
            <ArrowRight className="w-5 h-5 text-slate-500" />
          </div>

          {/* Phase 2 */}
          <div className="arch-box arch-future">
            <div className="arch-badge future">Phase 2 (Next)</div>
            <div className="arch-icon-wrap">
              <Layers className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="arch-box-title">Text Chunking</h3>
            <ul className="arch-points">
              <li>Token or sentence boundary splitting</li>
              <li>Overlap preservation</li>
              <li>Chunk metadata tracking</li>
            </ul>
          </div>

          <div className="arch-connector">
            <ArrowRight className="w-5 h-5 text-slate-500" />
          </div>

          {/* Phase 3 */}
          <div className="arch-box arch-future">
            <div className="arch-badge future">Phase 3 (Next)</div>
            <div className="arch-icon-wrap">
              <Cpu className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="arch-box-title">Vector Embeddings</h3>
            <ul className="arch-points">
              <li>Embedding model transformation</li>
              <li>Vector indexing</li>
              <li>Similarity search preparation</li>
            </ul>
          </div>

          <div className="arch-connector">
            <ArrowRight className="w-5 h-5 text-slate-500" />
          </div>

          {/* Phase 4 */}
          <div className="arch-box arch-future">
            <div className="arch-badge future">Phase 4 (Next)</div>
            <div className="arch-icon-wrap">
              <Database className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="arch-box-title">Retrieval & LLM</h3>
            <ul className="arch-points">
              <li>Cosine similarity retrieval</li>
              <li>Prompt augmentation</li>
              <li>Accurate hallucination-free answers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

