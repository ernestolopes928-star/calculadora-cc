import { DocumentRecord } from '../types';

const STORAGE_KEY = 'doc_analyst_db_v1';

export const StorageService = {
  getAll: (): DocumentRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load documents', e);
      return [];
    }
  },

  save: (doc: DocumentRecord): void => {
    const docs = StorageService.getAll();
    // Check if exists to update, else push
    const index = docs.findIndex(d => d.id === doc.id);
    if (index >= 0) {
      docs[index] = doc;
    } else {
      docs.unshift(doc); // Add to top
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  },

  delete: (id: string): void => {
    const docs = StorageService.getAll();
    const filtered = docs.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getById: (id: string): DocumentRecord | undefined => {
    const docs = StorageService.getAll();
    return docs.find(d => d.id === id);
  }
};