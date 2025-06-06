"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// FUNCTION SEDERHANA CEK ADMIN
const isAdminEmail = (email) => {
  const adminEmails = [
    "alcary@gmail.com", // Admin utama
    "admin@alcary.com", // Backup admin
  ];
  return adminEmails.includes(email?.toLowerCase());
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    document.body.classList.add("login-no-scroll");
    return () => {
      document.body.classList.remove("login-no-scroll");
    };
  }, []);

  // SIMPLE useEffect - TANPA AUTH LISTENER
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("✅ User already logged in:", session.user.email);
          if (isAdminEmail(session.user.email)) {
            router.replace("/products");
          } else {
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkExistingSession();

    const errorParam = searchParams.get("error");
    if (errorParam === "auth-failed") {
      setError("Login gagal. Silakan coba lagi.");
    }
  }, []); // DEPENDENCY ARRAY KOSONG

  // Handle Login - DENGAN REDIRECT LANGSUNG
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // PREVENT MULTIPLE CLICKS

    setLoading(true);
    setError("");

    console.log("🔄 Starting login for:", email.trim());

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: email.trim(),
          password: password,
        }
      );

      if (authError) {
        console.error("❌ Login error:", authError.message);
        setError("Email atau password salah. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("✅ Login successful for:", data.user.email);

        // LANGSUNG REDIRECT TANPA DELAY
        if (isAdminEmail(data.user.email)) {
          console.log("🔑 Admin user, redirecting to products");
          window.location.href = "/products";
        } else {
          console.log("👤 Regular user, redirecting to home");
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.error("🚨 Unexpected error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // Handle Registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Password tidak sama. Silakan periksa kembali.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Email sudah terdaftar. Silakan gunakan login.");
        } else {
          setError("Gagal mendaftar: " + error.message);
        }
      } else {
        setMessage("Pendaftaran berhasil! Email konfirmasi telah dikirim.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }

    setLoading(false);
  };

  // Google Login
  const handleGoogleLogin = async () => {
    if (loading) return;

    setError("");
    console.log("🔄 Starting Google OAuth...");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google OAuth error:", error);
      setError("Gagal login dengan Google. Coba lagi.");
    }
  };

  return (
    <>
      <style>{`
    body {
      overflow: hidden;
      touch-action: none;
    }
  `}</style>
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-2 sm:p-4 overflow-hidden">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-4 sm:p-8 border border-amber-100 max-h-screen overflow-auto -mt-14 sm:mt-0">
          {/* Header - RESPONSIVE TEXT SIZE */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-3 tracking-wide">
              ALCARY
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg">
              {isLogin ? "Masuk ke akun Anda" : "Daftar akun baru"}
            </p>
          </div>

          {/* Error Messages - SMALLER SPACING */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-tight">{error}</span>
              </div>
            </div>
          )}

          {/* Success Messages - SMALLER SPACING */}
          {message && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs sm:text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-tight">{message}</span>
              </div>
            </div>
          )}

          {/* Google Login Button - SMALLER ON MOBILE */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-gray-700 group-hover:text-gray-900 text-sm sm:text-base">
              {isLogin ? "Masuk dengan Google" : "Daftar dengan Google"}
            </span>
          </button>

          {/* Divider - SMALLER SPACING */}
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          {/* Email/Password Form - COMPACT SPACING */}
          <form
            onSubmit={isLogin ? handleEmailLogin : handleEmailRegister}
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                placeholder="nama@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  <span className="text-sm sm:text-base">
                    {isLogin ? "Masuk..." : "Mendaftar..."}
                  </span>
                </div>
              ) : isLogin ? (
                "Masuk"
              ) : (
                "Daftar Akun"
              )}
            </button>
          </form>

          {/* Toggle Login/Register - SMALLER TEXT */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button
                onClick={() => {
                  if (loading) return;
                  setIsLogin(!isLogin);
                  setError("");
                  setMessage("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-amber-600 hover:text-amber-700 font-medium hover:underline disabled:opacity-50"
                disabled={loading}
              >
                {isLogin ? "Daftar di sini" : "Masuk di sini"}
              </button>
            </p>
          </div>

          {/* Back to Home - SMALLER TEXT */}
          <div className="mt-3 sm:mt-4 text-center">
            <button
              onClick={() => !loading && router.push("/")}
              className="text-amber-600 hover:text-amber-700 text-xs sm:text-sm font-medium hover:underline disabled:opacity-50"
              disabled={loading}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
