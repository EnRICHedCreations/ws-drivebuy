import { useState, useEffect, useCallback } from 'react';
import { initGoogleMaps, createStreetViewPanorama } from '../services/maps';

export const useGoogleMaps = (elementRef: React.RefObject<HTMLDivElement>) => {
  const [panorama, setPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaps = async () => {
      try {
        await initGoogleMaps();
        setIsLoaded(true);
      } catch (err) {
        setError('Failed to load Google Maps');
        console.error(err);
      }
    };

    loadMaps();
  }, []);

  useEffect(() => {
    if (isLoaded && elementRef.current && !panorama) {
      const newPanorama = createStreetViewPanorama(elementRef.current, {
        position: { lat: 42.6526, lng: -73.7562 }, // Albany, NY
        pov: { heading: 0, pitch: 0 },
        zoom: 1
      });
      setPanorama(newPanorama);
    }
  }, [isLoaded, elementRef, panorama]);

  const moveTo = useCallback((lat: number, lng: number) => {
    if (panorama) {
      panorama.setPosition({ lat, lng });
    }
  }, [panorama]);

  const getCurrentLocation = useCallback(() => {
    if (!panorama) return null;
    const position = panorama.getPosition();
    const pov = panorama.getPov();
    const zoom = panorama.getZoom();
    
    return {
      lat: position?.lat() || 0,
      lng: position?.lng() || 0,
      heading: pov.heading,
      pitch: pov.pitch,
      zoom
    };
  }, [panorama]);

  return { panorama, isLoaded, error, moveTo, getCurrentLocation };
};
