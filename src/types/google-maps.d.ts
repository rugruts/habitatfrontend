declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
      getPosition(): LatLng;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      styles?: MapTypeStyle[];
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      draggable?: boolean;
    }

    interface InfoWindowOptions {
      content?: string | Element;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
      anchor?: Point;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: any[];
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface MapMouseEvent {
      latLng?: LatLng;
    }

    const Map: new (mapDiv: HTMLElement, opts?: MapOptions) => Map;
    const Marker: new (opts?: MarkerOptions) => Marker;
    const InfoWindow: new (opts?: InfoWindowOptions) => InfoWindow;
    const LatLng: new (lat: number, lng: number) => LatLng;
  }
}

export {};
