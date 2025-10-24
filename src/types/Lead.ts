/**
 * Lead.ts
 * Type definitions for property leads in Virtual Driving for Dollars
 * Path: src/types/Lead.ts
 */

export type PropertyType = 'sfh' | 'duplex' | 'multi' | 'vacant' | 'commercial';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'dead' | 'closed';

export type PriorityRating = 1 | 2 | 3 | 4 | 5;

/**
 * Street View Point of View (camera angle)
 */
export interface StreetViewPOV {
  heading: number;  // 0-360 degrees (compass direction)
  pitch: number;    // -90 to 90 degrees (up/down tilt)
  zoom: number;     // 0-5 (zoom level)
}

/**
 * Distress indicators for property condition assessment
 */
export interface DistressIndicators {
  overgrownLawn: boolean;
  boardedWindows: boolean;
  roofDamage: boolean;
  peelingPaint: boolean;
  brokenFences: boolean;
  forSaleSign: boolean;
  codeViolations: boolean;
  other: string[];  // Custom indicators
}

/**
 * Main Lead interface representing a tagged property
 */
export interface Lead {
  // Identifiers
  id: string;
  userId: string;
  
  // Timestamps
  createdAt: number;  // Unix timestamp (ms)
  updatedAt: number;  // Unix timestamp (ms)
  
  // Location data
  address: string;
  lat: number;
  lng: number;
  pov: StreetViewPOV;
  
  // Property details
  propertyType: PropertyType;
  estimatedValue?: number;  // Optional estimated market value
  
  // Distress assessment
  distressScore: number;  // 0-100 calculated score
  indicators: DistressIndicators;
  
  // User input
  notes: string;
  priorityRating: PriorityRating;
  screenshots: string[];  // Base64 or URLs
  tags: string[];  // Custom tags
  
  // Lead management
  status: LeadStatus;
  claimedBy?: string;  // User ID who claimed this lead
  sharedWith: string[];  // Array of user IDs or 'public'
  
  // Optional marketing data
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  lastContactDate?: number;  // Unix timestamp
  
  // Optional financial data
  arv?: number;  // After Repair Value
  repairEstimate?: number;
  maxOffer?: number;
}

/**
 * Partial lead for creation (before ID assignment)
 */
export type LeadInput = Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

/**
 * Lead update payload (all fields optional except ID)
 */
export type LeadUpdate = Partial<Omit<Lead, 'id' | 'userId' | 'createdAt'>> & {
  id: string;
};

/**
 * Lead filter options for querying
 */
export interface LeadFilterOptions {
  status?: LeadStatus | LeadStatus[];
  propertyType?: PropertyType | PropertyType[];
  priorityRating?: PriorityRating | PriorityRating[];
  minDistressScore?: number;
  maxDistressScore?: number;
  startDate?: number;  // Unix timestamp
  endDate?: number;    // Unix timestamp
  tags?: string[];
  sharedWithMe?: boolean;
}

/**
 * Lead statistics for analytics
 */
export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  byPropertyType: Record<PropertyType, number>;
  byPriority: Record<PriorityRating, number>;
  averageDistressScore: number;
  totalValue?: number;  // Sum of estimated values
  thisWeek: number;
  thisMonth: number;
}

/**
 * Export options for lead data
 */
export interface LeadExportOptions {
  format: 'csv' | 'json' | 'pdf';
  includeScreenshots?: boolean;
  includeNotes?: boolean;
  filters?: LeadFilterOptions;
}

/**
 * Utility function to calculate distress score
 */
export const calculateDistressScore = (indicators: DistressIndicators): number => {
  const booleanIndicators = Object.entries(indicators)
    .filter(([key]) => key !== 'other')
    .filter(([_, value]) => value === true)
    .length;
  
  const otherIndicators = indicators.other.length;
  const totalIndicators = booleanIndicators + otherIndicators;
  const maxIndicators = 7 + otherIndicators;
  
  return Math.min(100, Math.round((totalIndicators / maxIndicators) * 100));
};

/**
 * Utility function to get priority label
 */
export const getPriorityLabel = (rating: PriorityRating): string => {
  const labels: Record<PriorityRating, string> = {
    1: 'Very Low',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Very High'
  };
  return labels[rating];
};

/**
 * Utility function to get status label with color
 */
export const getStatusConfig = (status: LeadStatus): { label: string; color: string } => {
  const configs: Record<LeadStatus, { label: string; color: string }> = {
    new: { label: 'New Lead', color: 'blue' },
    contacted: { label: 'Contacted', color: 'yellow' },
    qualified: { label: 'Qualified', color: 'green' },
    dead: { label: 'Dead Lead', color: 'red' },
    closed: { label: 'Closed Deal', color: 'purple' }
  };
  return configs[status];
};

/**
 * Default lead values for form initialization
 */
export const DEFAULT_LEAD: LeadInput = {
  address: '',
  lat: 0,
  lng: 0,
  pov: {
    heading: 0,
    pitch: 0,
    zoom: 1
  },
  propertyType: 'sfh',
  distressScore: 0,
  indicators: {
    overgrownLawn: false,
    boardedWindows: false,
    roofDamage: false,
    peelingPaint: false,
    brokenFences: false,
    forSaleSign: false,
    codeViolations: false,
    other: []
  },
  notes: '',
  priorityRating: 3,
  screenshots: [],
  tags: [],
  status: 'new',
  sharedWith: []
};