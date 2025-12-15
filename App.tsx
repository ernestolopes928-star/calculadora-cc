import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FileUpload } from './components/FileUpload';
import { HistoryList } from './components/HistoryList';
import { ReportView } from './components/ReportView';
import { StorageService } from './services/storageService';
import { GeminiService } from './services/geminiService';
import { DocumentRecord, DocType } from './types';
import { Icons } from './components/Icons';

type ViewState = 'new' | 'history' | 'report';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('new');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load documents on mount
  useEffect(() => {
    setDocuments(StorageService.getAll());
  }, []);

  const handleFileSelect = async (file: File, type: DocType, content: string) => {
    setIsProcessing(true);

    const newDoc: DocumentRecord = {
      id: crypto.randomUUID(),
      title: file.name,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      type: type,
      fileContent: content,
      report: null,
      status: 'processing'
    };
    
    try {
      const report = await GeminiService.analyzeDocument(content, type);
      newDoc.report = report;
      newDoc.status = 'completed';
      
      StorageService.save(newDoc);
      setDocuments(StorageService.getAll());
      setSelectedDocId(newDoc.id);
      setActiveView('report');
    } catch (error) {
      console.error(error);
      newDoc.status = 'failed';
      newDoc.errorMessage = "Erro ao processar documento com IA.";
      StorageService.save(newDoc);
      setDocuments(StorageService.getAll());
      alert("Falha ao analisar o documento. Verifique sua chave de API ou tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      StorageService.delete(id);
      setDocuments(StorageService.getAll());
      if (selectedDocId === id) {
        setActiveView('history');
        setSelectedDocId(null);
      }
    }
  };

  const handleSelectDoc = (doc: DocumentRecord) => {
    setSelectedDocId(doc.id);
    setActiveView('report');
    setSidebarOpen(false); // Mobile UX
  };

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        activeView={activeView}
        onNewAnalysis={() => { setActiveView('new'); setSidebarOpen(false); }}
        onViewHistory={() => { setActiveView('history'); setSidebarOpen(false); }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-3 bg-white border-b border-slate-200 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Icons.Menu size={24} />
          </button>
          {/* Logo da insígnia removida */}
          <div className="ml-3 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Governo de Angola</span>
            <span className="font-bold text-slate-800 text-sm leading-tight">ADM C. Cuanavale</span>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative">
          
          {/* O botão de Logout foi removido, pois não há mais tela de login. */}

          {activeView === 'new' && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Nova Análise</h1>
                <p className="text-slate-500 mt-2">
                  Envie documentos para análise instantânea de riscos, benefícios e pontos-chave.
                </p>
              </div>
              
              <FileUpload 
                onFileSelect={handleFileSelect} 
                isProcessing={isProcessing} 
              />

              {isProcessing && (
                <div className="mt-8 text-center animate-pulse">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-medium">Analisando documento com Gemini AI...</p>
                  <p className="text-slate-400 text-sm">Isso pode levar alguns segundos.</p>
                </div>
              )}
            </div>
          )}

          {activeView === 'history' && (
            <div className="animate-fade-in">
              <HistoryList 
                documents={documents} 
                onSelect={handleSelectDoc}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeView === 'report' && selectedDoc && (
            <div className="animate-fade-in">
              <ReportView 
                document={selectedDoc} 
                onBack={() => setActiveView('history')}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}