// Google Maps API type declarations
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
        Marker: new (options: google.maps.MarkerOptions) => google.maps.Marker;
        InfoWindow: new (options?: google.maps.InfoWindowOptions) => google.maps.InfoWindow;
        Size: new (width: number, height: number) => google.maps.Size;
        Point: new (x: number, y: number) => google.maps.Point;
        event: {
          clearInstanceListeners: (instance: object) => void;
        };
      };
    };
  }
}

declare namespace google.maps {
  interface Map {
    setCenter(latlng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    addListener(eventName: string, handler: Function): void;
  }

  interface Marker {
    setMap(map: Map | null): void;
    addListener(eventName: string, handler: Function): void;
  }

  interface InfoWindow {
    open(map: Map, anchor?: Marker): void;
    close(): void;
  }

  interface MapOptions {
    zoom: number;
    center: LatLng | LatLngLiteral;
    mapTypeId: string;
    styles?: MapTypeStyle[];
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map: Map;
    title?: string;
    icon?: string | Icon;
  }

  interface InfoWindowOptions {
    content?: string;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapMouseEvent {
    latLng?: LatLng;
  }

  interface Size {
    // Size class methods would go here
  }

  interface Point {
    // Point class methods would go here
  }

  interface Icon {
    url: string;
    scaledSize?: Size;
    anchor?: Point;
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<{ [key: string]: string }>;
  }
}

export {};
