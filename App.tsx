import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { ImageUpload } from './components/ImageUpload';
import { EditorWorkspace } from './components/EditorWorkspace';
import { editImageWithGemini } from './services/geminiService';
import { EditState } from './types';

const App: React.FC = () => {
  const [editState, setEditState] = useState<EditState>({
    originalImage: null,
    generatedImage: null,
    prompt: '',
    isGenerating: false,
    error: null,
  });

  const handleImageSelected = (base64: string) => {
    setEditState(prev => ({
      ...prev,
      originalImage: base64,
      generatedImage: null,
      error: null
    }));
  };

  const handlePromptChange = (text: string) => {
    setEditState(prev => ({ ...prev, prompt: text }));
  };

  const handleReset = () => {
    setEditState({
      originalImage: null,
      generatedImage: null,
      prompt: '',
      isGenerating: false,
      error: null,
    });
  };

  const handleGenerate = async () => {
    if (!editState.originalImage || !editState.prompt) return;

    setEditState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const resultImage = await editImageWithGemini(editState.originalImage, editState.prompt);
      
      setEditState(prev => ({
        ...prev,
        generatedImage: resultImage,
        isGenerating: false,
      }));
    } catch (err) {
      setEditState(prev => ({
        ...prev,
        isGenerating: false,
        error: err instanceof Error ? err.message : 'Something went wrong while generating the image.',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans selection:bg-indigo-500/30">
      <AppHeader />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!editState.originalImage ? (
          <div className="max-w-3xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Transform your images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Natural Language</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Upload a photo and describe how you want to change it. Powered by Google's Gemini 2.5 Flash Image model.
              </p>
            </div>
            
            <ImageUpload onImageSelected={handleImageSelected} />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { title: 'Upload', desc: 'Drag & drop any image' },
                { title: 'Describe', desc: 'Tell Gemini what to change' },
                { title: 'Download', desc: 'Get your edited masterpiece' }
              ].map((step, i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center mx-auto mb-3 font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-gray-200 font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-140px)] animate-in fade-in duration-500">
             <EditorWorkspace 
                editState={editState}
                onPromptChange={handlePromptChange}
                onGenerate={handleGenerate}
                onReset={handleReset}
             />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;