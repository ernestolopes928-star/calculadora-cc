import React, { useState } from 'react';
import { Icons } from './Icons';

interface LoginScreenProps {
  onLogin: (key: string) => boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(accessKey);
    if (!success) {
      setError(true);
      setAccessKey(''); // Clear input on error
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 relative animate-fade-in">
        {/* Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-xl shadow-md p-2 mb-4 flex items-center justify-center">
             {/* Logo da insígnia removida */}
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-semibold">Governo de Angola</p>
          <h1 className="text-xl font-bold text-slate-800">ADM Municipal<br/>do C. Cuanavale</h1>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          <h2 className="text-slate-700 font-semibold mb-6 flex items-center gap-2">
            <Icons.Lock size={18} className="text-slate-400" />
            Acesso Restrito
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="access-key-input" className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">Chave de Acesso</label>
              <div className="relative">
                <Icons.Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="access-key-input"
                  type="password"
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all
                    ${error 
                      ? 'border-red-300 focus:ring-red-200 text-red-900 placeholder-red-300' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 text-slate-900'
                    }`}
                  placeholder="Insira a chave administrativa..."
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1 animate-pulse">
                  <Icons.AlertTriangle size={12} />
                  Chave de acesso incorreta.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-slate-900/20"
            >
              <span>Entrar no Sistema</span>
              <Icons.ArrowRight size={18} />
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100 space-y-1">
          <p className="text-[10px] text-slate-400">
            Este sistema é monitorado. O acesso não autorizado é proibido.
          </p>
          <p className="text-[10px] text-slate-400">
            Criado por <span className="font-semibold text-slate-500">Ernesto Lopes</span>
          </p>
        </div>
      </div>
    </div>
  );
};