import React from 'react';
import { Icons } from './Icons';

interface SidebarProps {
  onNewAnalysis: () => void;
  onViewHistory: () => void;
  activeView: 'new' | 'history' | 'report';
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewAnalysis, onViewHistory, activeView, className }) => {
  return (
    <div className={`bg-slate-900 text-white flex flex-col h-full ${className}`}>
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        {/* Logo da insígnia removida */}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Governo de Angola</span>
          <h1 className="font-bold text-sm leading-tight text-white">ADM Municipal<br/>do C. Cuanavale</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={onNewAnalysis}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'new' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Icons.UploadCloud size={20} />
          <span className="font-medium">Nova Análise</span>
        </button>

        <button
          onClick={onViewHistory}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'history' || activeView === 'report'
              ? 'bg-slate-800 text-white' 
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Icons.Clock size={20} />
          <span className="font-medium">Histórico</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 mb-4">
          <p className="font-semibold text-slate-300 mb-1">Status do Sistema</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online • Gemini 2.0 Flash / 3.0 Pro
          </div>
        </div>
        <div className="text-center border-t border-slate-800 pt-3">
           <p className="text-[10px] text-slate-500">
             Criado por <span className="text-slate-400 font-medium">Ernesto Lopes</span>
           </p>
        </div>
      </div>
    </div>
  );
};