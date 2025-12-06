import React from 'react';
import { X, Share2, Download } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Generate QR Code for the current page URL
  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white relative z-10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
        >
          <X size={20} className="text-stone-600" />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-stone-800 mb-2">Scan for Menu</h2>
          <p className="text-stone-500 text-sm mb-6">Scan this code to view our menu and order instantly.</p>
          
          <div className="bg-stone-50 p-4 rounded-xl inline-block border border-stone-200 shadow-inner mb-6">
            <img 
              src={qrCodeUrl} 
              alt="Menu QR Code" 
              className="w-48 h-48 mix-blend-multiply" 
            />
          </div>

          <div className="flex gap-3 justify-center">
             <p className="text-xs text-stone-400 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
               {window.location.host}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;