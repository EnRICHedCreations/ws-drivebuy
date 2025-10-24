export interface Lead {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  
  // Location
  address: string;
  lat: number;
  lng: number;
  pov: {
    heading: number;
    pitch: number;
    zoom: number;
  };
  
  // Property details
  propertyType: 'sfh' | 'duplex' | 'multi' | 'vacant' | 'commercial';
  estimatedValue?: number;
  
  // Distress indicators
  distressScore: number; // 0-100
  indicators: {
    overgrownLawn: boolean;
    boardedWindows: boolean;
    roofDamage: boolean;
    peelingPaint: boolean;
    brokenFences: boolean;
    forSaleSign: boolean;
    codeViolations: boolean;
    other: string[];
  };
  
  // User input
  notes: string;
  priorityRating: 1 | 2 | 3 | 4 | 5;
  screenshots: string[];
  tags: string[];
  
  // Status
  status: 'new' | 'contacted' | 'qualified' | 'dead' | 'closed';
  claimedBy?: string;
  sharedWith: string[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  stats: {
    leadsTagged: number;
    leadsShared: number;
    currentStreak: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    defaultLocation: { lat: number; lng: number };
    autoSave: boolean;
  };
}

export interface Route {
  id: string;
  name: string;
  userId: string;
  waypoints: Array<{ lat: number; lng: number; address: string }>;
  createdAt: number;
}
