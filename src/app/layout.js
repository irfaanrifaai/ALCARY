"use client";
import { useState, useEffect, useRef } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import ProfileModal from "@/components/ProfileModal";
import SettingsModal from "@/components/SettingsModal";
import CartModal from "@/components/CartModal";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabase";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Separate component untuk navbar agar bisa gunakan useCart
function NavigationBar({
  user,
  authLoading,
  pathname, // ✅ PASTIKAN PATHNAME DITERIMA
  showProfileModal,
  setShowProfileModal,
  showSettingsModal,
  setShowSettingsModal,
  showCartModal,
  setShowCartModal,
  handleUserUpdate,
  refreshKey,
  getAvatarUrl,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  handleLogout,
  handleProfileClick,
  handleSettingsClick,
  isMobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
}) {
  const { cartItems } = useCart(); // ✅ TAMBAH INI
  const router = useRouter(); // ✅ TAMBAH INI
  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  ); // ✅ TAMBAH INI

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  // ✅ TAMBAH FUNCTION UNTUK CEK ACTIVE PAGE
  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen, setIsProfileDropdownOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-xl border-x border-t border-amber-200/50 sticky top-0 z-50 transition-all duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 lg:opacity-0 pointer-events-none select-none">
          <div className="absolute top-2 left-4 text-2xl">🍞</div>
          <div className="absolute top-1 right-8 text-xl">🥐</div>
          <div className="absolute bottom-2 left-12 text-lg">🎂</div>
          <div className="absolute bottom-1 right-4 text-xl">🧁</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/30 via-transparent to-orange-50/30 lg:hidden pointer-events-none"></div>

        {/* Container */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-2 min-w-[120px]">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="relative p-2 sm:p-3 text-amber-700 hover:text-amber-800 rounded-xl hover:bg-amber-50/80 transition-all duration-300 hover:scale-110 group border border-transparent hover:border-amber-200/50 backdrop-blur-sm"
                  aria-label="Toggle mobile menu"
                >
                  <div className="relative z-10 flex flex-col justify-center items-center w-6 h-6 sm:w-7 sm:h-7 space-y-1">
                    <span
                      className={`block h-1 w-6 sm:w-7 bg-current rounded-full transition-all duration-300 transform origin-center shadow-sm ${
                        isMobileMenuOpen
                          ? "rotate-45 translate-y-2.5"
                          : "group-hover:w-5 group-hover:bg-amber-600"
                      }`}
                    />
                    <span
                      className={`block h-1 w-5 sm:w-6 bg-current rounded-full transition-all duration-300 shadow-sm ${
                        isMobileMenuOpen
                          ? "opacity-0 scale-0"
                          : "group-hover:w-6 sm:group-hover:w-7 group-hover:bg-amber-600"
                      }`}
                    />
                    <span
                      className={`block h-1 w-6 sm:w-7 bg-current rounded-full transition-all duration-300 transform origin-center shadow-sm ${
                        isMobileMenuOpen
                          ? "-rotate-45 -translate-y-2.5"
                          : "group-hover:w-5 group-hover:bg-amber-600"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 group cursor-pointer relative pl-2">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Link href="/" onClick={closeMobileMenu}>
                  <h1 className="relative text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                    ALCARY
                  </h1>
                </Link>
              </div>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/"
                className="relative px-6 py-3 text-lg text-gray-700 hover:text-amber-700 font-semibold transition-all duration-300 rounded-xl hover:bg-amber-50/80 backdrop-blur-sm group overflow-hidden"
              >
                <span className="relative z-10">Beranda</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              {/* Products Link - ACTIVE NOW */}
              <Link
                href="/products"
                className="relative px-6 py-3 text-lg text-gray-700 hover:text-amber-700 font-semibold transition-all duration-300 rounded-xl hover:bg-amber-50/80 backdrop-blur-sm group overflow-hidden"
              >
                <span className="relative z-10">Produk</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              <div className="relative px-6 py-3 text-lg text-gray-400 font-semibold cursor-not-allowed rounded-xl opacity-50">
                <span className="relative z-10">Tentang</span>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              </div>

              <div className="relative px-6 py-3 text-lg text-gray-400 font-semibold cursor-not-allowed rounded-xl opacity-50">
                <span className="relative z-10">Kontak</span>
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-6 min-w-[120px] justify-end">
              {pathname !== "/login" && (
                <>
                  {/* ✅ TELEPON BUTTON - HANYA TAMPIL DI HOMEPAGE */}
                  {pathname === "/" && (
                    <button
                      type="button"
                      onClick={() => {
                        // Scroll ke contact section
                        const section = document.getElementById("contact-section");
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        } else {
                          // Fallback scroll ke bawah
                          window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="relative p-2 sm:p-3 lg:p-4 text-gray-600 hover:text-amber-700 rounded-xl hover:bg-amber-50/80 backdrop-blur-sm transition-all duration-300 group hover:shadow-lg border border-transparent hover:border-amber-200/50"
                      aria-label="Telepon Kami"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* ✅ CART BUTTON - TETAP TAMPIL DI SEMUA HALAMAN */}
                  <button
                    onClick={handleCartClick}
                    className="relative p-2 sm:p-3 lg:p-4 text-gray-600 hover:text-amber-700 rounded-xl hover:bg-amber-50/80 backdrop-blur-sm transition-all duration-300 group hover:shadow-lg border border-transparent hover:border-amber-200/50"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="21" r="1.5" />
                      <circle cx="19" cy="21" r="1.5" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 4h14"
                      />
                    </svg>

                    {/* Cart Badge */}
                    {cartItemsCount > 0 && (
                      <>
                        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs sm:text-sm flex items-center justify-center font-bold group-hover:scale-125 transition-all duration-300 shadow-lg ring-2 ring-white">
                          {cartItemsCount}
                        </span>
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                      </>
                    )}
                  </button>
                </>
              )}

              {/* ✅ USER SECTION - TETAP TAMPIL DI SEMUA HALAMAN */}
              {!authLoading && (
                <>
                  {user ? (
                    <div className="relative profile-dropdown" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setIsProfileDropdownOpen(!isProfileDropdownOpen)
                        }
                        className="flex items-center p-0 border-none bg-transparent focus:outline-none"
                        style={{ boxShadow: "none" }}
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200 overflow-hidden">
                          {getAvatarUrl(user) ? (
                            <img
                              key={refreshKey}
                              src={getAvatarUrl(user)}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-full"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : (
                            <span className="text-amber-600 font-bold text-xl">
                              {user.email?.charAt(0).toUpperCase()}
                            </span>
                          )}

                          <div
                            className="w-full h-full flex items-center justify-center bg-amber-500 text-white font-bold text-xl"
                            style={{ display: "none" }}
                          >
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      </button>

                      {isProfileDropdownOpen && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-[99999] transition-all duration-200"
                        >
                          <div className="p-2">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                  {getAvatarUrl(user) ? (
                                    <img
                                      key={`dropdown-${refreshKey}`}
                                      src={getAvatarUrl(user)}
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                          "flex";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                                      {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                  )}

                                  <div
                                    className="w-full h-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold"
                                    style={{ display: "none" }}
                                  >
                                    {user.email?.charAt(0).toUpperCase()}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.user_metadata?.full_name ||
                                      user?.email?.split("@")[0]}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="py-1">
                              <button
                                onClick={handleProfileClick}
                                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                Profile Saya
                              </button>

                              <button
                                onClick={handleSettingsClick}
                                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Settings
                              </button>
                            </div>

                            <div className="py-1 border-t border-gray-100">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Logout
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="relative flex items-center justify-center p-2 sm:p-3 lg:px-8 lg:py-3 text-gray-600 hover:text-amber-700 lg:text-white lg:bg-gradient-to-r lg:from-amber-500 lg:to-orange-600 rounded-xl hover:bg-amber-50/80 lg:hover:shadow-xl backdrop-blur-sm transition-all duration-300 group lg:shadow-lg lg:hover:scale-105 lg:hover:-translate-y-0.5 overflow-hidden border border-transparent hover:border-amber-200/50"
                    >
                      <span className="block lg:hidden">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                      <span className="hidden lg:block font-bold text-base lg:text-lg">
                        Login
                      </span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
        />

        <div className="fixed top-0 left-0 h-full w-3/5 bg-white shadow-2xl transform transition-transform duration-300 ease-out">
          <div className="flex items-center justify-center p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 group cursor-pointer relative">
                <Link href="/" onClick={closeMobileMenu}>
                  <h1 className="relative text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform duration-300">
                    ALCARY
                  </h1>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
            <button
              onClick={closeMobileMenu}
              className="bg-amber-50 hover:bg-amber-100 shadow-sm rounded-l-lg px-2 py-4 text-gray-600 hover:text-amber-600 transition-all duration-200 border border-r-0 border-amber-200/50"
            >
              <svg
                className="w-4 h-4 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <nav className="py-4 px-2 space-y-1 overflow-y-auto h-full pb-20">
            {/* ✅ BERANDA - CEK ACTIVE STATE */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`flex items-center gap-4 px-4 py-3.5 mx-2 rounded-xl border transition-all duration-200 group ${
                isActive("/")
                  ? "text-amber-700 bg-amber-50 border-amber-200/50"
                  : "text-gray-700 hover:text-amber-700 hover:bg-amber-50 border-transparent"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                  isActive("/") ? "bg-amber-500" : "bg-gray-200"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    isActive("/") ? "text-white" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="font-semibold text-base">Beranda</span>
              {isActive("/") && (
                <div className="ml-auto w-2 h-2 bg-amber-500 rounded-full"></div>
              )}
            </Link>

            {/* ✅ PRODUK - CEK ACTIVE STATE */}
            <Link
              href="/products"
              onClick={closeMobileMenu}
              className={`flex items-center gap-4 px-4 py-3.5 mx-2 rounded-xl border transition-all duration-200 group ${
                isActive("/products")
                  ? "text-amber-700 bg-amber-50 border-amber-200/50"
                  : "text-gray-700 hover:text-amber-700 hover:bg-amber-50 border-transparent"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                  isActive("/products") ? "bg-amber-500" : "bg-gray-200"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    isActive("/products") ? "text-white" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <span className="font-semibold text-base">Produk</span>
              {isActive("/products") && (
                <div className="ml-auto w-2 h-2 bg-amber-500 rounded-full"></div>
              )}
            </Link>

            <div className="flex items-center gap-4 px-4 py-3.5 mx-2 text-gray-400 rounded-xl transition-all duration-200 relative">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="font-medium text-base">Tentang</span>
              <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Soon
              </span>
            </div>

            <div className="flex items-center gap-4 px-4 py-3.5 mx-2 text-gray-400 rounded-xl transition-all duration-200 relative">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-base">Kontak</span>
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Soon
              </span>
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">© 2025 ALCARY</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUserUpdate={handleUserUpdate}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
      />

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        user={user} // <-- pastikan ini ada!
      />
    </>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth state management
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          console.log("🔄 Initial session:", session?.user?.user_metadata);
          setUser(session?.user || null);
          setAuthLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    getInitialSession();

    // ✅ ENHANCED AUTH STATE LISTENER
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", {
        event,
        user: session?.user?.user_metadata,
        customAvatar: session?.user?.user_metadata?.custom_avatar_url,
      });

      if (mounted) {
        setUser(session?.user || null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ✅ FORCE REFRESH USER FUNCTION
  const forceRefreshUser = async () => {
    try {
      console.log("🔄 Force refreshing user...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("✅ Force refresh result:", session.user.user_metadata);
        setUser(session.user);
      }
    } catch (error) {
      console.error("Error force refreshing user:", error);
    }
  };

  // ✅ AVATAR URL WITH CACHE BUSTING
  const getAvatarUrl = (user) => {
    if (!user) return null;

    const customAvatar = user.user_metadata?.custom_avatar_url;
    const googleAvatar = user.user_metadata?.avatar_url;

    // Cache busting untuk custom avatar
    const avatarUrl = customAvatar || googleAvatar;
    return avatarUrl ? `${avatarUrl}?t=${Date.now()}` : null;
  };

  const handleUserUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Clear localStorage terlebih dahulu
      localStorage.removeItem('alcary-cart');
      
      // Logout dari Supabase dengan method sederhana
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
      }

      // Clear user state
      setUser(null);
      
      // Redirect ke home
      router.push('/');
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Paksa clear dan redirect jika gagal
      localStorage.clear();
      setUser(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setIsProfileDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleComplete);
    router.events?.on("routeChangeError", handleComplete);

    // Show loading on first mount (refresh)
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // adjust as needed

    return () => {
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleComplete);
      router.events?.off("routeChangeError", handleComplete);
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <CartProvider user={user}>
          <NavigationBar
            user={user}
            authLoading={authLoading}
            pathname={pathname}
            showProfileModal={showProfileModal}
            setShowProfileModal={setShowProfileModal}
            showSettingsModal={showSettingsModal}
            setShowSettingsModal={setShowSettingsModal}
            showCartModal={showCartModal}
            setShowCartModal={setShowCartModal}
            handleUserUpdate={handleUserUpdate}
            refreshKey={refreshKey}
            getAvatarUrl={getAvatarUrl}
            isProfileDropdownOpen={isProfileDropdownOpen}
            setIsProfileDropdownOpen={setIsProfileDropdownOpen}
            handleLogout={handleLogout}
            handleProfileClick={handleProfileClick}
            handleSettingsClick={handleSettingsClick}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            closeMobileMenu={closeMobileMenu}
          />
          {loading && <LoadingOverlay />}
          <main className="min-h-screen">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
