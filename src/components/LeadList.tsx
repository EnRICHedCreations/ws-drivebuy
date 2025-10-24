import React, { useState } from 'react';
import { Lead } from '../types';
import { Trash2, ExternalLink, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface LeadListProps {
  leads: Lead[];
  onDelete: (id: string) => void;
  onLeadClick: (lead: Lead) => void;
}

export const LeadList: React.FC<LeadListProps> = ({ leads, onDelete, onLeadClick }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true;
    if (filter === 'high') return lead.priorityRating >= 4;
    if (filter === 'medium') return lead.priorityRating === 3;
    if (filter === 'low') return lead.priorityRating <= 2;
    return true;
  });

  const getPriorityColor = (rating: number) => {
    if (rating >= 4) return 'bg-red-100 text-red-800 border-red-300';
    if (rating === 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getPriorityStars = (rating: number) => '⭐'.repeat(rating);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          My Leads ({filteredLeads.length})
        </h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              filter === 'high' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              filter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              filter === 'low' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low
          </button>
        </div>
      </div>

      {/* Lead List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No leads yet</p>
            <p className="text-sm">Start tagging properties to build your pipeline</p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <div
              key={lead.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
              onClick={() => onLeadClick(lead)}
            >
              {/* Priority Badge */}
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(lead.priorityRating)}`}>
                  {getPriorityStars(lead.priorityRating)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lead.id);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Address */}
              <h3 className="font-semibold text-gray-900 mb-1">{lead.address}</h3>

              {/* Property Type */}
              <div className="text-sm text-gray-600 mb-2">
                {lead.propertyType.toUpperCase()}
                {lead.estimatedValue && (
                  <span className="ml-2">
                    • ${lead.estimatedValue.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Distress Score */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Distress Score</span>
                  <span className="font-semibold">{lead.distressScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      lead.distressScore >= 70 ? 'bg-red-500' :
                      lead.distressScore >= 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${lead.distressScore}%` }}
                  />
                </div>
              </div>

              {/* Active Indicators */}
              <div className="flex flex-wrap gap-1 mb-2">
                {Object.entries(lead.indicators).filter(([_, value]) => value === true).slice(0, 3).map(([key]) => (
                  <span key={key} className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
                {Object.entries(lead.indicators).filter(([_, value]) => value === true).length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{Object.entries(lead.indicators).filter(([_, value]) => value === true).length - 3} more
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="text-xs text-gray-500">
                Tagged {format(lead.createdAt, 'MMM d, yyyy')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};