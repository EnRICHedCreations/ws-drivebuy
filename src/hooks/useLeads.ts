import { useState, useEffect } from 'react';
import { Lead } from '../types';
import { saveLeadLocally, getLocalLeads, deleteLeadLocally } from '../services/storage';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../services/firebase';

export const useLeads = (userId: string) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Load leads from IndexedDB first (offline-first)
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const localLeads = await getLocalLeads(userId);
        setLeads(localLeads);
        setLoading(false);
      } catch (err) {
        console.error('Error loading leads:', err);
        setLoading(false);
      }
    };

    if (userId) {
      loadLeads();
    }
  }, [userId]);

  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Save locally first
    await saveLeadLocally(newLead);
    setLeads(prev => [newLead, ...prev]);

    // Sync to Firestore in background
    try {
      await setDoc(doc(db, COLLECTIONS.LEADS, newLead.id), newLead);
    } catch (err) {
      console.error('Error syncing to Firestore:', err);
    }

    return newLead;
  };

  const deleteLead = async (id: string) => {
    // Delete locally
    await deleteLeadLocally(id);
    setLeads(prev => prev.filter(l => l.id !== id));

    // Delete from Firestore
    try {
      await deleteDoc(doc(db, COLLECTIONS.LEADS, id));
    } catch (err) {
      console.error('Error deleting from Firestore:', err);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const updatedLead = {
      ...leads.find(l => l.id === id)!,
      ...updates,
      updatedAt: Date.now()
    };

    await saveLeadLocally(updatedLead as Lead);
    setLeads(prev => prev.map(l => l.id === id ? updatedLead as Lead : l));

    try {
      await setDoc(doc(db, COLLECTIONS.LEADS, id), updatedLead);
    } catch (err) {
      console.error('Error updating Firestore:', err);
    }
  };

  return { leads, loading, addLead, deleteLead, updateLead };
};