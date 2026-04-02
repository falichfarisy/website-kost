declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    interface MapConstructor {
      new(mapDiv: Element, options?: MapOptions): Map;
    }

    interface MapOptions {
      center?: { lat: number; lng: number };
      zoom?: number;
    }

    class Map {
      constructor(mapDiv: Element, options?: MapOptions);
    }

    interface MarkerConstructor {
      new(options: MarkerOptions): Marker;
    }

    interface MarkerOptions {
      position: { lat: number; lng: number };
      map?: Map;
      title?: string;
    }

    class Marker {
      constructor(options: MarkerOptions);
    }
  }
}

export {};
