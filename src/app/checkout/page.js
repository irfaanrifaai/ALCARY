"use client";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { DELIVERY_ZONES, calculateShippingCost } from "@/utils/deliveryZones";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [selectedZone, setSelectedZone] = useState('pickup');

  useEffect(() => {
    // Load saved zone from CartModal
    const savedZone = localStorage.getItem('selectedDeliveryZone');
    if (savedZone) {
      try {
        const zoneData = JSON.parse(savedZone);
        setSelectedZone(zoneData.id);
      } catch (error) {
        console.error('Error loading saved zone:', error);
      }
    }
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Keranjang Kosong</h1>
          <p className="text-gray-600 mb-8">Silakan pilih produk terlebih dahulu</p>
          <a href="/products" className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
            Lihat Produk
          </a>
        </div>
      </div>
    );
  }

  const shippingCost = calculateShippingCost(selectedZone, cartSubtotal);
  const total = cartSubtotal + shippingCost;
  const selectedZoneData = DELIVERY_ZONES.find(z => z.id === selectedZone);

  const createDetailedWhatsAppMessage = () => {
    const currentDate = new Date().toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    
    let message = `🍞 *PESANAN ROTI ALCARY* 🧁\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `👤 *DATA PELANGGAN:*\n`;
    message += `Nama: *${customerInfo.name}*\n`;
    message += `HP: ${customerInfo.phone}\n`;
    if (selectedZone !== 'pickup' && customerInfo.address) {
      message += `Alamat: ${customerInfo.address}\n`;
    }
    if (customerInfo.notes) {
      message += `Catatan: _${customerInfo.notes}_\n`;
    }
    message += `\n📅 *Tanggal:* ${currentDate}\n\n`;
    
    message += `🛒 *DETAIL PESANAN:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    cartItems.forEach((item, index) => {
      const itemPrice = item.selling_price || item.price || 0;
      const itemTotal = itemPrice * item.quantity;
      
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Kategori: ${item.category}\n`;
      message += `   ${formatCurrency(itemPrice)} x ${item.quantity} = *${formatCurrency(itemTotal)}*\n\n`;
    });
    
    message += `🚚 *PENGIRIMAN:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Metode: *${selectedZoneData?.name}*\n`;
    message += `${selectedZone === 'pickup' ? 'Ambil di toko' : `Jarak: ${selectedZoneData?.distance}`}\n`;
    message += `Ongkir: *${shippingCost === 0 ? 'GRATIS ✅' : formatCurrency(shippingCost)}*\n\n`;
    
    message += `💰 *TOTAL PEMBAYARAN:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Subtotal: ${formatCurrency(cartSubtotal)}\n`;
    message += `Ongkir: ${shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}\n`;
    message += `*TOTAL: ${formatCurrency(total)}*\n\n`;
    
    message += `📝 *KONFIRMASI PESANAN:*\n`;
    message += `Mohon balas dengan "YA PESAN" untuk konfirmasi\n\n`;
    
    message += `🙏 _Terima kasih telah memilih Roti Alcary!_`;
    
    return message;
  };

  const handleWhatsAppCheckout = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert("Nama dan nomor HP wajib diisi!");
      return;
    }

    if (selectedZone !== 'pickup' && !customerInfo.address) {
      alert("Alamat wajib diisi untuk pengiriman!");
      return;
    }

    const message = createDetailedWhatsAppMessage();
    const phoneNumber = "6282152673902";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Clear cart
    clearCart();
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Redirect to success page
    window.location.href = '/order-success';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout Pesanan</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Informasi Pelanggan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="082xxxxxxxxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Zona Pengiriman</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  {DELIVERY_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} - {zone.distance} ({zone.cost === 0 ? 'Gratis' : formatCurrency(zone.cost)})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedZone !== 'pickup' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Alamat Lengkap *</label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({...prev, address: e.target.value}))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-24"
                    placeholder="Masukkan alamat lengkap dengan patokan yang jelas"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Catatan (Opsional)</label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, notes: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-20"
                  placeholder="Catatan khusus untuk pesanan Anda"
                />
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-sm text-amber-600">
                      {formatCurrency(item.selling_price || item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency((item.selling_price || item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim ({selectedZoneData?.name})</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    formatCurrency(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total</span>
                <span className="text-amber-600">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg mt-6 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.386"/>
              </svg>
              Pesan via WhatsApp
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Pesanan akan dikirim ke WhatsApp untuk konfirmasi lebih lanjut
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}