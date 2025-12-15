export enum DocType {
  TEXT = 'TEXT',
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  WORD = 'WORD',
  UNKNOWN = 'UNKNOWN'
}

export interface AnalysisSection {
  title: string;
  content: string[];
}

export interface Risk {
  description: string;
  severity: 'Baixo' | 'Médio' | 'Alto';
}

export interface RequestItem {
  description: string;
  priority: 'Normal' | 'Urgente';
}

export interface AnalysisReport {
  summary: string;
  keyPoints: string[];
  requests: RequestItem[];
  risks: Risk[];
  benefits: string[];
  keywords: string[];
  additionalNotes?: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  fileName: string;
  uploadDate: string; // ISO String
  type: DocType;
  fileContent: string; // Base64 or Text
  report: AnalysisReport | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
}