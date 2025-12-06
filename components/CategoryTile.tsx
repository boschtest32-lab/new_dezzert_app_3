
import React from 'react';
import ImageWithFallback from './ImageWithFallback';
import ImageUploadOverlay from './ImageUploadOverlay';
import { useMenu } from '../context/MenuContext';
import { MENU_ITEMS } from '../constants';

interface CategoryTileProps {
  category: string;
  onClick: () => void;
  isEditing: boolean;
}

const CategoryTile: React.FC<CategoryTileProps> = ({ category, onClick, isEditing }) => {
  const { categoryImages, updateCategoryImage, items } = useMenu();

  // Determine image source: Explicit override -> First item in category -> Fallback
  const getDisplayImage = () => {
    if (categoryImages[category]) return categoryImages[category];
    
    // Fallback to the first item's image in this category
    const item = items.find(i => i.category === category);
    // If that item has a custom image (base64) use it, otherwise use the constant path
    if (item && item.image.startsWith('data:')) return item.image;
    
    // Fallback to original constant lookup if no state override
    const originalItem = MENU_ITEMS.find(i => i.category === category);
    return originalItem?.image || '';
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-md h-40 bg-stone-200">
      <button
        onClick={onClick}
        className="w-full h-full text-left"
        disabled={isEditing} // Disable navigation when editing to prevent accidental clicks
      >
        <ImageWithFallback 
          src={getDisplayImage()}
          alt={category}
          fallbackText={category}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="block text-white font-bold text-lg leading-tight drop-shadow-md">
            {category}
          </span>
          {!isEditing && (
            <span className="text-[10px] text-stone-300 font-medium uppercase tracking-wider mt-1 block opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              View Items
            </span>
          )}
        </div>
      </button>

      {/* Edit Overlay */}
      {isEditing && (
        <div className="absolute inset-0 z-20 pointer-events-auto">
             {/* Force visibility of overlay in edit mode, using a wrapper to reuse component styles */}
             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center border-4 border-orange-500 rounded-2xl">
                 <ImageUploadOverlay 
                    onUpload={(base64) => updateCategoryImage(category, base64)} 
                    label="Edit Category Image"
                 />
                 {/* Re-render camera to be always visible in edit mode without hover */}
                 <div className="pointer-events-none flex flex-col items-center mt-2">
                    <span className="text-white text-[10px] bg-orange-600 px-2 py-0.5 rounded-full">Tap to Change</span>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTile;
