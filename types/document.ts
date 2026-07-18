export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'failed';

export interface StudyDocument {
  id: string;
  title: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  pageCount?: number;
  status: DocumentStatus;
  summaryPreview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSummary {
  id: string;
  documentId: string;
  title: string;
  content: string;
  keyPoints: string[];
  createdAt: string;
}
