
import React, { useState, useMemo } from 'react';
import { ShoppingBag, QrCode, Coffee, ArrowLeft, Lock, Unlock, RotateCcw, Plus, UserCog, Info } from 'lucide-react';
import { MenuItem, CartItem } from './types';
import MenuCard from './components/MenuCard';
import CartModal from './components/CartModal';
import QRCodeModal from './components/QRCodeModal';
import CategoryTile from './components/CategoryTile';
import AddCategoryModal from './components/AddCategoryModal';
import AddProductModal from './components/AddProductModal';
import { useMenu } from './context/MenuContext';

export default function App() {
  const { items, categories, addCategory, addProduct, resetToDefaults } = useMenu();
  
  const [view, setView] = useState<'categories' | 'products'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  
  // Admin State
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Modal states
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddProdOpen, setIsAddProdOpen] = useState(false);

  // Initialize selectedCategory if empty but categories exist
  React.useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === selectedCategory);
  }, [selectedCategory, items]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#ef87b0] flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white sticky top-0 z-30 shadow-sm border-b border-stone-100 transition-all duration-300">
        <div className="max-w-md mx-auto px-4 py-6 flex justify-between items-center">
          {view === 'products' ? (
             <button 
               onClick={() => setView('categories')}
               className="flex items-center gap-3 text-stone-800 hover:text-orange-600 transition-colors"
             >
               <div className="p-2 rounded-full bg-stone-100 group-hover:bg-orange-100">
                 <ArrowLeft size={24} className="text-stone-600 group-hover:text-orange-600"/>
               </div>
               <span className="font-bold text-2xl leading-none truncate max-w-[180px] sm:max-w-[250px]">{selectedCategory}</span>
             </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-orange-200 shadow-lg">
                <Coffee size={24} fill="currentColor" />
              </div>
              <div>
                <h1 className="font-bold text-[#00008B] text-3xl leading-none mb-1">dezzerto</h1>
                <p className="text-xs text-stone-500 font-medium tracking-wide">the sweet side of life</p>
              </div>
            </div>
          )}
          
          {/* Admin Controls - Hidden by default for customers */}
          {showAdminControls && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right duration-300">
              <button 
                onClick={() => setIsQROpen(true)}
                className="p-3 bg-stone-100 rounded-full text-stone-600 hover:bg-stone-200 transition-colors"
                aria-label="Show QR Code"
              >
                <QrCode size={24} />
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-full transition-colors ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}
                aria-label="Toggle Edit Mode"
              >
                {isEditing ? <Unlock size={24} /> : <Lock size={24} />}
              </button>
            </div>
          )}
        </div>
        
        {/* Admin Bar */}
        {isEditing && showAdminControls && (
          <div className="bg-orange-600 text-white text-xs px-4 py-3 flex flex-col gap-2 animate-in slide-in-from-top duration-200">
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase tracking-wide flex items-center gap-1">
                <Unlock size={12} /> Edit Mode Active
              </span>
              <button onClick={resetToDefaults} className="flex items-center gap-1 bg-orange-700 px-2 py-1 rounded hover:bg-orange-800 transition-colors">
                <RotateCcw size={12} /> Reset to Default
              </button>
            </div>
            <div className="flex items-start gap-1.5 text-orange-100 bg-orange-700/50 p-2 rounded">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <p className="leading-tight">Changes are saved to <strong>this device only</strong>. They will not be visible to customers on their own phones unless you update the code.</p>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-6 flex-grow w-full pb-32">
        {view === 'categories' ? (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {categories.map((cat) => (
                    <CategoryTile 
                      key={cat}
                      category={cat}
                      onClick={() => {
                          setSelectedCategory(cat);
                          setView('products');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      isEditing={isEditing}
                    />
                ))}
                
                {/* Add Category Button */}
                {isEditing && (
                  <button 
                    onClick={() => setIsAddCatOpen(true)}
                    className="h-40 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:bg-stone-50 hover:border-orange-300 hover:text-orange-500 transition-all bg-white/90"
                  >
                    <div className="p-3 bg-stone-100 rounded-full mb-2 group-hover:bg-orange-50">
                      <Plus size={24} />
                    </div>
                    <span className="font-medium text-sm">Add Category</span>
                  </button>
                )}
            </div>
        ) : (
            <div className="grid gap-4 animate-in fade-in slide-in-from-right-8 duration-300">
                {/* Add Product Button (Top of list) */}
                {isEditing && (
                  <button 
                    onClick={() => setIsAddProdOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center gap-2 text-stone-500 hover:border-orange-300 hover:text-orange-600 hover:bg-white transition-all mb-2 bg-white/80"
                  >
                    <Plus size={20} />
                    <span className="font-medium">Add New Product to {selectedCategory}</span>
                  </button>
                )}

                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <MenuCard 
                          key={item.id} 
                          item={item} 
                          onAdd={addToCart} 
                          isEditing={isEditing}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-white flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Coffee size={24} className="text-white" />
                        </div>
                        <p className="font-medium">No items yet.</p>
                        {!isEditing && (
                          <button onClick={() => setView('categories')} className="text-white underline font-medium text-sm hover:opacity-80">
                              Browse other categories
                          </button>
                        )}
                    </div>
                )}
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full p-6 text-center text-[#00008B]/40 text-xs">
        <p className="mb-2">© 2025 dezzerto. All rights reserved.</p>
        <button 
          onClick={() => setShowAdminControls(!showAdminControls)}
          className="flex items-center gap-1 mx-auto hover:text-[#00008B] transition-colors opacity-60 hover:opacity-100"
        >
          <UserCog size={12} />
          <span>{showAdminControls ? "Hide Owner Tools" : "Owner Access"}</span>
        </button>
      </footer>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && !isEditing && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto bg-stone-900 text-white w-full max-w-md shadow-2xl shadow-stone-400/50 rounded-2xl p-4 flex justify-between items-center group active:scale-[0.98] transition-all border border-stone-800"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                 <div className="bg-orange-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
                    {cartItemCount}
                 </div>
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-stone-900"></div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-stone-400 font-medium uppercase tracking-wide">Total</span>
                <span className="font-bold text-xl leading-none">₹{cartTotal}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-semibold text-orange-50 bg-stone-800 px-4 py-2 rounded-xl group-hover:bg-stone-700 transition-colors">
              View Order <ShoppingBag size={18} />
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
      />
      
      <QRCodeModal 
        isOpen={isQROpen} 
        onClose={() => setIsQROpen(false)} 
      />

      <AddCategoryModal 
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
        onAdd={addCategory}
      />

      <AddProductModal 
        isOpen={isAddProdOpen}
        onClose={() => setIsAddProdOpen(false)}
        onAdd={addProduct}
        category={selectedCategory}
      />
    </div>
  );
}
