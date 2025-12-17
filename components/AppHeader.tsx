import React from 'react';
import { Sparkles } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <header className="w-full py-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Lumina Edit
            </h1>
            <p className="text-xs text-indigo-400 font-medium tracking-wide">POWERED BY GEMINI 2.5</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-gray-400">Nano Banana Model</span>
            <div className="h-4 w-px bg-gray-700"></div>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a>
        </div>
      </div>
    </header>
  );
};