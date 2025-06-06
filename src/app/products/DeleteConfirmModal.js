"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const formatCurrency = (amount) => {
  // ✅ VALIDASI UNTUK HAPUS NaN
  const price = Number(amount);
  
  if (!price || isNaN(price) || price <= 0) {
    return ""; // Return kosong jika tidak valid
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, product }) {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk!');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !product) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Hapus Produk
          </h3>
          
          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
          </p>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Placeholder jika tidak ada gambar */}
              <div 
                className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center"
                style={{ display: product.image_url ? 'none' : 'flex' }}
              >
                <span className="text-2xl">🧁</span>
              </div>
              
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.category}</p>
                {/* ✅ HAPUS HARGA JIKA NaN, GUNAKAN SELLING_PRICE */}
                {formatCurrency(product.selling_price) && (
                  <p className="text-sm font-medium text-amber-600">
                    {formatCurrency(product.selling_price)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Footer - TOMBOL HAPUS DI KANAN */}
        <div className="p-6 pt-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}