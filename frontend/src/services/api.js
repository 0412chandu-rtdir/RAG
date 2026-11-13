/**
 * API Service for RAG Document Ingestion.
 * Handles HTTP requests to the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  /**
   * Health check to test backend and SQL Server connectivity
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`Health check returned status ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      return { status: 'error', error: err.message };
    }
  },

  /**
   * Upload and process a PDF document.
   * Sends the file as multipart/form-data to POST /api/documents/upload.
   */
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || data.message || 'Failed to upload document.';
      throw new Error(errorMsg);
    }

    return data;
  },

  /**
   * Fetch all ingested documents summary
   */
  async getDocuments() {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents list.');
    }
    return await response.json();
  },

  /**
   * Fetch full details of a specific document including page-by-page extracted text
   */
  async getDocumentDetails(documentId) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for document ID ${documentId}.`);
    }
    return await response.json();
  },

  /**
   * Delete a document, its database records and stored file
   */
  async deleteDocument(documentId) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete document ID ${documentId}.`);
    }
    return await response.json();
  },
};

