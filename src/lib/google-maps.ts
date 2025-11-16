// Google Maps API loader utility
let googleMapsLoaded = false;
let googleMapsLoading = false;
let googleMapsCallbacks: (() => void)[] = [];

export const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (googleMapsLoaded) {
      resolve();
      return;
    }

    if (googleMapsLoading) {
      googleMapsCallbacks.push(resolve);
      return;
    }

    googleMapsLoading = true;

    // Check if Google Maps is already loaded
    if (typeof google !== 'undefined' && google.maps) {
      googleMapsLoaded = true;
      googleMapsLoading = false;
      resolve();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleMapsLoaded = true;
      googleMapsLoading = false;
      resolve();
      googleMapsCallbacks.forEach(callback => callback());
      googleMapsCallbacks = [];
    };

    script.onerror = () => {
      googleMapsLoading = false;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });
};

export const isGoogleMapsLoaded = (): boolean => {
  return googleMapsLoaded && typeof google !== 'undefined' && !!google.maps;
};
