"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/contexts/CartContext";

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart, getItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  const quantity = getItemQuantity(product?.id);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      for (let i = 0; i < selectedQuantity; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        addToCart(product);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (!isOpen || !product) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Detail Produk</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🧁</div>
                      <span className="text-3xl text-amber-600 font-bold">
                        {product.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestSeller && (
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.602-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Best Seller
                  </div>
                )}
                
                {discountPercentage > 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
                <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 ${
                          index < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.602-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">({product.reviewCount || 0} ulasan)</span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-amber-600">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-sm text-green-600 font-semibold">
                    Hemat {formatCurrency(product.originalPrice - product.price)} ({discountPercentage}%)
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <div>
                    <span className="text-sm text-gray-500">Berat</span>
                    <p className="font-semibold">{product.weight}</p>
                  </div>
                )}
                
                {product.shelfLife && (
                  <div>
                    <span className="text-sm text-gray-500">Masa Simpan</span>
                    <p className="font-semibold">{product.shelfLife}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-gray-500">Stok</span>
                  <p className={`font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                    {product.stock === 0 ? 'Habis' : `${product.stock} tersisa`}
                  </p>
                </div>
              </div>

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bahan-bahan</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Alergen</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen, index) => (
                      <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {product.stock > 0 && (
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Jumlah:</label>
                    <select
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {[...Array(Math.min(10, product.stock))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-xl hover:scale-105 disabled:opacity-50'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menambahkan...</span>
                    </>
                  ) : product.stock === 0 ? (
                    <span>Stok Habis</span>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l.01.01M12 21a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      <span>
                        {quantity > 0 ? `Pesan Sekarang (${quantity} sudah ada)` : 'Pesan Sekarang'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}