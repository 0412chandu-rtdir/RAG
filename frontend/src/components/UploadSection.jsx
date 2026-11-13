import React, { useState, useRef } from 'react';
import { Upload, FileCheck, AlertCircle, X, Loader2, Sparkles } from 'lucide-react';

const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function UploadSection({ onUploadStart, onUploadSuccess, onUploadError, isProcessing }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  // Validate file client-side
  const validateFile = (file) => {
    setValidationError('');

    if (!file) return false;

    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
      setValidationError('Invalid file format: Only digital PDF files (.pdf) are accepted.');
      return false;
    }

    // Check MIME type
    if (file.type && file.type !== 'application/pdf') {
      setValidationError('Invalid MIME type: File must be of type application/pdf.');
      return false;
    }

    // Check size limit
    if (file.size > MAX_SIZE_BYTES) {
      setValidationError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`
      );
      return false;
    }

    if (file.size === 0) {
      setValidationError('File is empty (0 bytes). Please select a valid PDF file.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || isProcessing) return;

    if (!validateFile(selectedFile)) return;

    onUploadStart(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="upload-card">
      <div className="card-header">
        <div className="card-title-group">
          <Upload className="w-5 h-5 text-indigo-400" />
          <h2 className="card-title">Document Ingestion Zone</h2>
        </div>
        <span className="badge-pill">PDF Only • Max {MAX_SIZE_MB}MB</span>
      </div>

      <p className="upload-description">
        Upload a digital PDF to begin your RAG pipeline. The application will validate the file, store it locally,
        extract clean page-by-page text using PyMuPDF, and record metadata into SQL Server.
      </p>

      {/* Drag & Drop Area */}
      <div
        className={`dropzone ${dragOver ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isProcessing}
        />

        {!selectedFile ? (
          <div className="dropzone-content">
            <div className="upload-icon-circle">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="dropzone-text">
              <p className="primary-text">
                <strong>Click to browse</strong> or drag & drop your PDF here
              </p>
              <p className="sub-text">Digital PDFs with text layer supported</p>
            </div>
          </div>
        ) : (
          <div className="selected-file-preview" onClick={(e) => e.stopPropagation()}>
            <div className="file-info-group">
              <div className="file-icon-badge">
                <FileCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="file-meta">
                <span className="file-name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>

            {!isProcessing && (
              <button
                type="button"
                className="clear-file-btn"
                onClick={handleClear}
                title="Remove selected file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="error-alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="upload-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Ingestion Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Ingest & Extract Document</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

