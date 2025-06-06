"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";

export default function ProfileModal({ isOpen, onClose, user, onUserUpdate }) {
  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullName(
        user.user_metadata?.full_name || user.email?.split("@")[0] || ""
      );

      // ✅ SIMPLIFY: Prioritas avatar URL
      const customAvatar = user.user_metadata?.custom_avatar_url;
      const googleAvatar = user.user_metadata?.avatar_url;
      
      setProfilePhoto(customAvatar || googleAvatar || "");
    }
  }, [user]);

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

  // ✅ FIXED: handleFileChange dengan bucket name yang benar
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError("");
      setMessage("");

      // ✅ CHECK SESSION FIRST - ini yang penting!
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        throw new Error("Sesi login bermasalah. Silakan logout dan login kembali.");
      }

      console.log("🔍 Session check:", {
        userId: session.user.id,
        userEmail: session.user.email
      });

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      const bucketName = "profile-photos";

      console.log("📂 Upload details:", {
        fileName,
        bucket: bucketName,
        userId: session.user.id
      });

      // Delete old custom file if exists
      if (user.user_metadata?.custom_avatar_url?.includes("supabase")) {
        try {
          const oldUrl = user.user_metadata.custom_avatar_url;
          const oldFileName = oldUrl.split('/').pop()?.split('?')[0];
          if (oldFileName) {
            console.log("🗑️ Deleting old file:", oldFileName);
            await supabase.storage.from(bucketName).remove([oldFileName]);
          }
        } catch (deleteError) {
          console.log("⚠️ Old file cleanup failed:", deleteError);
        }
      }

      // ✅ UPLOAD - Pastikan menggunakan session.user.id yang valid
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Upload error:", uploadError);
        
        // Better error messages
        if (uploadError.message.includes('row-level security')) {
          throw new Error("Akses ditolak. Silakan logout dan login kembali.");
        } else if (uploadError.message.includes('duplicate')) {
          throw new Error("File sudah ada. Coba dengan nama berbeda.");
        } else {
          throw new Error(`Upload gagal: ${uploadError.message}`);
        }
      }

      console.log("✅ Upload successful:", data);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(fileName);

      if (!publicUrl) {
        throw new Error("Gagal mendapatkan URL foto");
      }

      console.log("✅ Photo uploaded:", publicUrl);

      // Update preview
      setProfilePhoto(publicUrl);

      // Update user profile
      await updateUserProfile(fullName.trim(), publicUrl);

      setMessage("Foto berhasil diupload dan disimpan!");
      
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.message || "Gagal upload foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ✅ FIXED: Simplify updateUserProfile
  const updateUserProfile = async (name, customAvatarUrl = null) => {
    try {
      // ✅ CHECK SESSION AGAIN
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        throw new Error("Sesi login bermasalah. Silakan logout dan login kembali.");
      }

      const updateData = {
        full_name: name,
      };

      // Update custom_avatar_url jika ada
      if (customAvatarUrl) {
        updateData.custom_avatar_url = customAvatarUrl;
      }

      console.log("Updating user with:", updateData);

      const { data, error } = await supabase.auth.updateUser({
        data: updateData,
      });

      if (error) {
        throw new Error(`Update gagal: ${error.message}`);
      }

      console.log("✅ User updated:", data.user);

      // ✅ FORCE TRIGGER AUTH STATE CHANGE
      // Method 1: Refresh session untuk trigger onAuthStateChange
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && refreshData?.session) {
        console.log("✅ Session refreshed:", refreshData.session.user.user_metadata);
      }

      // ✅ Method 2: Manual trigger dengan getSession
      setTimeout(async () => {
        const { data: newSession } = await supabase.auth.getSession();
        console.log("🔄 New session after update:", newSession?.session?.user?.user_metadata);
      }, 500);

      // Update parent component
      if (onUserUpdate && data.user) {
        onUserUpdate(data.user);
      }

      return data.user;
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      // ✅ FIXED: Hanya save nama, avatar sudah disave saat upload
      await updateUserProfile(fullName.trim());

      setMessage("Profile berhasil disimpan!");
      
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Gagal menyimpan profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reset form when closing
  const handleClose = () => {
    setError("");
    setMessage("");
    
    if (user) {
      setFullName(
        user.user_metadata?.full_name || user.email?.split("@")[0] || ""
      );
      
      const customAvatar = user.user_metadata?.custom_avatar_url;
      const googleAvatar = user.user_metadata?.avatar_url;
      setProfilePhoto(customAvatar || googleAvatar || "");
    }

    onClose();
  };

  if (!isOpen) return null;

  // ✅ FIXED: Display avatar dengan cache busting hanya untuk tampilan
  const displayAvatar = profilePhoto;

  // ✅ PERBAIKI generateImageUrl - DETEKSI URL LENGKAP vs PATH
  const generateImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // ✅ JIKA SUDAH URL LENGKAP (https://...), langsung return dengan timestamp baru
    if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
      const cleanUrl = imagePath.split('?')[0]; // Remove existing timestamp
      return `${cleanUrl}?t=${Date.now()}`;
    }
    
    // ✅ JIKA HANYA PATH (filename), buat URL lengkap
    const cleanPath = imagePath.split('?')[0];
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-photos/${cleanPath}`;
    return `${baseUrl}?t=${Date.now()}`;
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <h2 className="text-xl font-bold text-gray-900">Profile Saya</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Profile Photo Section */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {/* Photo Preview */}
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-amber-200 bg-gradient-to-br from-amber-500 to-orange-600 relative">
                {/* ✅ PERBAIKI IMAGE SRC */}
                {displayAvatar ? (
                  <img
                    src={generateImageUrl(profilePhoto)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("❌ Image load error:", e.target.src);
                      console.log("📝 Original profilePhoto:", profilePhoto);
                      // Show default avatar on error
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                    onLoad={(e) => {  // ✅ TAMBAH PARAMETER e
                      console.log("✅ Profile image loaded successfully");
                      console.log("✅ Final URL:", e.target.src);
                      console.log("📝 Original profilePhoto:", profilePhoto);
                    }}
                  />
                ) : null}
                
                {/* Default Avatar */}
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ display: displayAvatar ? "none" : "flex" }}
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Upload Progress */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || uploadingPhoto}
                className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white rounded-full p-2 shadow-lg transition-colors"
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
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading || uploadingPhoto}
                className="hidden"
              />
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {uploadingPhoto
                ? "Mengupload foto..."
                : "Klik ikon kamera untuk mengganti foto"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading || uploadingPhoto}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:bg-gray-50"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email tidak dapat diubah
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={loading || uploadingPhoto}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading || uploadingPhoto || !fullName.trim()}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </div>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
