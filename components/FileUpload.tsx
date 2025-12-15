import React, { useCallback, useState } from 'react';
import { Icons } from './Icons';
import { DocType } from '../types';
import mammoth from 'mammoth';

interface FileUploadProps {
  onFileSelect: (file: File, type: DocType, content: string) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = useCallback(async (file: File) => {
    setError(null);

    // Handle Word Documents (.docx) specially
    if (file.name.toLowerCase().endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const textContent = result.value;
        
        if (!textContent.trim()) {
          setError("O documento Word parece estar vazio ou não contém texto extraível.");
          return;
        }

        onFileSelect(file, DocType.WORD, textContent);
        return;
      } catch (err) {
        console.error(err);
        setError("Erro ao ler o arquivo Word. Certifique-se de que é um arquivo .docx válido.");
        return;
      }
    }

    const reader = new FileReader();
    let type = DocType.UNKNOWN;

    if (file.type.includes('pdf')) {
      type = DocType.PDF;
    } else if (file.type.includes('image')) {
      type = DocType.IMAGE;
    } else if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      type = DocType.TEXT;
    } else {
      // Default to text if small and not explicitly defined, else error
      if (file.size < 100000 && !file.name.endsWith('.doc')) { // Exclude .doc (binary word)
        type = DocType.TEXT;
      } else {
        setError("Formato de arquivo não suportado. Use .docx, .pdf, .txt ou Imagens.");
        return;
      }
    }

    reader.onload = () => {
      const content = reader.result as string;
      onFileSelect(file, type, content);
    };

    reader.onerror = () => {
      setError("Erro ao ler o arquivo.");
    };

    if (type === DocType.TEXT) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-105 shadow-xl' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <Icons.UploadCloud size={48} className={isDragging ? 'text-blue-600' : 'text-slate-400'} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Arraste seu documento aqui
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Suporta PDF, Word (.docx), Imagens e TXT.
            </p>
            
            <label className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-sm transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span>Selecionar Arquivo</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".txt,.md,.json,.pdf,.png,.jpg,.jpeg,.webp,.docx"
                onChange={handleChange}
                disabled={isProcessing}
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm animate-fade-in">
              <Icons.AlertTriangle size={16} />
              {error}
            </div>
          )}
        </div>
      </div>
      
      {/* Features hint */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
            <Icons.Search size={20} />
          </div>
          <h4 className="font-semibold text-slate-800 text-sm">Análise Completa</h4>
          <p className="text-xs text-slate-500 mt-1">Identificação automática de riscos e oportunidades.</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 text-indigo-600">
            <Icons.FileText size={20} />
          </div>
          <h4 className="font-semibold text-slate-800 text-sm">Resumos Claros</h4>
          <p className="text-xs text-slate-500 mt-1">Texto adaptado para gestores, sem jargões.</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 text-emerald-600">
            <Icons.CheckCircle size={20} />
          </div>
          <h4 className="font-semibold text-slate-800 text-sm">Ação Imediata</h4>
          <p className="text-xs text-slate-500 mt-1">Destaque de pedidos e prazos importantes.</p>
        </div>
      </div>
    </div>
  );
};