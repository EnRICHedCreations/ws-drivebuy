import Dexie, { Table } from 'dexie';
import { Lead, Route } from '../types';

class VDFDDatabase extends Dexie {
  leads!: Table<Lead, string>;
  routes!: Table<Route, string>;

  constructor() {
    super('VDFDDatabase');
    this.version(1).stores({
      leads: 'id, userId, createdAt, status, priorityRating',
      routes: 'id, userId, createdAt'
    });
  }
}

export const db = new VDFDDatabase();

// Lead operations
export const saveLeadLocally = async (lead: Lead): Promise<void> => {
  await db.leads.put(lead);
};

export const getLocalLeads = async (userId: string): Promise<Lead[]> => {
  return await db.leads.where('userId').equals(userId).toArray();
};

export const deleteLeadLocally = async (id: string): Promise<void> => {
  await db.leads.delete(id);
};

// Sync with Firestore (called on internet connection)
export const syncWithFirestore = async (userId: string): Promise<void> => {
  // Implementation for syncing IndexedDB with Firestore
  // This allows offline-first functionality
};