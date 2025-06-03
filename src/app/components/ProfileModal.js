"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabase";

export default function ProfileModal({ isOpen, onClose, user }) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(
        user.user_metadata?.avatar_url || 
        user.user_metadata?.picture ||
        user.identities?.[0]?.identity_data?.avatar_url || ""
      );
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl
        }
      });

      if (error) {
        console.error("Update error:", error);
        alert("Gagal mengupdate profile: " + error.message);
        return;
      }

      alert("Profile berhasil diupdate!");
      setEditing(false);
      
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan tidak terduga");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset to original data
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(
        user.user_metadata?.avatar_url || 
        user.user_metadata?.picture ||
        user.identities?.[0]?.identity_data?.avatar_url || ""
      );
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64 atau upload ke service lain seperti Cloudinary
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Unexpected upload error:', err);
      alert('Terjadi kesalahan saat upload foto');
      setUploading(false);
    }
  };

  const getInitials = () => {
    const name = fullName || user?.user_metadata?.name;
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const handleClose = () => {
    setEditing(false);
    onClose();
  };

  if (!isOpen || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Profile</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                    <span className="text-white font-bold text-2xl">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
              
              {editing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Name Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!editing}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                editing 
                  ? "border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none" 
                  : "border-gray-300 bg-gray-50 text-gray-600"
              }`}
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Email (Read Only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}