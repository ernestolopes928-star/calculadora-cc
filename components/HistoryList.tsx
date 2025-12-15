import React, { useState } from 'react';
import { DocumentRecord, DocType } from '../types';
import { Icons } from './Icons';

interface HistoryListProps {
  documents: DocumentRecord[];
  onSelect: (doc: DocumentRecord) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ documents, onSelect, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.report?.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDocIcon = (type: DocType) => {
    switch(type) {
      case DocType.IMAGE: return <Icons.Image size={20} className="text-purple-600" />;
      case DocType.PDF: return <Icons.FileText size={20} className="text-red-600" />;
      case DocType.WORD: return <Icons.FileText size={20} className="text-blue-700" />;
      default: return <Icons.FileText size={20} className="text-slate-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Histórico de Documentos</h2>
        <div className="relative w-full md:w-96">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por título ou palavra-chave..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Icons.FileText className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500">Nenhum documento encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => onSelect(doc)}
              className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  {getDocIcon(doc.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{doc.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span className="capitalize">{doc.type.toLowerCase()}</span>
                    {doc.report && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">Análise Concluída</span>
                      </>
                    )}
                    {doc.status === 'failed' && (
                       <span className="text-red-500 font-medium ml-2">Falha no processamento</span>
                    )}
                    {doc.status === 'processing' && (
                      <span className="flex items-center gap-1 text-blue-500 font-medium ml-2">
                        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Processando...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Icons.X size={18} />
                </button>
                <Icons.ChevronRight className="text-slate-300 group-hover:text-blue-500" size={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};