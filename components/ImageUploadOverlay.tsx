
import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

interface ImageUploadOverlayProps {
  onUpload: (base64: string) => void;
  label?: string;
}

const ImageUploadOverlay: React.FC<ImageUploadOverlayProps> = ({ onUpload, label = "Change Image" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const base64 = await processImageFile(file);
        onUpload(base64);
      } catch (error) {
        alert("Failed to process image. Please try a smaller file.");
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        fileInputRef.current?.click();
      }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {isProcessing ? (
        <Loader2 className="text-white animate-spin mb-2" size={32} />
      ) : (
        <Camera className="text-white mb-2 drop-shadow-md" size={32} />
      )}
      <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-md">{isProcessing ? "Processing..." : label}</span>
    </div>
  );
};

export default ImageUploadOverlay;
