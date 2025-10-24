import React, { useState } from 'react';
import { Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import { Lead } from '../types';
import { exportToCSV, exportToJSON, exportToPDF } from '../utils/export';

interface ExportButtonProps {
  leads: Lead[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ leads }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    if (format === 'csv') exportToCSV(leads);
    if (format === 'json') exportToJSON(leads);
    if (format === 'pdf') exportToPDF(leads);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={leads.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Download size={20} />
        Export ({leads.length})
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] z-20">
            <button
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
            >
              <FileSpreadsheet size={18} />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
            >
              <FileJson size={18} />
              <span>JSON</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
            >
              <FileText size={18} />
              <span>PDF</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};