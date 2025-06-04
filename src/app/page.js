"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

// Constants
const SLIDE_INTERVAL = 4000;

const FEATURED_PRODUCTS = [
  {
    name: "Bolu Tape",
    description: "Bolu tape manis dengan tekstur lembut",
    price: "Rp 27.000",
    image: "/images/roti-1.png",
  },
  {
    name: "Cake Tiramisu",
    description: "Bolu coklat dengan topping tiramisu",
    price: "Rp 35.000",
    image: "/images/roti-2.png",
  },
  {
    name: "Bolu Marmer",
    description: "Bolu dengan corak coklat lezat",
    price: "Rp 35.000",
    image: "/images/roti-3.png",
  },
];

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

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      const yOffset = -30;
      const y =
        aboutSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
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
          <button
            onClick={scrollToFeatured}
            className="group bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base w-fit"
          >
            <span className="group-hover:scale-110 inline-block transition-transform duration-200">
              Best Seller
            </span>
          </button>
          <button
            onClick={scrollToAbout}
            className="border-2 border-amber-600 text-amber-700 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-300 bg-white/20 backdrop-blur-sm text-sm sm:text-base w-fit"
          >
            Tentang Kami
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroImageCarousel({ isVisible, currentSlide, setCurrentSlide }) {
  return (
    <div
      className={`relative transform transition-all duration-1500 delay-500 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
        {FEATURED_PRODUCTS.map((product, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority={index === 0}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wgg=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 text-white">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                {product.name}
              </h3>
              <p className="text-sm sm:text-base opacity-90">
                {product.description}
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 right-4 sm:right-6 lg:right-8 flex gap-2 sm:gap-3">
          {FEATURED_PRODUCTS.map((_, index) => (
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

// OTHER COMPONENTS
function FeaturedProductsSection() {
  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentProductSlide < FEATURED_PRODUCTS.length - 1) {
      setCurrentProductSlide(currentProductSlide + 1);
    }
    if (isRightSwipe && currentProductSlide > 0) {
      setCurrentProductSlide(currentProductSlide - 1);
    }
  };

  return (
    <section
      id="featured-section"
      className="py-16 sm:py-20 lg:py-24 relative z-10 scroll-mt-12"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 sm:mb-6">
            Best Seller
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
        </div>

        {/* Mobile: Slide */}
        <div className="lg:hidden mb-8">
          <div
            className="relative overflow-hidden cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentProductSlide * 100}%)`,
              }}
            >
              {FEATURED_PRODUCTS.map((product, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <ProductCard
                    product={product}
                    index={index}
                    isMobile={true}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6 mb-4">
            {FEATURED_PRODUCTS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProductSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentProductSlide
                    ? "bg-amber-500 scale-125"
                    : "bg-amber-300 opacity-50 hover:opacity-75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 justify-items-center mb-12 items-stretch">
          {FEATURED_PRODUCTS.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              index={index}
              isMobile={false}
            />
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12 mb-8">
          <button className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-base sm:text-lg">
            <span className="group-hover:scale-110 transition-transform duration-200">
              Lihat Menu Lainnya
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, isMobile = false }) {
  if (isMobile) {
    return (
      <div className="group bg-white/80 backdrop-blur-md rounded-2xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-white/20 relative w-full">
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 animate-pulse">
          <span className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white px-2.5 sm:px-4 py-1 rounded-full text-xs font-extrabold shadow-lg ring-2 ring-amber-300/50">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-bounce"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2l2.09 6.26H18l-5.18 3.76L14.18 18 10 13.77 5.82 18l1.36-5.98L2 8.26h5.91z" />
            </svg>
            Best Seller
          </span>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700"
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wgg=="
          />
        </div>

        <div className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg sm:text-xl font-bold text-amber-600">
              {product.price}
            </span>
            <button className="bg-amber-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm">
              Pesan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-white/20 relative flex flex-col h-full w-full">
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 animate-pulse">
        <span className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white px-2.5 sm:px-4 py-1 rounded-full text-xs font-extrabold shadow-lg ring-2 ring-amber-300/50">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-bounce"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2l2.09 6.26H18l-5.18 3.76L14.18 18 10 13.77 5.82 18l1.36-5.98L2 8.26h5.91z" />
          </svg>
          Best Seller
        </span>
      </div>

      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full aspect-[3/2] object-cover group-hover:scale-110 transition-transform duration-700"
          priority={false}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wgg=="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 text-xs sm:text-sm flex-1 leading-relaxed">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-lg sm:text-xl font-bold text-amber-600">
            {product.price}
          </span>
          <button className="bg-amber-100/80 backdrop-blur-sm text-amber-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold hover:bg-amber-200/80 transform hover:scale-105 transition-all duration-200 text-xs sm:text-sm">
            Pesan
          </button>
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
          <div className="bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/30 order-2 lg:order-1">
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

            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="bg-amber-100/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-amber-200/30 flex-shrink-0">
                <div className="text-lg font-bold text-amber-600">5+</div>
                <div className="text-xs text-gray-600">Tahun</div>
              </div>
              <div className="text-gray-600" style={{ fontSize: "13px" }}>
                Pengalaman dalam membuat roti dan kue berkualitas
              </div>
            </div>

            <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base w-fit">
              Pelajari Lebih Lanjut
            </button>
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
      className="py-16 sm:py-20 bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-red-600/90 backdrop-blur-sm relative overflow-hidden z-10"
    >
      <div className="absolute inset-0">
        <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full animate-spin"></div>
        <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 sm:mb-6">
          Siap Merasakan Kelezatan Sempurna?
        </h2>
        <p className="text-base sm:text-lg text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
          Kunjungi toko kami hari ini atau pesan online untuk pengiriman segar.
          Rasakan seni membuat roti seperti tidak pernah ada sebelumnya.
        </p>

        <div className="mb-6 sm:mb-8">
          <button className="bg-white text-amber-700 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base w-fit">
            Lokasi Kami
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
          {/* WhatsApp Link */}
          <a
            href="https://wa.me/6282152673902"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/20 hover:bg-green-600/80 border border-white/30 hover:border-green-600 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-sm sm:text-base">
                  WhatsApp
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  082152673902
                </div>
              </div>
            </div>
          </a>

          {/* Instagram Link */}
          <a
            href="https://instagram.com/alyacakeandbakery"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/20 hover:bg-gradient-to-r hover:from-pink-600/80 hover:to-purple-600/80 border border-white/30 hover:border-pink-600 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-sm sm:text-base">
                  Instagram
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  @alyacakeandbakery
                </div>
              </div>
            </div>
          </a>

          {/* Facebook Link */}
          <a
            href="https://facebook.com/alyacakeandbakery"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/20 hover:bg-blue-600/80 border border-white/30 hover:border-blue-600 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-sm sm:text-base">
                  Facebook
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  Alya Cake and Bakery
                </div>
              </div>
            </div>
          </a>
        </div>

        <p className="text-white/70 text-xs sm:text-sm mt-4">
          Ikuti kami untuk update terbaru
        </p>
      </div>
    </section>
  );
}

// MAIN COMPONENT - SIMPLIFIED
export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_PRODUCTS.length);
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
        <FeaturedProductsSection />
        <AboutSection />
        <CallToActionSection />
      </div>

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="sm:hidden fixed bottom-6 right-5 z-50 bg-white/80 border border-amber-300 shadow-xl rounded-full p-3 transition hover:bg-amber-100 hover:scale-110 active:scale-95"
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
