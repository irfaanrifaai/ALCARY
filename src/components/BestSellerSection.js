"use client";
import BestSellerCard from "./BestSellerCard";
import { useEffect, useState, useRef } from "react";

export default function BestSellerSection({ products = [] }) {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  // ✅ TAMBAHAN UNTUK CAROUSEL
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    console.log("🔍 Products received in BestSellerSection:", products);

    if (products.length > 0) {
      let bestSellers = [];

      if (products.length <= 6) {
        bestSellers = [...products];
        console.log("📦 Showing all products (≤ 6):", bestSellers.length);
      } else {
        const sortedProducts = [...products].sort((a, b) => {
          const salesA = a.sales_count || 0;
          const salesB = b.sales_count || 0;

          if (salesB !== salesA) {
            return salesB - salesA;
          }

          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;

          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }

          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB - dateA;
        });

        bestSellers = sortedProducts.slice(0, 6);
        console.log(
          "📦 Sorted by sales_count, showing top 6:",
          bestSellers.length
        );
      }

      setBestSellerProducts(bestSellers);
    } else {
      setBestSellerProducts([]);
    }
  }, [products]);

  // ✅ AUTO-PLAY CAROUSEL
  useEffect(() => {
    if (!isAutoPlaying || bestSellerProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bestSellerProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, bestSellerProducts.length]);

  // ✅ CAROUSEL FUNCTIONS
  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bestSellerProducts.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + bestSellerProducts.length) % bestSellerProducts.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Handler untuk mulai sentuh
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handler saat sentuh bergerak
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handler saat sentuh selesai
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // px

    if (distance > minSwipeDistance) {
      // Geser ke kiri (next)
      setCurrentIndex((prev) => (prev + 1) % bestSellerProducts.length);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    } else if (distance < -minSwipeDistance) {
      // Geser ke kanan (prev)
      setCurrentIndex(
        (prev) =>
          (prev - 1 + bestSellerProducts.length) % bestSellerProducts.length
      );
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produk Terlaris
            </h2>
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      </section>
    );
  }

  if (bestSellerProducts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produk Terlaris
            </h2>
            <p className="text-gray-600">Belum ada produk tersedia.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Produk <span className="text-amber-600">Terlaris</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {products.length <= 6
              ? ""
              : "Pilihan favorit pelanggan berdasarkan jumlah pembelian terbanyak"}
          </p>
        </div>

        {/* ✅ MOBILE CAROUSEL */}
        <div className="block lg:hidden">
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {bestSellerProducts.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0 px-4">
                  <BestSellerCard product={product} />
                </div>
              ))}
            </div>

            {/* ✅ DOT INDICATORS - MOBILE */}
            {bestSellerProducts.length > 1 && (
              <div
                className="flex justify-center items-center mt-4 mb-0 space-x-2 pointer-events-auto"
                style={{ minHeight: 16 }}
              >
                {bestSellerProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full outline-none border-none transition-all duration-300 focus:ring-2 focus:ring-amber-400 ${
                      index === currentIndex
                        ? "bg-amber-500 scale-110 shadow"
                        : "bg-gray-300 hover:bg-amber-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    style={{
                      boxShadow:
                        index === currentIndex ? "0 0 0 2px #fff" : undefined,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ DESKTOP GRID - HAPUS isTopSeller */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellerProducts.map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>

        {/* Sales Count Info */}
        {products.length > 6 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Menampilkan 6 produk terlaris berdasarkan jumlah pesanan
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ✨ Semua produk dibuat fresh setelah pemesanan
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="group relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base overflow-hidden inline-flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-3">
              Lihat Semua Produk ({products.length})
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
