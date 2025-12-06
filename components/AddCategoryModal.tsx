
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    onAdd(name.trim());
    setName("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white relative z-10 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-stone-800">Add Category</h2>
          <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
            <X size={20} className="text-stone-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">Category Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Burgers, Pastas"
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
          >
            <Check size={18} />
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
