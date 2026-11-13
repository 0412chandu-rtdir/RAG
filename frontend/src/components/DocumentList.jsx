import React from 'react';
import { FileText, Eye, Trash2, RefreshCw, Layers, CheckCircle2, AlertTriangle, AlertCircle, Calendar } from 'lucide-react';

export default function DocumentList({
  documents,
  isLoading,
  onRefresh,
  onViewDetails,
  onDelete,
}) {
  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return (
          <span className="status-badge badge-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            COMPLETED
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="status-badge badge-processing">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            PROCESSING
          </span>
        );
      case 'FAILED':
        return (
          <span className="status-badge badge-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            FAILED
          </span>
        );
      default:
        return <span className="status-badge badge-neutral">{status || 'UNKNOWN'}</span>;
    }
  };

  return (
    <div className="documents-card">
      <div className="card-header">
        <div className="card-title-group">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="card-title">Ingested Documents in SQL Server</h2>
          <span className="count-pill">{documents.length}</span>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh documents list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <FileText className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="empty-title">No documents ingested yet</h3>
          <p className="empty-desc">
            Upload your first digital PDF above to extract its text and store metadata in SQL Server.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Status</th>
                <th>Pages</th>
                <th>Extracted Words</th>
                <th>Size</th>
                <th>Uploaded At</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="doc-row">
                  <td className="doc-name-cell">
                    <div className="doc-name-wrapper">
                      <div className="doc-icon-wrap">
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="doc-meta-names">
                        <span className="doc-orig-name" title={doc.original_filename}>
                          {doc.original_filename}
                        </span>
                        {doc.doc_title && (
                          <span className="doc-meta-title" title={doc.doc_title}>
                            Title: {doc.doc_title}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(doc.status)}</td>
                  <td className="font-medium text-slate-300">{doc.page_count}</td>
                  <td className="text-slate-300">
                    {doc.total_words ? doc.total_words.toLocaleString() : '0'}
                  </td>
                  <td className="text-slate-400 text-sm">{formatBytes(doc.file_size_bytes)}</td>
                  <td className="text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                  </td>
                  <td className="actions-cell text-right">
                    <button
                      type="button"
                      className="action-btn view-btn"
                      onClick={() => onViewDetails(doc.id)}
                      title="Inspect extracted text & metadata"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect</span>
                    </button>
                    <button
                      type="button"
                      className="action-btn delete-btn"
                      onClick={() => onDelete(doc.id, doc.original_filename)}
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

