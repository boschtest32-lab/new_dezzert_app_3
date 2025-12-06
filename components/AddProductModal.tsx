
import React, { useState, useRef } from 'react';
import { X, Check, Camera, Loader2 } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';
import { MenuItem } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: MenuItem) => void;
  category: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd, category }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const base64 = await processImageFile(file);
        setImage(base64);
      } catch (err) {
        console.error(err);
        alert("Error uploading image");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct: MenuItem = {
      id: Date.now().toString(), // Simple ID generation
      name,
      description,
      price: parseFloat(price),
      category,
      image: image // Empty string or base64
    };

    onAdd(newProduct);
    
    // Reset form
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white relative z-10 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-stone-800">Add Item to {category}</h2>
          <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
            <X size={20} className="text-stone-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Preview */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 bg-stone-100 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors overflow-hidden relative"
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-stone-400">
                {isProcessing ? <Loader2 className="animate-spin mb-1" /> : <Camera className="mb-1" />}
                <span className="text-xs font-medium">Add Photo (Optional)</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹)</label>
            <input 
              required
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
          >
            <Check size={18} />
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
