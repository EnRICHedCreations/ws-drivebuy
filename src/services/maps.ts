import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

export const initGoogleMaps = async () => {
  return await loader.load();
};

export const createStreetViewPanorama = (
  element: HTMLElement,
  options: google.maps.StreetViewPanoramaOptions
): google.maps.StreetViewPanorama => {
  return new google.maps.StreetViewPanorama(element, {
    addressControl: true,
    linksControl: true,
    panControl: true,
    enableCloseButton: false,
    fullscreenControl: false,
    ...options
  });
};

export const geocodeAddress = async (address: string): Promise<google.maps.GeocoderResult | null> => {
  const geocoder = new google.maps.Geocoder();
  try {
    const result = await geocoder.geocode({ address });
    return result.results[0] || null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const geocoder = new google.maps.Geocoder();
  try {
    const result = await geocoder.geocode({ location: { lat, lng } });
    return result.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};
