export const DELIVERY_ZONES = [
  { 
    id: 'pickup', 
    name: 'Ambil di Toko', 
    distance: '0 km', 
    cost: 0, 
    description: 'Gratis',
    areas: ['Toko Roti Alcary']
  },
  { 
    id: 'zone1', 
    name: 'Zona 1', 
    distance: '0-3 km', 
    cost: 8000, 
    description: 'Sekitar toko',
    areas: ['Pusat Kota', 'Mall Central', 'Kelurahan A', 'Kelurahan B', 'Pasar Utama', 'Sekolah Negeri 1']
  },
  { 
    id: 'zone2', 
    name: 'Zona 2', 
    distance: '3-7 km', 
    cost: 12000, 
    description: 'Dalam kota',
    areas: ['Perumahan X', 'Kelurahan C', 'Kelurahan D', 'Terminal Bus', 'Rumah Sakit Umum', 'Mall Pinggiran']
  },
  { 
    id: 'zone3', 
    name: 'Zona 3', 
    distance: '7-15 km', 
    cost: 18000, 
    description: 'Pinggiran kota',
    areas: ['Kecamatan Y', 'Perumahan Z', 'Kampus ABC', 'Industri Area', 'Desa Terdekat', 'Area Perbatasan']
  }
];

export const calculateShippingCost = (zoneId, orderValue) => {
  const zone = DELIVERY_ZONES.find(z => z.id === zoneId);
  if (!zone || zoneId === 'pickup') return 0;
  
  // Free shipping policy - lebih rendah karena zona maksimal 3
  const freeShippingThreshold = 100000; // Turun dari 150k ke 100k
  if (orderValue >= freeShippingThreshold) {
    return 0; // Semua zona dapat free shipping
  }
  
  return zone.cost;
};

export const getZoneByArea = (area) => {
  const zone = DELIVERY_ZONES.find(zone => 
    zone.areas.some(zoneArea => 
      zoneArea.toLowerCase().includes(area.toLowerCase()) ||
      area.toLowerCase().includes(zoneArea.toLowerCase())
    )
  );
  
  return zone || DELIVERY_ZONES.find(z => z.id === 'zone3'); // Default to zone 3 (terjauh)
};

// Helper function untuk mendapatkan info zona
export const getZoneInfo = (zoneId) => {
  return DELIVERY_ZONES.find(z => z.id === zoneId);
};

// Helper function untuk cek apakah eligible free shipping
export const isEligibleFreeShipping = (orderValue, zoneId) => {
  if (zoneId === 'pickup') return true;
  return orderValue >= 100000;
};