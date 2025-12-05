import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onImageUpload: (base64: string) => void;
  onRemove: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageUpload, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onImageUpload(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      
      {image ? (
        <div className="relative group w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
          <img src={image} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onRemove}
              className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full transition-colors"
              title="Supprimer l'image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'}
          `}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
             <Upload className="text-gray-400" size={24} />
          </div>
          <p className="text-sm text-gray-600 font-medium">Cliquez ou déposez une image</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
        </div>
      )}
    </div>
  );
};