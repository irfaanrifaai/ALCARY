"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // ✅ TAMBAH usePathname
import Link from "next/link"; // ✅ TAMBAH Link
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useProducts } from "./useProducts";

// FUNCTION CEK ADMIN (sama seperti di login)
const isAdminEmail = (email) => {
  const adminEmails = [
    "alcary@gmail.com", // Admin utama
    "admin@alcary.com", // Backup admin
  ];
  return adminEmails.includes(email?.toLowerCase());
};

// Fungsi untuk memformat mata uang
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Updated categories - hanya 3 kategori
const categories = [
  { id: "all", name: "Semua Produk" },
  { id: "kue", name: "Kue" },
  { id: "roti", name: "Roti" },
  { id: "custom", name: "Custom" },
];

const sortOptions = [
  { id: "popular", name: "Paling Populer" },
  { id: "price-low", name: "Harga Terendah" },
  { id: "price-high", name: "Harga Tertinggi" },
  { id: "newest", name: "Terbaru" },
  { id: "rating", name: "Rating Tertinggi" },
];

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ TAMBAH INI SAJA

  const {
    products,
    filteredProducts,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
  } = useProducts();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // CEK AUTH & ADMIN STATUS - TANPA REDIRECT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const userEmail = session.user.email;
          const adminStatus = isAdminEmail(userEmail);
          setUser(session.user);
          setIsAdmin(adminStatus);
        } else {
          setUser(null);
          setIsAdmin(false);
        }

        setAuthLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Listen auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const adminStatus = isAdminEmail(session.user.email);
        setUser(session.user);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Filter dan sort products ketika dependency berubah
  useEffect(() => {
    filterProducts({
      category: selectedCategory,
      search: searchQuery,
      sortBy: sortBy,
    });
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, filterProducts]);

  // Update categories count
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? products.length
        : products.filter((p) => p.category === cat.id).length,
  }));

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // CRUD Operations - Simplified
  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // ✅ TAMBAHKAN handleEditClick FUNCTION
  const handleEditClick = (product) => {
    console.log("🔧 Edit product clicked:", product);
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // ✅ PERBAIKI handleEditProduct - GANTI loadProducts() dengan updateProduct()
  const handleEditProduct = async (updatedProduct) => {
    try {
      console.log("🔄 Updating product:", updatedProduct);

      const { data, error } = await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          cost_price: updatedProduct.costPrice,
          selling_price: updatedProduct.sellingPrice,
          category: updatedProduct.category,
          is_best_seller: updatedProduct.is_best_seller,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedProduct.id)
        .select();

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }

      console.log("✅ Product updated in database:", data);

      // ✅ GUNAKAN updateProduct DARI useProducts HOOK
      await updateProduct(updatedProduct);

      // ✅ TUTUP MODAL DAN RESET STATE
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("❌ Error updating product:", error);
      throw error;
    }
  };

  const handleDeleteProduct = (product) => {
    console.log("Delete product called:", product);
    setDeleteModal({
      isOpen: true,
      product: product,
    });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.product) {
        await deleteProduct(deleteModal.product.id);
        setDeleteModal({ isOpen: false, product: null });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* DASHBOARD ADMIN - Hanya tampil di desktop */}
      {isAdmin && (
        <div className="hidden md:block max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Admin - Kelola Produk
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Selamat datang, {user?.email} | Status: Administrator
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                <span className="text-sm font-medium text-orange-700">
                  Admin Access
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* TOMBOL TAMBAH PRODUK - POSISI LEBIH KEBAWAH DI MOBILE */}
        {isAdmin && (
          <div className="flex justify-center mb-6 mt-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-sm text-sm md:text-base"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="font-medium">Tambah Produk Baru</span>
            </button>
          </div>
        )}

        {/* Search Bar */}
        {products.length > 0 && (
          <div className="max-w-md mx-auto mb-4">
            <div className="relative mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Kategori & Sort */}
        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            {/* Mobile: Kategori & Sort dalam satu baris */}
            <div className="flex md:hidden w-full gap-2">
              {/* Kategori - Sebelah Kiri */}
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs bg-white font-medium shadow-sm"
                >
                  {categoriesWithCount.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort - Sebelah Kanan */}
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs bg-white font-medium shadow-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desktop: Layout Original */}
            <div className="hidden md:flex w-full justify-between items-center">
              {/* Kategori: Button group di desktop */}
              <div className="flex flex-wrap gap-2">
                {categoriesWithCount.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm border shadow-sm
                      ${
                        selectedCategory === category.id
                          ? "bg-orange-500 text-white shadow-lg border-orange-500"
                          : "bg-white text-gray-700 hover:bg-orange-100 border-gray-200"
                      }
                    `}
                    style={{
                      minWidth: "100px",
                      fontWeight: 600,
                      boxShadow:
                        selectedCategory === category.id
                          ? "0 2px 8px 0 #f59e42aa"
                          : undefined,
                    }}
                  >
                    {category.name}
                    <span className="ml-2 text-xs opacity-75">
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort di desktop */}
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-600">
                  {filteredProducts.length} produk
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white font-semibold shadow-sm"
                  style={{
                    minWidth: "140px",
                    fontWeight: 600,
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-32 md:h-48 bg-gray-200"></div>
                <div className="p-2 md:p-4">
                  <div className="h-2 md:h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-1.5 md:h-2 bg-gray-200 rounded mb-2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-2 md:h-3 bg-gray-200 rounded w-12 md:w-16"></div>
                    <div className="h-4 md:h-6 bg-gray-200 rounded w-8 md:w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State - sama seperti sebelumnya */
          <div className="text-center py-12">
            <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-orange-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 md:w-12 h-8 md:h-12 text-orange-600"
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
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
              {isAdmin ? "Belum Ada Produk" : "Produk Segera Hadir"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              {isAdmin
                ? "Mulai menambahkan produk untuk ditampilkan kepada pelanggan."
                : "Kami sedang mempersiapkan produk-produk terbaik untuk Anda."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Tambah Produk Pertama
              </button>
            )}
          </div>
        ) : filteredProducts.length === 0 ? (
          // No results
          <div className="text-center py-12">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-8 md:w-10 h-8 md:h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-6">
              {currentProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditClick} // ← GANTI DARI handleEditProduct KE handleEditClick
                  onDelete={handleDeleteProduct}
                  animationDelay={index * 0.1}
                  showAdminControls={isAdmin}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-6 md:mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      currentPage === index + 1
                        ? "bg-orange-500 text-white"
                        : "border border-gray-300 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals - HANYA ADMIN YANG BISA AKSES */}
      {isAdmin && (
        <>
          <AddProductModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddProduct}
          />

          <EditProductModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onEdit={handleEditProduct} // ← INI TETAP handleEditProduct
            product={editingProduct}
          />

          <DeleteConfirmModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, product: null })}
            onConfirm={confirmDelete}
            product={deleteModal.product}
          />
        </>
      )}

      {/* Product Modal tetap bisa diakses semua user */}
      <ProductModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
      />
    </div>
  );
}
