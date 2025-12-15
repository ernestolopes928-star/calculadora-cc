import React, { useRef } from 'react';
import { AnalysisReport, DocumentRecord, DocType } from '../types';
import { Icons } from './Icons';

interface ReportViewProps {
  document: DocumentRecord;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ document, onBack }) => {
  const report = document.report;
  const contentRef = useRef<HTMLDivElement>(null);

  if (!report) {
    return (
      <div className="text-center p-10 text-slate-500">
        Relatório indisponível ou processamento falhou.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getDocIcon = () => {
    switch(document.type) {
      case DocType.IMAGE: return <Icons.Image size={24} className="text-purple-600" />;
      case DocType.PDF: return <Icons.FileText size={24} className="text-red-600" />;
      case DocType.WORD: return <Icons.FileText size={24} className="text-blue-700" />;
      default: return <Icons.FileText size={24} className="text-slate-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Icons.ChevronRight className="rotate-180" size={20} />
          Voltar para Lista
        </button>

        <div className="flex gap-3">
            {/* Mock Export */}
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Icons.Download size={18} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={contentRef} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        {/* Document Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              {getDocIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{document.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>Processado em: {new Date(document.uploadDate).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="uppercase tracking-wider text-xs font-semibold">{document.type}</span>
              </div>
            </div>
          </div>

          {/* Keywords Chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {report.keywords.map((keyword, idx) => (
              <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Executive Summary */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Icons.FileText className="text-blue-600" size={20} />
              Resumo Executivo
            </h2>
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-slate-700 leading-relaxed text-justify">
              {report.summary}
            </div>
          </section>

          {/* Key Points */}
          <section>
             <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Icons.CheckCircle className="text-slate-600" size={20} />
              Pontos Importantes
            </h2>
            <ul className="space-y-3">
              {report.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Risks */}
            <section className="h-full">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Icons.AlertOctagon className="text-red-600" size={20} />
                Riscos Identificados
              </h2>
              <div className="space-y-3">
                {report.risks.length === 0 ? (
                    <p className="text-slate-500 italic">Nenhum risco crítico identificado.</p>
                ) : (
                    report.risks.map((risk, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-red-100 bg-red-50/30 flex items-start gap-3">
                        <div className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                        ${risk.severity === 'Alto' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {risk.severity}
                        </div>
                        <p className="text-sm text-slate-700 font-medium">{risk.description}</p>
                    </div>
                    ))
                )}
              </div>
            </section>

            {/* Benefits */}
            <section className="h-full">
               <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Icons.TrendingUp className="text-emerald-600" size={20} />
                Benefícios & Vantagens
              </h2>
              <div className="space-y-3">
                {report.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex items-start gap-3">
                     <Icons.CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                     <p className="text-sm text-slate-700 font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Requests/Action Items */}
           <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Icons.AlertTriangle className="text-amber-500" size={20} />
              Solicitações & Pedidos
            </h2>
            <div className="grid grid-cols-1 gap-3">
               {report.requests.length === 0 ? (
                   <p className="text-slate-500 italic">Nenhuma solicitação explícita encontrada.</p>
               ) : (
                   report.requests.map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <span className="text-slate-700 font-medium">{req.description}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                        ${req.priority === 'Urgente' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                        {req.priority}
                        </span>
                    </div>
                   ))
               )}
            </div>
          </section>

          {/* Additional Notes */}
          {report.additionalNotes && (
             <section className="border-t border-slate-200 pt-8">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Observações Adicionais
                </h2>
                <p className="text-slate-600 text-sm">
                  {report.additionalNotes}
                </p>
             </section>
          )}

        </div>
      </div>
    </div>
  );
};