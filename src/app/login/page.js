"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/"); // Redirect to homepage if already logged in
      }
    };
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Clear localStorage
        localStorage.removeItem("otpSent");
        localStorage.removeItem("loginEmail");
        // Ganti window.location.href dengan router.push
        router.push("/"); // SPA navigation ke beranda
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Load state dari localStorage saat component mount
  useEffect(() => {
    const savedOtpSent = localStorage.getItem("otpSent");
    const savedEmail = localStorage.getItem("loginEmail");

    if (savedOtpSent === "true" && savedEmail) {
      setOtpSent(true);
      setEmail(savedEmail);
    }
  }, []);

  // Login dengan Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    // Ambil redirect URL dari query parameter
    const redirectTo =
      new URLSearchParams(window.location.search).get("redirect") || "/";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${
          window.location.origin
        }/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Kirim OTP ke email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setOtpSent(true);
      // Simpan state ke localStorage
      localStorage.setItem("otpSent", "true");
      localStorage.setItem("loginEmail", email);
    }
    setLoading(false);
  };

  // Function untuk kembali ke card pertama
  const handleBackToLogin = () => {
    setOtpSent(false);
    setEmail("");
    // Hapus dari localStorage
    localStorage.removeItem("otpSent");
    localStorage.removeItem("loginEmail");
  };

  // Verifikasi OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      setError(error.message);
    } else {
      // Hapus dari localStorage saat berhasil login
      localStorage.removeItem("otpSent");
      localStorage.removeItem("loginEmail");
      ("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-amber-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-red-200/30 rounded-full blur-xl animate-pulse delay-500"></div>

      {/* Main Login Card - Responsive positioning */}
      <div className="absolute top-[40%] sm:top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-sm px-4">
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-2xl shadow-2xl border border-white/50 transform hover:scale-[1.02] transition-all duration-300 min-h-[400px] sm:min-h-[500px] flex flex-col max-h-[90vh] overflow-y-auto">
          {/* Tombol X - HANYA TAMPIL DI CARD PERTAMA */}
          {!otpSent && (
            <button
              onClick={() => router.push("/")}
              className="absolute top-3 right-3 bg-white/90 hover:bg-amber-100 text-gray-400 hover:text-amber-600 rounded-full shadow border border-gray-200 w-8 h-8 flex items-center justify-center transition-all duration-200 z-10"
              aria-label="Kembali ke beranda"
              type="button"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Header - HANYA TAMPIL DI CARD PERTAMA */}
          {!otpSent && (
            <div className="text-center mb-4 sm:mb-5">
              <div className="mx-auto w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                <svg
                  className="w-5 sm:w-6 h-5 sm:h-6 text-white"
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
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                Selamat Datang
              </h1>
              <p className="text-gray-500 text-xs">
                Masuk untuk melanjutkan ke ALCARY
              </p>
            </div>
          )}

          {/* Form Container - Responsive */}
          <div className="flex-grow flex flex-col justify-center">
            {!otpSent ? (
              // CARD PERTAMA
              <div className="space-y-3 sm:space-y-4">
                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transform hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  {loading ? "Memproses..." : "Lanjutkan dengan Google"}
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-3 text-gray-400 text-xs font-medium">
                    atau
                  </span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                          d="M16 12a4 4 0 10-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Masukkan alamat email Anda"
                      className="w-full pl-10 pr-3 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 text-gray-700 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      <>
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
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Kirim Kode Verifikasi
                      </>
                    )}
                  </button>
                </form>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-red-600 text-xs font-medium">
                        {error}
                      </span>
                    </div>
                  </div>
                )}

                {/* Privacy Policy */}
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-xs">
                    Dengan masuk, Anda menyetujui{" "}
                    <a href="#" className="text-amber-600 hover:text-amber-700">
                      Syarat & Ketentuan
                    </a>{" "}
                    dan{" "}
                    <a href="#" className="text-amber-600 hover:text-amber-700">
                      Kebijakan Privasi
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              // CARD KEDUA - TANPA TOMBOL X
              <div className="space-y-3 sm:space-y-4">
                {/* Header compact */}
                <div className="text-center mb-3 sm:mb-4">
                  <div className="mx-auto w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                    <svg
                      className="w-6 sm:w-8 h-6 sm:h-8 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                    Link Login Terkirim!
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Email konfirmasi telah dikirim ke:
                  </p>

                  <div className="bg-amber-50 rounded-lg p-2 sm:p-3 mt-2 sm:mt-3 mb-3 sm:mb-4 border border-amber-200">
                    <p className="text-amber-800 font-medium text-xs sm:text-sm break-all">
                      {email}
                    </p>
                  </div>
                </div>

                {/* Tutorial compact */}
                <div className="bg-amber-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-amber-200">
                  <h4 className="text-amber-800 font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
                    Langkah-langkah untuk login :
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-4 sm:w-5 h-4 sm:h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        1
                      </span>
                      <p className="text-amber-700 text-xs">
                        Buka aplikasi email Anda
                      </p>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-4 sm:w-5 h-4 sm:h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        2
                      </span>
                      <p className="text-amber-700 text-xs">
                        Cari email dari <strong>ALCARY</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-4 sm:w-5 h-4 sm:h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        3
                      </span>
                      <p className="text-amber-700 text-xs">
                        Klik tombol <strong>"Confirm your email"</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-4 sm:w-5 h-4 sm:h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        4
                      </span>
                      <p className="text-orange-700 text-xs font-medium">
                        Anda akan otomatis masuk!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tombol Buka Email */}
                <button
                  onClick={() => {
                    const emailProvider = email.includes("@gmail.com")
                      ? "https://gmail.com"
                      : email.includes("@yahoo.com")
                      ? "https://mail.yahoo.com"
                      : email.includes("@outlook.com") ||
                        email.includes("@hotmail.com")
                      ? "https://outlook.live.com"
                      : "mailto:";
                    window.open(emailProvider, "_blank");
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <svg
                    className="w-3 sm:w-4 h-3 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Buka Aplikasi Email
                </button>

                {/* Tombol kembali */}
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-amber-600 hover:text-amber-700 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors rounded-lg hover:bg-amber-50 border border-amber-200"
                >
                  Kembali
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
