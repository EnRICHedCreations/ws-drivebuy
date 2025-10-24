/**
 * Route.ts
 * Type definitions for driving routes in Virtual Driving for Dollars
 * Path: src/types/Route.ts
 */

import type { Lead } from '../types/Lead';

/**
 * Geographic coordinate
 */
export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * Waypoint in a route (stop location)
 */
export interface Waypoint extends Coordinate {
  address: string;
  order: number;  // Sequence in the route
  notes?: string;
  estimatedArrivalTime?: number;  // Unix timestamp
  visitDuration?: number;  // Minutes
  completed?: boolean;
  leadId?: string;  // Optional associated lead ID
}

/**
 * Route statistics
 */
export interface RouteStats {
  totalDistance: number;  // Miles or kilometers
  totalDuration: number;  // Minutes
  estimatedCost?: number;  // Gas cost estimate
  waypointCount: number;
  completedCount: number;
  lastUpdated: number;  // Unix timestamp
}

/**
 * Route optimization options
 */
export interface RouteOptimizationOptions {
  optimizeFor: 'distance' | 'time' | 'cost';
  avoidHighways?: boolean;
  avoidTolls?: boolean;
  startTime?: number;  // Unix timestamp for traffic consideration
  vehicleMpg?: number;  // For cost calculation
  gasPrice?: number;  // Per gallon/liter
}

/**
 * Main Route interface
 */
export interface Route {
  // Identifiers
  id: string;
  userId: string;
  
  // Metadata
  name: string;
  description?: string;
  createdAt: number;  // Unix timestamp
  updatedAt: number;
  
  // Route data
  waypoints: Waypoint[];
  startLocation?: Coordinate & { address: string };
  endLocation?: Coordinate & { address: string };
  
  // Statistics
  stats: RouteStats;
  
  // Settings
  isOptimized: boolean;
  optimizationOptions?: RouteOptimizationOptions;
  
  // Sharing & collaboration
  sharedWith: string[];  // User IDs
  isPublic: boolean;
  
  // Schedule
  scheduledDate?: number;  // Unix timestamp
  completedDate?: number;  // Unix timestamp
  
  // Tags & organization
  tags: string[];
  color?: string;  // Hex color for map display
  
  // Status
  status: 'draft' | 'planned' | 'in-progress' | 'completed' | 'archived';
}

/**
 * Partial route for creation
 */
export type RouteInput = Omit<Route, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'stats'>;

/**
 * Route update payload
 */
export type RouteUpdate = Partial<Omit<Route, 'id' | 'userId' | 'createdAt'>> & {
  id: string;
};

/**
 * Route template for quick route creation
 */
export interface RouteTemplate {
  id: string;
  name: string;
  description: string;
  waypoints: Omit<Waypoint, 'leadId' | 'completed' | 'estimatedArrivalTime'>[];
  category: string;
  usageCount: number;
  createdBy: string;
  isPublic: boolean;
}

/**
 * Route navigation step (turn-by-turn)
 */
export interface NavigationStep {
  instruction: string;
  distance: number;  // In meters
  duration: number;  // In seconds
  startLocation: Coordinate;
  endLocation: Coordinate;
  maneuver?: string;  // e.g., 'turn-left', 'turn-right'
}

/**
 * Route directions (full navigation data)
 */
export interface RouteDirections {
  routeId: string;
  steps: NavigationStep[];
  overview: {
    totalDistance: number;
    totalDuration: number;
    bounds: {
      northeast: Coordinate;
      southwest: Coordinate;
    };
  };
  polyline: string;  // Encoded polyline for map display
  generatedAt: number;  // Unix timestamp
}

/**
 * Route filter options
 */
export interface RouteFilterOptions {
  status?: Route['status'] | Route['status'][];
  startDate?: number;
  endDate?: number;
  tags?: string[];
  sharedWithMe?: boolean;
  isPublic?: boolean;
  hasScheduledDate?: boolean;
}

/**
 * Route builder session (for UI state management)
 */
export interface RouteBuilderSession {
  routeId?: string;
  waypoints: Waypoint[];
  isDirty: boolean;  // Has unsaved changes
  lastSaved?: number;  // Unix timestamp
  selectedWaypointIndex?: number;
}

/**
 * Utility function to calculate route distance
 */
export const calculateRouteDistance = (waypoints: Waypoint[]): number => {
  if (waypoints.length < 2) return 0;
  
  let totalDistance = 0;
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const distance = calculateDistanceBetweenPoints(
      waypoints[i],
      waypoints[i + 1]
    );
    totalDistance += distance;
  }
  
  return totalDistance;
};

/**
 * Utility function to calculate distance between two points (Haversine formula)
 */
export const calculateDistanceBetweenPoints = (
  point1: Coordinate,
  point2: Coordinate
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
    Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Utility function to estimate route duration
 */
export const estimateRouteDuration = (
  distance: number,
  averageSpeed: number = 30 // mph
): number => {
  return Math.round((distance / averageSpeed) * 60); // Convert to minutes
};

/**
 * Utility function to create waypoint from lead
 */
export const createWaypointFromLead = (lead: Lead, order: number): Waypoint => {
  return {
    lat: lead.lat,
    lng: lead.lng,
    address: lead.address,
    order,
    notes: lead.notes,
    leadId: lead.id,
    completed: false
  };
};

/**
 * Utility function to optimize waypoint order (simple nearest neighbor)
 */
export const optimizeWaypointOrder = (
  waypoints: Waypoint[],
  startPoint?: Coordinate
): Waypoint[] => {
  if (waypoints.length <= 2) return waypoints;
  
  const optimized: Waypoint[] = [];
  const remaining = [...waypoints];
  let current = startPoint || waypoints[0];
  
  // Remove start point if it's in the waypoints
  if (!startPoint) {
    optimized.push(remaining.shift()!);
  }
  
  while (remaining.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;
    
    remaining.forEach((waypoint, index) => {
      const distance = calculateDistanceBetweenPoints(current, waypoint);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });
    
    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimized.push(nearest);
    current = nearest;
  }
  
  // Reorder the waypoints
  return optimized.map((waypoint, index) => ({
    ...waypoint,
    order: index + 1
  }));
};

/**
 * Default route values
 */
export const DEFAULT_ROUTE: Omit<RouteInput, 'name' | 'waypoints'> = {
  description: '',
  isOptimized: false,
  sharedWith: [],
  isPublic: false,
  tags: [],
  status: 'draft'
};

/**
 * Route status configuration
 */
export const getRouteStatusConfig = (status: Route['status']): { label: string; color: string } => {
  const configs: Record<Route['status'], { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'gray' },
    planned: { label: 'Planned', color: 'blue' },
    'in-progress': { label: 'In Progress', color: 'yellow' },
    completed: { label: 'Completed', color: 'green' },
    archived: { label: 'Archived', color: 'gray' }
  };
  return configs[status];
};