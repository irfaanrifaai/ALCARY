"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BestSellerSection from "@/components/BestSellerSection";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Constants
const SLIDE_INTERVAL = 4000;

// HERO COMPONENTS
function HeroSection({ isVisible, currentSlide, setCurrentSlide }) {
  return (
    <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-[80vh] sm:min-h-screen pt-8 sm:pt-8 lg:pt-0 mt-0 sm:mt-0">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <HeroTextContent isVisible={isVisible} />

          {/* Hero Image Carousel */}
          <HeroImageCarousel
            isVisible={isVisible}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        </div>
      </div>
    </section>
  );
}

function HeroTextContent({ isVisible }) {
  const scrollToFeatured = () => {
    const featuredSection = document.getElementById("featured-section");
    if (featuredSection) {
      const yOffset = -10;
      const y =
        featuredSection.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      const sectionRect = aboutSection.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.pageYOffset;
      const sectionHeight = sectionRect.height;
      const windowHeight = window.innerHeight;
      // Offset agar posisi lebih ke atas (misal -120px)
      const offset = 55;
      const y = sectionTop - (windowHeight / 2) + (sectionHeight / 2) - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`transform transition-all duration-1500 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
      } text-center lg:text-left`}
    >
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="overflow-hidden">
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 bg-clip-text text-transparent leading-tight transform transition-all duration-1500 delay-300 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <span className="text-amber-600">ALYA CAKE</span>
            <br className="sm:hidden" /> AND{" "}
            <span className="text-orange-600">BAKERY</span>
          </h1>
        </div>

        <div className="overflow-hidden">
          <p
            className={`text-sm sm:text-lg lg:text-lg xl:text-xl font-medium text-gray-700 transform transition-all duration-1500 delay-500 leading-relaxed ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            Kami menyediakan berbagai macam roti dan kue
          </p>
        </div>

        <div className="overflow-hidden">
          <p
            className={`sm:text-lg lg:text-lg text-gray-600 max-w-lg leading-relaxed transform transition-all duration-1500 delay-700 mx-auto lg:mx-0 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ fontSize: "13px" }}
          >
            Dibuat dengan bahan-bahan pilihan dan resep yang telah
            disempurnakan. Setiap produk kami mencerminkan kualitas, cita rasa,
            dan cinta dalam seni membuat roti.
          </p>
        </div>

        <div
          className={`flex flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8 transform transition-all duration-1500 delay-1000 justify-center lg:justify-start ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Primary Button - Best Seller */}
          <button
            onClick={scrollToFeatured}
            className="group relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 group-hover:scale-110 inline-block transition-transform duration-200 flex items-center gap-2">
              Produk Terlaris
            </span>
          </button>

          {/* Secondary Button - Tentang Kami */}
          <button
            onClick={scrollToAbout}
            className="group relative bg-white/90 backdrop-blur-sm text-amber-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold border-2 border-amber-300 hover:border-amber-500 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
              Tentang Kami
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroImageCarousel({ isVisible, currentSlide, setCurrentSlide }) {
  // Sample hero images (can be different from best seller products)
  const heroImages = [
    {
      name: "BERBAGAI MACAM KUE DAN ROTI",
      image: "/images/roti-1.png",
    },
    {
      name: "BISA COSTUM SESUAI PERMINTAAN",
      image: "/images/roti-2.png",
    },
    {
      name: "PESAN ONLINE DENGAN MUDAH",
      image: "/images/roti-3.png",
    },
  ];

  return (
    <div
      className={`relative transform transition-all duration-1500 delay-500 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
        {heroImages.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority={index === 0}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wgg=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 text-white">
              <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                {item.name}
              </h3>
              <p className="text-sm sm:text-base opacity-90">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 right-4 sm:right-6 lg:right-8 flex gap-2 sm:gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section
      id="about-section"
      className="pt-8 pb-16 sm:py-16 lg:py-20 relative z-10 scroll-mt-16"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-amber-200/50 shadow-xl order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 sm:mb-6">
              Seni Membuat <span className="text-amber-600">Roti</span>
            </h2>

            <div className="lg:hidden mb-6">
              <div className="float-right ml-4 mb-3 w-32 h-24 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about-foto.png"
                  alt="Pembuat roti sedang bekerja"
                  width={128}
                  height={96}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wgg=="
                />
              </div>
              <p
                className="text-gray-600 mb-4 leading-relaxed"
                style={{ fontSize: "13px" }}
              >
                Alya Cake And Bakery berkomitmen untuk menghadirkan roti dan kue
                berkualitas dengan cita rasa terbaik. Dengan pengalaman lebih
                dari 5 tahun, setiap produk dibuat dengan bahan pilihan yang
                menghasilkan tekstur lembut dan bouncy.
              </p>
              <div className="clear-both"></div>
            </div>

            <div className="hidden lg:block">
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Alya Cake And Bakery berkomitmen untuk menghadirkan roti dan kue
                berkualitas dengan cita rasa terbaik. Dengan pengalaman lebih
                dari 5 tahun, setiap produk dibuat dengan bahan pilihan yang
                menghasilkan tekstur lembut dan bouncy.
              </p>
            </div>

            <p
              className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-xs sm:text-base"
              style={{ fontSize: "13px" }}
            >
              Setiap pagi, kami mulai bekerja sebelum fajar untuk memastikan
              pelanggan mendapatkan produk roti yang paling segar dan
              berkualitas. Dari roti sederhana khas kami hingga kue-kue lembut,
              setiap item dibuat dengan penuh cinta dan perhatian.
            </p>

            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-amber-200 bg-gradient-to-r from-amber-400/80 via-orange-200/80 to-amber-100/80 backdrop-blur-md">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-md border-2 border-amber-300">
                  {/* Icon Award/Medal */}
                  <svg
                    className="w-7 h-7 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      fill="#FBBF24"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 15l-2.5 5M16 15l2.5 5M12 13v7"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-amber-700 leading-tight">
                    5+ Tahun
                  </div>
                  <div className="text-xs font-medium text-gray-700 leading-snug">
                    Pengalaman membuat roti &amp; kue
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 hidden lg:block">
            <Image
              src="/images/about-foto.png"
              alt="Pembuat roti sedang bekerja"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl w-full h-64 sm:h-80 lg:h-auto object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wgg=="
            />
            <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg border border-white/30">
              <div className="text-lg sm:text-xl font-bold text-amber-600">
                5+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Tahun Pengalaman
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToActionSection() {
  return (
    <section
      id="contact-section"
      className="py-16 sm:py-20 bg-gradient-to-r from-amber-600/95 via-orange-600/95 to-red-600/95 backdrop-blur-sm relative overflow-hidden z-10"
    >
      <div className="absolute inset-0">
        <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full animate-spin"></div>
        <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-lg sm:text-3xl lg:text-4xl font-black text-white mb-4 sm:mb-6">
          Siap Merasakan Kelezatan?
        </h2>
        <p className="text-base sm:text-lg text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
          Kunjungi toko kami hari ini atau pesan online untuk pengiriman segar.
          Rasakan seni membuat roti seperti tidak pernah ada sebelumnya.
        </p>

        {/* Updated Location Button */}
        <div className="mb-8 sm:mb-10">
          <a
            href="https://maps.app.goo.gl/xkHZibJRLiqW7ycY7"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mx-auto flex items-center justify-center gap-2 bg-white text-amber-700 px-8 py-4 rounded-full font-bold shadow-xl border border-amber-300 hover:shadow-2xl hover:bg-amber-50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 text-base sm:text-base overflow-hidden w-max"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Lokasi Kami
          </a>
        </div>

        <div className="flex flex-col gap-4 justify-center items-center max-w-md mx-auto">
          {/* Updated WhatsApp Button */}
          <a
            href="https://wa.me/6282152673902"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/20 hover:bg-green-600/90 border-2 border-white/40 hover:border-green-400 backdrop-blur-md rounded-xl px-5 py-4 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 group-hover:bg-white group-hover:text-green-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg">
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-base group-hover:scale-105 transition-transform duration-300">
                  WhatsApp
                </div>
                <div className="text-white/90 text-sm">082152673902</div>
              </div>
            </div>
          </a>

          {/* Updated Instagram Button */}
          <a
            href="https://instagram.com/alyacakeandbakery"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/20 hover:bg-gradient-to-r hover:from-pink-500/90 hover:to-purple-600/90 border-2 border-white/40 hover:border-pink-400 backdrop-blur-md rounded-xl px-5 py-4 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 group-hover:bg-white group-hover:from-pink-500 group-hover:to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg">
                <svg
                  className="w-6 h-6 text-white group-hover:text-pink-600 group-hover:scale-110 transition-all duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-base group-hover:scale-105 transition-transform duration-300">
                  Instagram
                </div>
                <div className="text-white/90 text-sm">@alyacakeandbakery</div>
              </div>
            </div>
          </a>

          {/* Updated Facebook Button */}
          <a
            href="https://facebook.com/alyacakeandbakery"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/20 hover:bg-blue-600/90 border-2 border-white/40 hover:border-blue-400 backdrop-blur-md rounded-xl px-5 py-4 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 group-hover:bg-white group-hover:text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg">
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-base group-hover:scale-105 transition-transform duration-300">
                  Facebook
                </div>
                <div className="text-white/90 text-sm">
                  Alya Cake and Bakery
                </div>
              </div>
            </div>
          </a>
        </div>

        <p className="text-white/80 text-sm mt-6 font-medium">
          Ikuti kami untuk update produk terbaru
        </p>
      </div>
    </section>
  );
}

// MAIN COMPONENT - FETCH PRODUCTS FROM DATABASE
export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } else {
          setProducts(products || []);
        }
      } catch (error) {
        console.error("Error in fetchProducts:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Animation and carousel
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, SLIDE_INTERVAL);

    const handleScroll = () => {
      const featuredSection = document.getElementById("featured-section");
      if (featuredSection) {
        const sectionTop = featuredSection.offsetTop;
        const scrollY = window.scrollY || window.pageYOffset;
        setShowScrollTop(scrollY > sectionTop - 50);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#FFF3E0] to-[#FFEDD5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#FFF3E0] to-[#FFEDD5]">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10"></div>

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection
          isVisible={isVisible}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* Pass products from database to BestSellerSection */}
        <div id="featured-section">
          <BestSellerSection products={products} />
        </div>

        <AboutSection />
        <CallToActionSection />
      </div>

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="sm:hidden fixed bottom-6 right-5 z-50 bg-white/80 border border-amber-300 shadow-xl rounded-full p-3 transition hover:bg-amber-100 hover:scale-105 active:scale-95"
        >
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
