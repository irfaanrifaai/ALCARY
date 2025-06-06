"use client";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

export default function BestSellerCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.selling_price || product.price,
      image: product.image_url,
      category: product.category,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50">
        <Image
          src={product.image_url || "/images/default-product.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* ✅ BEST SELLER BADGE - BERDASARKAN DATABASE */}
        {product.is_best_seller && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              ⭐ Best Seller
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description ||
            product.short_description ||
            "Produk berkualitas tinggi dengan cita rasa terbaik"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* ✅ RESPONSIVE PRICE - LEBIH KECIL DI MOBILE */}
            <span className="text-lg md:text-2xl font-bold text-amber-600 block">
              {formatPrice(product.selling_price || product.price || 0)}
            </span>
          </div>

          {/* ✅ COMPACT BUTTON */}
          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white 
                       px-2 py-1 md:px-6 md:py-3 
                       rounded-md md:rounded-lg 
                       font-medium md:font-semibold 
                       text-xs md:text-sm 
                       hover:shadow-lg transition-all duration-300 hover:scale-105 
                       flex items-center gap-1 md:gap-2 
                       active:scale-95 
                       shrink-0"
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
            Pesan
          </button>
        </div>

        {/* ✅ ADDITIONAL BEST SELLER INFO */}
        {product.is_best_seller && (
          <div className="mt-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 text-xs">🔥</span>
              <span className="text-amber-700 text-xs font-medium">
               Terlaris - Pilihan Favorit Pelanggan
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
