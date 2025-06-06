"use client";
import { createPortal } from "react-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import {
  DELIVERY_ZONES,
  calculateShippingCost,
  isEligibleFreeShipping,
} from "@/utils/deliveryZones";

const formatCurrency = (amount) => {
  if (!amount || isNaN(amount) || amount === 0) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CartModal({ isOpen, onClose, user }) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    getTotalItems,
    checkout,
  } = useCart();

  const [selectedZone, setSelectedZone] = useState("pickup");
  const [showZoneSelector, setShowZoneSelector] = useState(false);

  if (!isOpen) return null;

  // ✅ CALCULATION - TANPA DEBUG LOG
  const subtotal = cartSubtotal || 0;
  const shippingCost = calculateShippingCost(selectedZone, subtotal);
  const total = subtotal + shippingCost;
  const selectedZoneData = DELIVERY_ZONES.find((z) => z.id === selectedZone);

  const handleCheckout = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (cartItems.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    // Buat pesan WhatsApp langsung
    const message = createWhatsAppMessage();
    const phoneNumber = "6282152673902";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Simpan zona yang dipilih ke localStorage untuk backup
    localStorage.setItem(
      "selectedDeliveryZone",
      JSON.stringify(selectedZoneData)
    );

    // Buka WhatsApp
    window.open(whatsappUrl, "_blank");

    // Close modal
    onClose();
  };

  const createWhatsAppMessage = () => {
    const currentDate = new Date().toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });

    let message = `🍞 *PESANAN ROTI ALCARY* 🧁\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `📅 *Tanggal Pesanan:* ${currentDate}\n\n`;

    message += `🛒 *DETAIL PESANAN:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    cartItems.forEach((item, index) => {
      const itemPrice = item.selling_price || item.price || 0;
      const itemTotal = itemPrice * item.quantity;

      message += `${index + 1}. *${item.name}*\n`;
      message += `   Kategori: ${item.category}\n`;
      message += `   Harga: ${formatCurrency(itemPrice)}\n`;
      message += `   Jumlah: ${item.quantity} pcs\n`;
      message += `   Subtotal: *${formatCurrency(itemTotal)}*\n\n`;
    });

    message += `🚚 *PENGIRIMAN:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Zona: *${selectedZoneData?.name}*\n`;
    message += `Jarak: ${selectedZoneData?.distance}\n`;
    message += `Ongkos Kirim: *${
      shippingCost === 0 ? "GRATIS ✅" : formatCurrency(shippingCost)
    }*\n\n`;

    message += `💰 *RINGKASAN PEMBAYARAN:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Subtotal Produk: ${formatCurrency(subtotal)}\n`;
    message += `Ongkos Kirim: ${
      shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost)
    }\n`;
    message += `*TOTAL BAYAR: ${formatCurrency(total)}*\n\n`;

    if (shippingCost === 0 && selectedZone !== "pickup") {
      message += `🎉 *Selamat! Anda mendapat GRATIS ONGKIR!*\n\n`;
    }

    message += `📝 *INSTRUKSI SELANJUTNYA:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    if (selectedZone === "pickup") {
      message += `• Pesanan akan disiapkan dalam 30-60 menit\n`;
      message += `• Silakan datang ke toko untuk mengambil pesanan\n`;
      message += `• Mohon tunjukkan chat WhatsApp ini saat pengambilan\n`;
    } else {
      message += `• Mohon kirimkan alamat lengkap untuk pengiriman\n`;
      message += `• Pesanan akan diantar dalam 1-2 jam\n`;
      message += `• Siapkan uang pas atau transfer sesuai total\n`;
    }

    message += `• Konfirmasi pesanan dengan membalas "YA PESAN"\n\n`;

    message += `📍 *ALAMAT TOKO:*\n`;
    message += `Roti Alcary - Jl. Contoh No. 123, Kota ABC\n`;
    message += `Buka: 07.00 - 21.00 WIB\n\n`;

    message += `🙏 _Terima kasih telah mempercayai Roti Alcary!_\n`;
    message += `_Tim kami akan segera memproses pesanan Anda._`;

    return message;
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-start justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white h-full w-full max-w-md shadow-2xl overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-600">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l.01.01M12 21a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Keranjang Saya</h2>
              <p className="text-white/80 text-sm">{getTotalItems()} item</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                title="Kosongkan Keranjang"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
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
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-280px)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l.01.01M12 21a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Keranjang Kosong
              </h3>
              <p className="text-gray-500 text-sm">
                Silakan tambahkan produk ke keranjang
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* ✅ PERBAIKI PRODUCT IMAGE */}
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image || item.image_url ? (
                      <img
                        src={item.image || item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback Icon */}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        display: item.image || item.image_url ? "none" : "flex",
                      }}
                    >
                      <span className="text-lg md:text-xl font-bold text-amber-600">
                        {item.name?.charAt(0) || "P"}
                      </span>
                    </div>
                  </div>

                  {/* ✅ PRODUCT INFO - COMPACT */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs md:text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-amber-600 font-bold text-xs md:text-sm">
                      {formatCurrency(item.selling_price || item.price || 0)}
                    </p>
                    <span className="inline-block bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full mt-1">
                      {item.category}
                    </span>
                  </div>

                  {/* ✅ QUANTITY CONTROLS - SMALLER FOR MOBILE */}
                  <div className="flex items-center gap-1 md:gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(0, item.quantity - 1))
                      }
                      className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors touch-target"
                    >
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>

                    <span className="w-6 md:w-8 text-center font-semibold text-xs md:text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 md:w-8 md:h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center transition-colors touch-target"
                    >
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4"
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
                    </button>
                  </div>

                  {/* ✅ REMOVE BUTTON - COMPACT */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 md:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors touch-target"
                    title="Hapus dari keranjang"
                  >
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Zone Selector */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Zona Pengiriman:
              </label>
              <button
                onClick={() => setShowZoneSelector(!showZoneSelector)}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {selectedZoneData?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedZoneData?.distance} •{" "}
                    {shippingCost === 0
                      ? "Gratis"
                      : formatCurrency(shippingCost)}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showZoneSelector ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Zone Options */}
            {showZoneSelector && (
              <div className="space-y-2 mb-4">
                {DELIVERY_ZONES.map((zone) => {
                  const zoneCost = calculateShippingCost(zone.id, cartSubtotal);
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone.id);
                        setShowZoneSelector(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedZone === zone.id
                          ? "bg-amber-50 border-amber-300 text-amber-900"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{zone.name}</div>
                          <div className="text-sm text-gray-600">
                            {zone.distance} • {zone.description}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {zoneCost === 0 ? (
                            <span className="text-green-600">Gratis</span>
                          ) : (
                            formatCurrency(zoneCost)
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer - Order Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ongkos Kirim ({selectedZoneData?.name})</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    formatCurrency(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-amber-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l.01.01M12 21a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              Checkout ({getTotalItems()} item)
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
