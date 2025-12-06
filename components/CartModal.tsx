import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, MessageCircle, Sparkles, Receipt, Phone } from 'lucide-react';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { getChefNote } from '../services/geminiService';

interface CartModalProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({ items, isOpen, onClose, onUpdateQuantity }) => {
  const [chefNote, setChefNote] = useState<string>("");
  const [loadingNote, setLoadingNote] = useState(false);
  const [customerMobile, setCustomerMobile] = useState("");
  const [error, setError] = useState("");

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      setLoadingNote(true);
      getChefNote(items).then(note => {
        setChefNote(note);
        setLoadingNote(false);
      });
    }
  }, [isOpen, items.length]);

  const handleCheckout = () => {
    // Validate Mobile Number
    if (!customerMobile || customerMobile.length !== 10 || !/^\d+$/.test(customerMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");

    // Generate bill text
    let message = `*New Order from Cafe App*\n`;
    message += `Customer Mobile: ${customerMobile}\n\n`;
    message += `*Order Details:*\n`;
    items.forEach(item => {
      message += `• ${item.quantity} x ${item.name} (₹${item.price * item.quantity})\n`;
    });
    message += `\n*Total Bill: ₹${total}*\n\n`;
    message += `Please confirm this order.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="text-orange-600" size={20} />
            <h2 className="text-lg font-bold text-stone-800">Your Bill</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
          {items.length === 0 ? (
            <div className="text-center text-stone-400 py-10">
              <p>Your cart is empty.</p>
              <p className="text-sm mt-2">Add some yummy treats!</p>
            </div>
          ) : (
            <div className="space-y-4">
               {/* AI Chef Note */}
               {loadingNote ? (
                 <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded-lg animate-pulse">
                   <Sparkles size={14} />
                   <span>Chef is looking at your order...</span>
                 </div>
               ) : chefNote && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100 mb-4 flex gap-3 items-start">
                  <div className="bg-white p-1.5 rounded-full shadow-sm mt-0.5">
                    <Sparkles size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-0.5">Chef says</p>
                    <p className="text-sm text-stone-700 italic">"{chefNote}"</p>
                  </div>
                </div>
               )}

              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800">{item.name}</h4>
                    <p className="text-xs text-stone-500">₹{item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-stone-100 rounded-lg p-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-stone-600 active:scale-95"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold w-4 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-stone-600 active:scale-95"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-100 bg-white sm:rounded-b-2xl pb-8 sm:pb-5 flex-shrink-0">
            {/* Customer Details Input */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Your Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-stone-400" />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={customerMobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Only allow numbers
                    setCustomerMobile(val);
                    if (error) setError("");
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${error ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-stone-200 focus:ring-orange-200 focus:border-orange-500'} focus:ring-4 outline-none transition-all text-stone-800 font-medium`}
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-500">Total Amount</span>
              <span className="text-2xl font-bold text-stone-900">₹{total}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale"
            >
              <MessageCircle size={20} />
              Place Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;