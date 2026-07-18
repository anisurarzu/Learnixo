import { create } from 'zustand';
import type { StudyDocument } from '@/types';

interface DocumentsStore {
  documents: StudyDocument[];
  selectedId: string | null;
  isUploading: boolean;
  setDocuments: (documents: StudyDocument[]) => void;
  addDocument: (document: StudyDocument) => void;
  updateDocument: (id: string, patch: Partial<StudyDocument>) => void;
  removeDocument: (id: string) => void;
  selectDocument: (id: string | null) => void;
  setUploading: (isUploading: boolean) => void;
  reset: () => void;
}

export const useDocumentsStore = create<DocumentsStore>((set) => ({
  documents: [],
  selectedId: null,
  isUploading: false,
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) =>
    set((state) => ({ documents: [document, ...state.documents] })),
  updateDocument: (id, patch) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...patch } : doc,
      ),
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  selectDocument: (selectedId) => set({ selectedId }),
  setUploading: (isUploading) => set({ isUploading }),
  reset: () => set({ documents: [], selectedId: null, isUploading: false }),
}));
