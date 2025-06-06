"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";

export default function SettingsModal({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState("password");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);

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

  // Reset form when closing
  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
    setActiveTab("password");
    onClose();
  };

  // Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Password baru tidak sama");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError("Gagal update password: " + error.message);
      } else {
        setMessage("Password berhasil diperbarui!");
        setNewPassword("");
        setConfirmPassword("");

        // Close modal after success
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat update password");
      console.error("Update password error:", err);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Pengaturan Akun
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-colors ${
              activeTab === "password"
                ? "text-amber-600 border-b-2 border-amber-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Password</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex-1 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-colors ${
              activeTab === "preferences"
                ? "text-amber-600 border-b-2 border-amber-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Preferensi</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
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

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Ubah Password
                  </h3>

                  {user?.user_metadata?.avatar_url && user?.email?.includes("@gmail.com") ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-500 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <div>
                          <p className="font-medium text-blue-800">Google Account</p>
                          <p className="text-sm text-blue-600">
                            Password dikelola oleh Google. Silakan ubah password di akun Google Anda.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          placeholder="Masukkan password baru"
                          required
                          minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          placeholder="Ulangi password baru"
                          required
                          minLength={6}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Memperbarui...
                          </div>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Preferences Tab - CLEANED UP */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Preferensi Akun
                  </h3>

                  <div className="space-y-4">
                    {/* Email Notifications */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">Email Notifikasi</p>
                            <p className="text-sm text-gray-500">Terima update produk dan promo</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>

                    {/* Account Info - SIMPLIFIED (No login methods) */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-3">Informasi Akun</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="text-gray-900 break-all">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member sejak:</span>
                          <span className="text-gray-900">
                            {new Date(user?.created_at).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="text-green-600 font-medium">Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Optional: Add more preference settings here */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h5v-5l-5 5zm0-10h5V4L4 9zM20 9h-5V4l5 5z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">Mode Gelap</p>
                            <p className="text-sm text-gray-500">Tampilan gelap untuk mata yang nyaman</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
