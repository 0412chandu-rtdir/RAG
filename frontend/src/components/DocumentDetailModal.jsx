import React, { useState } from 'react';
import { X, Copy, Check, FileText, Layers, Hash, Sparkles, BookOpen, User, Folder, Calendar } from 'lucide-react';

export default function DocumentDetailModal({ document, onClose }) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const pages = document.pages || [];
  const currentPage = pages[activePageIndex] || null;

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCopyText = () => {
    if (!currentPage) return;
    navigator.clipboard.writeText(currentPage.text_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="modal-title" title={document.original_filename}>
                {document.original_filename}
              </h2>
              <span className="modal-subtitle">
                Extracted Document Details & Digital Text Layer (PyMuPDF)
              </span>
            </div>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose} title="Close window">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          {/* Metadata Grid */}
          <div className="meta-stats-grid">
            <div className="meta-card">
              <span className="meta-label">Total Pages</span>
              <span className="meta-value text-indigo-400">{document.page_count}</span>
            </div>
            <div className="meta-card">
              <span className="meta-label">Total Words</span>
              <span className="meta-value text-emerald-400">
                {document.total_words?.toLocaleString() || 0}
              </span>
            </div>
            <div className="meta-card">
              <span className="meta-label">Total Characters</span>
              <span className="meta-value text-sky-400">
                {document.total_characters?.toLocaleString() || 0}
              </span>
            </div>
            <div className="meta-card">
              <span className="meta-label">File Size</span>
              <span className="meta-value text-slate-300">
                {formatBytes(document.file_size_bytes)}
              </span>
            </div>
          </div>

          {/* Additional File Details */}
          <div className="file-info-details">
            {document.doc_title && (
              <div className="info-detail-row">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="info-title">PDF Title Metadata:</span>
                <span className="info-val">{document.doc_title}</span>
              </div>
            )}
            {document.doc_author && (
              <div className="info-detail-row">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="info-title">PDF Author:</span>
                <span className="info-val">{document.doc_author}</span>
              </div>
            )}
            <div className="info-detail-row">
              <Folder className="w-4 h-4 text-slate-400" />
              <span className="info-title">Stored Filename:</span>
              <code className="info-code">{document.stored_filename}</code>
            </div>
          </div>

          {/* Page Navigation Tabs */}
          {pages.length > 0 && (
            <div className="pages-section">
              <div className="pages-header">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="section-title">Extracted Pages ({pages.length})</h3>
                </div>

                {currentPage && (
                  <div className="page-meta-badge">
                    <span>{currentPage.word_count} words</span>
                    <span>•</span>
                    <span>{currentPage.character_count} chars</span>
                  </div>
                )}
              </div>

              {/* Page Number Pills */}
              <div className="page-tabs-bar">
                {pages.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    className={`page-tab ${activePageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActivePageIndex(idx)}
                  >
                    Page {p.page_number}
                  </button>
                ))}
              </div>

              {/* Page Content View */}
              {currentPage ? (
                <div className="page-text-container">
                  <div className="page-text-toolbar">
                    <span className="page-number-label">
                      Showing Page {currentPage.page_number} Content:
                    </span>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={handleCopyText}
                      title="Copy page text to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="extracted-text-box">
                    {currentPage.text_content || (
                      <em className="text-slate-500">
                        No extractable text found on this page (page may contain only raster images).
                      </em>
                    )}
                  </pre>
                </div>
              ) : null}
            </div>
          )}

          {/* Future RAG Modules Architecture Placeholder */}
          <div className="future-architecture-card">
            <div className="future-header">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="future-title">Future RAG Module Preparation: Chunking & Embeddings</h4>
            </div>
            <p className="future-desc">
              This document has passed <strong>Phase 1: Ingestion</strong>. The structured page text is preserved in SQL Server 
              (<code>document_pages</code>) ready for:
            </p>
            <ul className="future-list">
              <li>
                <strong>Phase 2: Text Chunking</strong> — Splitting each page's <code>text_content</code> into semantic token chunks with overlaps.
              </li>
              <li>
                <strong>Phase 3: Vector Embeddings</strong> — Passing chunks into embedding models (e.g. OpenAI or Hugging Face) to create vector arrays.
              </li>
              <li>
                <strong>Phase 4: Vector Storage & Search</strong> — Storing embeddings into a vector store for semantic similarity retrieval during queries.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

