import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export const initGoogleMaps = async () => {
  // Set the API key and options
  setOptions({
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  // Import the required libraries
  await Promise.all([
    importLibrary('places'),
    importLibrary('geometry')
  ]);
};

export const createStreetViewPanorama = (
  element: HTMLElement,
  options: any
): any => {
  return new (window as any).google.maps.StreetViewPanorama(element, {
    addressControl: true,
    linksControl: true,
    panControl: true,
    enableCloseButton: false,
    fullscreenControl: false,
    ...options
  });
};

export const geocodeAddress = async (address: string): Promise<any | null> => {
  const geocoder = new (window as any).google.maps.Geocoder();
  try {
    const result = await geocoder.geocode({ address });
    return result.results[0] || null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const geocoder = new (window as any).google.maps.Geocoder();
  try {
    const result = await geocoder.geocode({ location: { lat, lng } });
    return result.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};
