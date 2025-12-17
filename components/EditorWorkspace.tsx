import React, { useState, useEffect } from 'react';
import { Wand2, Download, RefreshCw, X, ArrowRight, Image as ImageIcon, Zap } from 'lucide-react';
import { Button } from './Button';
import { EditState } from '../types';
import { downloadImage } from '../utils';

interface EditorWorkspaceProps {
  editState: EditState;
  onPromptChange: (text: string) => void;
  onGenerate: () => void;
  onReset: () => void;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({ 
  editState, 
  onPromptChange, 
  onGenerate, 
  onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'result' | 'split'>('split');
  
  // Auto-switch to result when generation finishes
  useEffect(() => {
    if (editState.generatedImage) {
      if (window.innerWidth < 768) {
          setActiveTab('result');
      }
    }
  }, [editState.generatedImage]);

  const handleDownload = () => {
    if (editState.generatedImage) {
      downloadImage(editState.generatedImage, `lumina-edit-${Date.now()}.png`);
    }
  };

  const predefinedPrompts = [
    "Change the background to a cyberpunk city at night",
    "Add cinematic stage lighting and fog",
    "Turn this into a watercolor painting",
    "Make it look like a vintage 1980s photo"
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Top Controls / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <Button variant="ghost" onClick={onReset} icon={<X className="w-4 h-4"/>} className="text-gray-400 hover:text-white">
          Clear Image
        </Button>
        
        <div className="flex items-center gap-2 bg-gray-900 rounded-md p-1 border border-gray-700">
          <button 
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${activeTab === 'original' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Original
          </button>
          <button 
            onClick={() => setActiveTab('split')}
            className={`hidden md:block px-3 py-1.5 text-sm rounded transition-colors ${activeTab === 'split' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Split View
          </button>
          <button 
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${activeTab === 'result' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Result
          </button>
        </div>

        <Button 
          variant="secondary" 
          onClick={handleDownload} 
          disabled={!editState.generatedImage}
          icon={<Download className="w-4 h-4"/>}
        >
          Download
        </Button>
      </div>

      {/* Main Visual Area */}
      <div className="flex-1 min-h-[400px] relative bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
        }}></div>

        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
          
          {/* View: Original Only */}
          {activeTab === 'original' && editState.originalImage && (
             <img src={editState.originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded shadow-lg" />
          )}

          {/* View: Result Only */}
          {activeTab === 'result' && (
            editState.generatedImage ? (
              <img src={editState.generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded shadow-lg animate-in fade-in zoom-in duration-300" />
            ) : (
              <div className="text-center text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No edits generated yet</p>
              </div>
            )
          )}

          {/* View: Split (Desktop) */}
          {activeTab === 'split' && (
             <div className="flex w-full h-full gap-4 items-center justify-center">
                <div className="flex-1 h-full flex flex-col items-center justify-center relative group">
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Original</span>
                  <img src={editState.originalImage || ''} alt="Original" className="max-w-full max-h-full object-contain rounded border border-gray-700" />
                </div>
                
                <div className="text-gray-600">
                  <ArrowRight className="w-6 h-6" />
                </div>

                <div className="flex-1 h-full flex flex-col items-center justify-center relative bg-gray-900/30 rounded border border-gray-800 border-dashed">
                  <span className="absolute top-2 left-2 bg-indigo-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md z-20">Gemini Edit</span>
                   {editState.generatedImage ? (
                      <img src={editState.generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded" />
                   ) : (
                     <div className="text-center p-6">
                        {editState.isGenerating ? (
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-indigo-400 animate-pulse">Designing...</p>
                           </div>
                        ) : (
                           <div className="text-gray-500 flex flex-col items-center">
                              <Zap className="w-8 h-8 mb-2 opacity-20" />
                              <p className="text-sm">Ready to generate</p>
                           </div>
                        )}
                     </div>
                   )}
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Prompt Input Section - Sticky Bottom Area */}
      <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-xl">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          How should Gemini change this image?
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
             <input
                type="text"
                value={editState.prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="e.g., 'Make it look like a sketch', 'Add fireworks in the sky'..."
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                onKeyDown={(e) => e.key === 'Enter' && !editState.isGenerating && editState.prompt && onGenerate()}
             />
             <div className="absolute right-2 top-2 hidden md:flex gap-1">
                {/* Quick Prompts */}
             </div>
          </div>
          <Button 
            onClick={onGenerate} 
            disabled={!editState.prompt.trim() || editState.isGenerating}
            isLoading={editState.isGenerating}
            className="md:w-32 py-3"
            icon={<Wand2 className="w-4 h-4" />}
          >
            Generate
          </Button>
        </div>

        {/* Example Chips */}
        <div className="mt-3 flex flex-wrap gap-2">
           <span className="text-xs text-gray-500 py-1">Try:</span>
           {predefinedPrompts.map((p, idx) => (
             <button 
               key={idx}
               onClick={() => onPromptChange(p)}
               className="text-xs bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-gray-700 px-2 py-1 rounded-full transition-colors"
             >
               {p}
             </button>
           ))}
           <button
             onClick={() => onPromptChange("смени ми фона с по тъмен и сцена с остветление")}
             className="text-xs bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-gray-700 px-2 py-1 rounded-full transition-colors italic"
           >
             (Bg Example) смени фона...
           </button>
        </div>
        
        {editState.error && (
          <div className="mt-3 p-3 bg-red-900/30 border border-red-800 rounded text-red-200 text-sm flex items-center gap-2">
             <span className="block w-1.5 h-1.5 rounded-full bg-red-500"></span>
             {editState.error}
          </div>
        )}
      </div>
    </div>
  );
};