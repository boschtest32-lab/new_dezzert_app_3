
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS, CATEGORIES as DEFAULT_CATEGORIES } from '../constants';

interface MenuContextType {
  items: MenuItem[];
  categories: string[];
  categoryImages: Record<string, string>;
  updateProductImage: (id: string, base64Image: string) => void;
  updateCategoryImage: (category: string, base64Image: string) => void;
  addProduct: (product: MenuItem) => void;
  addCategory: (categoryName: string) => void;
  resetToDefaults: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('cafe_menu_items');
      const storedCategories = localStorage.getItem('cafe_categories');
      const storedCatImages = localStorage.getItem('cafe_category_images');
      
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
      if (storedCatImages) {
        setCategoryImages(JSON.parse(storedCatImages));
      }
    } catch (e) {
      console.error("Failed to load menu data", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cafe_menu_items', JSON.stringify(items));
      localStorage.setItem('cafe_categories', JSON.stringify(categories));
      localStorage.setItem('cafe_category_images', JSON.stringify(categoryImages));
    }
  }, [items, categories, categoryImages, isLoaded]);

  const updateProductImage = (id: string, base64Image: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, image: base64Image } : item
    ));
  };

  const updateCategoryImage = (category: string, base64Image: string) => {
    setCategoryImages(prev => ({
      ...prev,
      [category]: base64Image
    }));
  };

  const addProduct = (product: MenuItem) => {
    setItems(prev => [...prev, product]);
  };

  const addCategory = (categoryName: string) => {
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset all images, products and categories to default? This cannot be undone.")) {
      setItems(MENU_ITEMS);
      setCategories(DEFAULT_CATEGORIES);
      setCategoryImages({});
      localStorage.removeItem('cafe_menu_items');
      localStorage.removeItem('cafe_categories');
      localStorage.removeItem('cafe_category_images');
      window.location.reload();
    }
  };

  return (
    <MenuContext.Provider value={{ 
      items, 
      categories, 
      categoryImages, 
      updateProductImage, 
      updateCategoryImage, 
      addProduct,
      addCategory,
      resetToDefaults 
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
