"use client";
import { useState } from 'react';
import { getZoneByArea, DELIVERY_ZONES } from '@/utils/deliveryZones';

export default function ZoneAreaLookup({ onZoneSelect }) {
  const [searchArea, setSearchArea] = useState('');
  const [suggestedZone, setSuggestedZone] = useState(null);

  const handleAreaSearch = (area) => {
    setSearchArea(area);
    if (area.length > 2) {
      const zone = getZoneByArea(area);
      setSuggestedZone(zone);
    } else {
      setSuggestedZone(null);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        🔍 Cari berdasarkan area/alamat:
      </label>
      <input
        type="text"
        value={searchArea}
        onChange={(e) => handleAreaSearch(e.target.value)}
        placeholder="Contoh: Mall Central, Perumahan X, dll"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
      />
      
      {suggestedZone && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">
            💡 Kami sarankan zona: <strong>{suggestedZone.name}</strong>
          </p>
          <button
            onClick={() => onZoneSelect(suggestedZone.id)}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Pilih Zona Ini
          </button>
        </div>
      )}
    </div>
  );
}