import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ProcessingTracker from './components/ProcessingTracker';
import DocumentList from './components/DocumentList';
import DocumentDetailModal from './components/DocumentDetailModal';
import ArchitectureGuide from './components/ArchitectureGuide';
import { api } from './services/api';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [health, setHealth] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);
  const [selectedDocDetails, setSelectedDocDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Check health of backend & SQL Server on load
  const checkHealth = useCallback(async () => {
    const res = await api.checkHealth();
    setHealth(res);
  }, []);

  // Fetch documents list from backend
  const loadDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    loadDocuments();
  }, [checkHealth, loadDocuments]);

  // Handle uploading and processing pipeline
  const handleUploadStart = async (file) => {
    setIsProcessing(true);
    setStatusInfo({
      filename: file.name,
      stage: 'validate',
      error: null,
      result: null,
      processingTime: null,
    });

    try {
      // Step 1: Client validation passed, proceed to transfer
      setStatusInfo((prev) => ({ ...prev, stage: 'upload' }));

      // Small delay for UI visual feedback on stages
      await new Promise((r) => setTimeout(r, 400));
      setStatusInfo((prev) => ({ ...prev, stage: 'extract' }));

      // Send to FastAPI backend (which validates, saves, extracts with PyMuPDF, and stores in SQL Server)
      const response = await api.uploadDocument(file);

      setStatusInfo((prev) => ({ ...prev, stage: 'database' }));
      await new Promise((r) => setTimeout(r, 300));

      setStatusInfo({
        filename: file.name,
        stage: 'completed',
        error: null,
        result: response.document,
        processingTime: response.processing_time_ms,
      });

      // Refresh documents list to display the newly ingested document
      await loadDocuments();
    } catch (err) {
      console.error('Upload failed:', err);
      setStatusInfo((prev) => ({
        ...prev,
        stage: prev?.stage || 'upload',
        error: err.message || 'An error occurred during ingestion.',
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Inspect document details modal
  const handleViewDetails = async (documentId) => {
    setIsLoadingDetails(true);
    try {
      const doc = await api.getDocumentDetails(documentId);
      setSelectedDocDetails(doc);
    } catch (err) {
      alert(`Could not load document details: ${err.message}`);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (documentId, filename) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${filename}" and its extracted text from SQL Server?`);
    if (!confirmed) return;

    try {
      await api.deleteDocument(documentId);
      await loadDocuments();
      if (selectedDocDetails?.id === documentId) {
        setSelectedDocDetails(null);
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation & RAG Pipeline Status */}
      <Header health={health} />

      <main className="main-content">
        <div className="content-container">
          {/* Upload Card */}
          <UploadSection
            onUploadStart={handleUploadStart}
            isProcessing={isProcessing}
          />

          {/* Processing Tracker & Status Display */}
          <ProcessingTracker statusInfo={statusInfo} />

          {/* Table of Ingested Documents in SQL Server */}
          <DocumentList
            documents={documents}
            isLoading={isLoadingDocs}
            onRefresh={loadDocuments}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteDocument}
          />

          {/* Beginner Architectural Overview */}
          <ArchitectureGuide />
        </div>
      </main>

      {/* Extracted Document Information & Page Viewer Modal */}
      {selectedDocDetails && (
        <DocumentDetailModal
          document={selectedDocDetails}
          onClose={() => setSelectedDocDetails(null)}
        />
      )}
    </div>
  );
}
