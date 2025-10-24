import React, { useRef, useEffect } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { MapPin, Search } from 'lucide-react';

interface MapViewProps {
  onLocationTag: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ onLocationTag }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { panorama, isLoaded, error, moveTo } = useGoogleMaps(mapRef);
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ address: searchValue });
      const location = result.results[0]?.geometry.location;
      if (location) {
        moveTo(location.lat(), location.lng());
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error loading map</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Street View...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search address or neighborhood..."
            className="flex-1 px-4 py-3 rounded-lg shadow-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Tag Button */}
      <button
        onClick={onLocationTag}
        className="absolute bottom-8 right-8 z-10 px-6 py-4 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition transform hover:scale-110 flex items-center gap-2 font-semibold"
      >
        <MapPin size={24} />
        Tag Property
      </button>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};