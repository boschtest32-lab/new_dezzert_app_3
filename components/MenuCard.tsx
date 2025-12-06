
import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';
import ImageWithFallback from './ImageWithFallback';
import ImageUploadOverlay from './ImageUploadOverlay';
import { useMenu } from '../context/MenuContext';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  isEditing?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAdd, isEditing = false }) => {
  const { updateProductImage } = useMenu();

  return (
    <div className="flex bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mb-4 h-28 relative">
      <div className="w-28 h-28 flex-shrink-0 bg-stone-200 relative overflow-hidden group">
        <ImageWithFallback 
          src={item.image} 
          alt={item.name} 
          fallbackText="No Image"
          className="w-full h-full object-cover"
        />
        
        {isEditing && (
          <div className="absolute inset-0 z-20 bg-black/30 border-r-4 border-orange-500">
             <ImageUploadOverlay 
               onUpload={(base64) => updateProductImage(item.id, base64)} 
               label="Edit"
             />
             <div className="absolute bottom-1 left-1 right-1 text-center pointer-events-none">
                 <span className="text-[9px] bg-black/50 text-white px-1 rounded">Tap to Edit</span>
             </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-3 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-stone-800 text-sm leading-tight line-clamp-1">{item.name}</h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="font-bold text-stone-900">₹{item.price}</span>
          {!isEditing && (
            <button 
                onClick={() => onAdd(item)}
                className="bg-orange-600 text-white p-1.5 rounded-lg active:scale-95 transition-transform shadow-sm shadow-orange-200"
                aria-label="Add to cart"
            >
                <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
