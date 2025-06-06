"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products dari Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Loaded products from Supabase:", data);
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload gambar ke Supabase Storage
  const uploadImage = async (file) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please use JPEG, PNG, or WebP");
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum 5MB allowed");
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log("Uploading file:", fileName);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("Upload successful:", uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      console.log("Public URL generated:", urlData.publicUrl);
      return urlData.publicUrl;

    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(error.message || "Failed to upload image");
    }
  };

  // Filter and sort products
  const filterProducts = useCallback(
    ({ category = "all", search = "", sortBy = "popular" }) => {
      setIsLoading(true);

      setTimeout(() => {
        let filtered = [...products];

        // Filter by category
        if (category !== "all") {
          filtered = filtered.filter(
            (product) => product.category === category
          );
        }

        // Filter by search query
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(searchLower) ||
              product.description?.toLowerCase().includes(searchLower) ||
              product.category?.toLowerCase().includes(searchLower)
          );
        }

        // Sort products - HANYA GUNAKAN selling_price
        switch (sortBy) {
          case "price-low":
            filtered.sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0));
            break;
          case "price-high":
            filtered.sort((a, b) => (b.selling_price || 0) - (a.selling_price || 0));
            break;
          case "rating":
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case "newest":
            filtered.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            break;
          default: // popular
            filtered.sort(
              (a, b) => (b.sales_count || 0) - (a.sales_count || 0)
            );
        }

        setFilteredProducts(filtered);
        setIsLoading(false);
      }, 300);
    },
    [products]
  );

  // Add new product - HAPUS FIELD PRICE
  const addProduct = useCallback(
    async (productData) => {
      try {
        console.log("🔍 Raw productData received:", productData);
        console.log("🔍 Available keys:", Object.keys(productData));

        // Flexible field mapping untuk name
        const name = productData.name || 
                     productData.productName || 
                     productData.title;

        // Flexible field mapping untuk price
        const sellingPrice = productData.selling_price || 
                            productData.sellingPrice || 
                            productData.price || 
                            productData.productPrice ||
                            productData.harga ||
                            productData.cost;

        console.log("🔍 Mapped values:", { name, sellingPrice });

        // Validate required fields
        if (!name) {
          console.error("❌ Name field missing. Available fields:", Object.keys(productData));
          throw new Error("Product name is required");
        }

        if (!sellingPrice) {
          console.error("❌ Price field missing. Available fields:", Object.keys(productData));
          throw new Error("Product price is required");
        }

        let imageUrl = "";

        // Upload image if provided
        if (productData.image && typeof productData.image === "object") {
          console.log("📸 Uploading image...");
          imageUrl = await uploadImage(productData.image);
          console.log("✅ Image uploaded:", imageUrl);
        }

        // Prepare data for insertion - HAPUS FIELD PRICE
        const dataToInsert = {
          name: name.trim(),
          description: productData.description?.trim() || 
                      productData.productDescription?.trim() || "",
          short_description: productData.short_description?.trim() || 
                            productData.shortDescription?.trim() || "",
          cost_price: parseFloat(productData.cost_price || 
                                productData.costPrice || 
                                productData.harga_modal || 0),
          selling_price: parseFloat(sellingPrice),
          // HAPUS LINE INI: price: parseFloat(sellingPrice),
          category: productData.category?.trim() || 
                   productData.productCategory?.trim() || 
                   productData.kategori?.trim() || "Produk",
          image_url: imageUrl,
          is_best_seller: productData.is_best_seller || 
                         productData.isBestSeller || false,
          stock: parseInt(productData.stock || 
                         productData.stok || 0),
          rating: parseFloat(productData.rating || 0),
          review_count: parseInt(productData.review_count || 0),
          sales_count: parseInt(productData.sales_count || 0),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log("💾 Data to insert:", dataToInsert);

        const { data, error } = await supabase
          .from("products")
          .insert([dataToInsert])
          .select()
          .single();

        if (error) {
          console.error("❌ Supabase insert error:", error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log("✅ Product added successfully:", data);

        // Update local state
        setProducts((prev) => [data, ...prev]);
        setFilteredProducts((prev) => [data, ...prev]);

        return data;
      } catch (error) {
        console.error("❌ Error adding product:", error);
        throw new Error(error.message || "Failed to add product");
      }
    },
    [uploadImage]
  );

  // Update existing product - HAPUS FIELD PRICE
  const updateProduct = async (updatedProduct) => {
    // Update ke Supabase/backend
    const { error } = await supabase
      .from("products")
      .update({
        name: updatedProduct.name,
        short_description: updatedProduct.shortDescription,
        description: updatedProduct.description,
        selling_price: updatedProduct.sellingPrice,
        category: updatedProduct.category,
        image_url: updatedProduct.image_url,
        // ...field lain...
      })
      .eq("id", updatedProduct.id);

    if (error) throw error;

    // ✅ Setelah update, fetch ulang data produk agar state terupdate
    await loadProducts(); // Ganti fetchProducts() menjadi loadProducts()
  };

  // Delete product
  const deleteProduct = useCallback(
    async (productId) => {
      try {
        console.log("Deleting product:", productId);

        // Get product to delete image
        const { data: product } = await supabase
          .from("products")
          .select("image_url")
          .eq("id", productId)
          .single();

        // Delete image from storage if exists
        if (product?.image_url) {
          const filePath = product.image_url.split("/").slice(-2).join("/");
          await supabase.storage.from("product-images").remove([filePath]);
        }

        // Delete product from database
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (error) {
          console.error("Supabase delete error:", error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log("Product deleted successfully:", productId);

        // Update local state
        setProducts((prev) => prev.filter((product) => product.id !== productId));
        setFilteredProducts((prev) => prev.filter((product) => product.id !== productId));

      } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error(error.message || "Failed to delete product");
      }
    },
    []
  );

  // Update sales count
  const updateProductSales = useCallback(async (productId) => {
    try {
      const { data: currentProduct } = await supabase
        .from("products")
        .select("sales_count")
        .eq("id", productId)
        .single();

      const newSalesCount = (currentProduct?.sales_count || 0) + 1;

      const { error } = await supabase
        .from("products")
        .update({
          sales_count: newSalesCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (error) throw error;

      console.log("Sales count updated for product:", productId);
      await loadProducts();
    } catch (error) {
      console.error("Error updating sales count:", error);
    }
  }, [loadProducts]);

  // Add function to record sale when order is placed
  const recordSale = useCallback(async (productId) => {
    try {
      console.log("📈 Recording sale for product:", productId);

      // Get current sales count
      const { data: currentProduct } = await supabase
        .from("products")
        .select("sales_count")
        .eq("id", productId)
        .single();

      const newSalesCount = (currentProduct?.sales_count || 0) + 1;

      // Update sales count
      const { error } = await supabase
        .from("products")
        .update({
          sales_count: newSalesCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (error) throw error;

      console.log("✅ Sale recorded! New count:", newSalesCount);

      // Refresh products to update rankings
      await loadProducts();
      
      return newSalesCount;
    } catch (error) {
      console.error("❌ Error recording sale:", error);
      throw new Error(error.message || "Failed to record sale");
    }
  }, [loadProducts]);

  // Update return object
  return {
    products,
    filteredProducts,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
    loadProducts,
    updateProductSales, // Rename dari existing
    recordSale, // Add new function
  };
}
