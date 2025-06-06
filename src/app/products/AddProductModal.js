"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Tambah formatCurrency function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AddProductModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    costPrice: "",
    sellingPrice: "",
    category: "",
    image: null,
    imagePreview: "",
    isBestSeller: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        shortDescription: "",
        costPrice: "",
        sellingPrice: "",
        category: "",
        image: null,
        imagePreview: "",
        isBestSeller: false,
      });
      setErrors({});
    }
  }, [isOpen]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "File harus berupa gambar",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Ukuran file maksimal 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama produk wajib diisi";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Deskripsi wajib diisi";
    }

    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = "Harga beli harus lebih dari 0";
    }

    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = "Harga jual harus lebih dari 0";
    }

    if (formData.costPrice && formData.sellingPrice) {
      const cost = parseFloat(formData.costPrice);
      const selling = parseFloat(formData.sellingPrice);
      if (selling <= cost) {
        newErrors.sellingPrice = "Harga jual harus lebih tinggi dari harga beli";
      }
    }

    if (!formData.category) {
      newErrors.category = "Kategori wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.shortDescription,
        shortDescription: formData.shortDescription,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        category: formData.category,
        image: formData.image,
        isBestSeller: formData.isBestSeller,
      };

      await onAdd(productData);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Gagal menambahkan produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Tambah Produk</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form - Compact spacing */}
        <form onSubmit={handleSubmit} className="p-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-3">
            {/* Nama Produk */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Produk *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                placeholder="Masukkan nama produk"
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value="">Pilih kategori</option>
                <option value="roti">Roti</option>
                <option value="kue">Kue</option>
                <option value="pastry">Custom</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi *</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent h-16 resize-none"
                placeholder="Deskripsi produk"
                required
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
            </div>

            {/* Foto Produk - Fix clickable area */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Foto Produk</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-amber-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 text-xs text-gray-600">
                      <span className="text-amber-600 font-medium">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG hingga 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

            {/* Price Section - Compact */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Harga Beli (Rp) *</label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                  placeholder="15000"
                  min="0"
                  step="1000"
                  required
                />
                {errors.costPrice && <p className="text-red-500 text-xs mt-1">{errors.costPrice}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Harga Jual (Rp) *</label>
                <input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sellingPrice: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                  placeholder="25000"
                  min="0"
                  step="1000"
                  required
                />
                {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
              </div>
            </div>

            {/* Profit Margin - Compact */}
            {formData.costPrice && formData.sellingPrice && parseFloat(formData.sellingPrice) > parseFloat(formData.costPrice) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-700 font-medium">Margin:</span>
                  <div className="text-right">
                    <div className="text-green-800 font-bold text-sm">
                      {formatCurrency(parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice))}
                    </div>
                    <div className="text-green-600 text-xs">
                      {(((parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)) / parseFloat(formData.costPrice)) * 100).toFixed(1)}% profit
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Best Seller - Compact */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked }))}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-medium text-gray-700">Tandai sebagai Best Seller</span>
                  <p className="text-xs text-gray-500">Akan ditampilkan di Best Seller section</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer - Compact */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menambahkan...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Produk</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
