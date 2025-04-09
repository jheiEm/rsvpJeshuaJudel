// Common types used throughout the application

export interface WeddingEvent {
  title: string;
  time: string;
  description: string;
}

export interface Location {
  name: string;
  address: string[];
  coordinates: [number, number]; // [latitude, longitude]
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ContactInfo {
  icon: string;
  title: string;
  details: string[];
}
