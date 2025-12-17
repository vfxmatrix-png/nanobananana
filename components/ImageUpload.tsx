import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../utils';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      onImageSelected(base64);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        onImageSelected(base64);
      }
    }
  };

  return (
    <div 
      className={`relative w-full h-96 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden group
        ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${isDragging ? 'bg-indigo-500/20 scale-110' : 'bg-gray-700 group-hover:scale-110'}`}>
          <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-400' : 'text-gray-400'}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Upload an image to start</h3>
        <p className="text-gray-400 max-w-sm">
          Drag and drop your photo here, or click to browse. 
          <br /><span className="text-xs text-gray-500 mt-2 block">Supports JPG, PNG, WEBP</span>
        </p>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
};