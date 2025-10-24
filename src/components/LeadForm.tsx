import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import type { Lead } from '../types';
import html2canvas from 'html2canvas';

interface LeadFormProps {
  location: {
    lat: number;
    lng: number;
    heading: number;
    pitch: number;
    zoom: number;
    address: string;
  };
  onSave: (lead: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ location, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    propertyType: 'sfh' as Lead['propertyType'],
    estimatedValue: '',
    notes: '',
    priorityRating: 3 as Lead['priorityRating'],
    indicators: {
      overgrownLawn: false,
      boardedWindows: false,
      roofDamage: false,
      peelingPaint: false,
      brokenFences: false,
      forSaleSign: false,
      codeViolations: false,
      other: [] as string[]
    },
    tags: [] as string[],
    screenshots: [] as string[]
  });

  const indicators = [
    { key: 'overgrownLawn', label: 'Overgrown Lawn' },
    { key: 'boardedWindows', label: 'Boarded Windows' },
    { key: 'roofDamage', label: 'Roof Damage' },
    { key: 'peelingPaint', label: 'Peeling Paint' },
    { key: 'brokenFences', label: 'Broken Fences' },
    { key: 'forSaleSign', label: 'For Sale Sign' },
    { key: 'codeViolations', label: 'Code Violations' }
  ];

  const calculateDistressScore = () => {
    const checkedCount = Object.values(formData.indicators).filter(Boolean).length;
    return Math.min(100, Math.round((checkedCount / 7) * 100));
  };

  const handleScreenshot = async () => {
    const mapElement = document.querySelector('.map-container') as HTMLElement;
    if (!mapElement) return;

    try {
      const canvas = await html2canvas(mapElement);
      const screenshot = canvas.toDataURL('image/png');
      setFormData(prev => ({
        ...prev,
        screenshots: [...prev.screenshots, screenshot]
      }));
    } catch (err) {
      console.error('Screenshot error:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      address: location.address,
      lat: location.lat,
      lng: location.lng,
      pov: {
        heading: location.heading,
        pitch: location.pitch,
        zoom: location.zoom
      },
      propertyType: formData.propertyType,
      estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
      distressScore: calculateDistressScore(),
      indicators: formData.indicators,
      notes: formData.notes,
      priorityRating: formData.priorityRating,
      screenshots: formData.screenshots,
      tags: formData.tags,
      status: 'new',
      sharedWith: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Tag Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={location.address}
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as Lead['propertyType'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="sfh">Single Family Home</option>
              <option value="duplex">Duplex</option>
              <option value="multi">Multi-Family</option>
              <option value="vacant">Vacant Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Estimated Value */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Value (Optional)</label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              placeholder="e.g., 250000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Priority Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority Rating: {formData.priorityRating}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.priorityRating}
              onChange={(e) => setFormData({ ...formData, priorityRating: parseInt(e.target.value) as Lead['priorityRating'] })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Distress Indicators */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Distress Indicators (Score: {calculateDistressScore()}/100)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {indicators.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.indicators[key as keyof typeof formData.indicators] as boolean}
                    onChange={(e) => setFormData({
                      ...formData,
                      indicators: {
                        ...formData.indicators,
                        [key]: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional observations..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Screenshot */}
          <div>
            <button
              type="button"
              onClick={handleScreenshot}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Camera size={20} />
              Capture Screenshot ({formData.screenshots.length})
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;