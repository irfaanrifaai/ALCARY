"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

// ✅ PERBAIKI FUNGSI FORMAT CURRENCY - HAPUS NaN
const formatCurrency = (amount) => {
  // Konversi ke number dan validasi
  const price = Number(amount);

  // Jika tidak valid atau 0, jangan tampilkan
  if (!price || isNaN(price) || price <= 0) {
    return ""; // Return kosong, bukan "Rp 0"
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductCard({
  product,
  isTopSeller = false,
  showBadges = true,
  onEdit,
  onDelete,
  showAdminControls = false,
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToCart } = useCart();

  // ✅ PERBAIKI FUNCTION ADD TO CART
  const handleAddToCart = () => {
    const price = Number(product.selling_price);

    // Jika harga tidak valid, jangan izinkan add to cart
    if (!price || isNaN(price) || price <= 0) {
      alert("Harga produk tidak valid");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image_url,
      category: product.category,
    });

    // Feedback visual
    const button = document.getElementById(`add-to-cart-${product.id}`);
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML =
        '<svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 1500);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
      {/* Badges */}
      {/* ✅ PERBAIKI BADGES - SPACING & SIZE */}
      {showBadges && (
        <>
          {/* Best Seller Badge - KIRI */}
          {product.is_best_seller && (
            <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
              ⭐ Best Seller
            </div>
          )}

          {/* Top Seller Badge - BAWAH BEST SELLER (jika ada) */}
          {isTopSeller && (
            <div
              className={`absolute left-2 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md ${
                product.is_best_seller ? "top-8" : "top-2"
              }`}
            >
              🏆 #1 Terlaris
            </div>
          )}

          {/* Sales Count Badge - BAWAH KATEGORI (jika ada) */}
          {product.sales_count > 0 && (
            <div className="absolute top-8 right-2 z-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
              {product.sales_count} terjual
            </div>
          )}
        </>
      )}

      {/* Product Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-all duration-300 ${
            !isImageLoaded ? "animate-pulse bg-gray-200" : ""
          }`}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <span className="text-6xl">🧁</span>
            </div>
          )}
        </div>
        {/* Pindahkan tombol admin ke sini */}
        {showAdminControls && (
          <div className="absolute bottom-2 right-2 z-30 flex gap-1">
            <button
              onClick={() => onEdit && onEdit(product)}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
              title="Edit Produk"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete && onDelete(product)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
              title="Hapus Produk"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-6">
        {/* Product Name */}
        <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {(product.short_description || product.description) && (
          <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">
            {product.short_description || product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2 md:mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.review_count || 0})
            </span>
          </div>
        )}

        {/* ✅ PRICE - SEMBUNYIKAN JIKA TIDAK VALID */}
        {formatCurrency(product.selling_price) && (
          <div className="mb-3 md:mb-6">
            <p className="text-base md:text-2xl font-bold text-amber-600">
              {formatCurrency(product.selling_price)}
            </p>
          </div>
        )}

        {/* Button */}
        {showAdminControls ? null : (
          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base"
          >
            <svg
              className="w-3 h-3 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
              />
            </svg>
            <span className="hidden md:inline">Pesan Sekarang</span>
            <span className="md:hidden">Pesan</span>
          </button>
        )}

        {/* Footer Text */}
        {!showAdminControls && (
          <div className="mt-2 md:mt-3 text-center">
            <p className="text-xs text-gray-500 hidden md:block">
              ✨ Dibuat fresh setelah pemesanan
            </p>
            {product.sales_count > 0 && (
              <p className="text-xs text-amber-600 font-medium mt-1">
                {product.sales_count} terjual
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
