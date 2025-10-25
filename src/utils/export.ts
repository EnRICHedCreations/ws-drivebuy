import type{ Lead } from '../types';
import jsPDF from 'jspdf';

export const exportToCSV = (leads: Lead[]): void => {
  const headers = [
    'Address',
    'Lat',
    'Lng',
    'Priority',
    'Distress Score',
    'Property Type',
    'Estimated Value',
    'Notes',
    'Date Tagged',
    'Status'
  ];

  const rows = leads.map(lead => [
    lead.address,
    lead.lat.toString(),
    lead.lng.toString(),
    lead.priorityRating.toString(),
    lead.distressScore.toString(),
    lead.propertyType,
    lead.estimatedValue?.toString() || '',
    `"${lead.notes.replace(/"/g, '""')}"`,
    new Date(lead.createdAt).toLocaleDateString(),
    lead.status
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  downloadFile(csvContent, `leads-${Date.now()}.csv`, 'text/csv');
};

export const exportToJSON = (leads: Lead[]): void => {
  const jsonContent = JSON.stringify(leads, null, 2);
  downloadFile(jsonContent, `leads-${Date.now()}.json`, 'application/json');
};

export const exportToPDF = async (leads: Lead[]): Promise<void> => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Virtual Driving for Dollars - Lead Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Total Leads: ${leads.length}`, 20, 40);

  let yPos = 50;
  
  leads.slice(0, 20).forEach((lead, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${lead.address}`, 20, yPos);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    doc.text(`Priority: ${'⭐'.repeat(lead.priorityRating)} | Distress: ${lead.distressScore}/100`, 20, yPos);
    
    yPos += 7;
    doc.text(`Type: ${lead.propertyType} | Status: ${lead.status}`, 20, yPos);
    
    if (lead.notes) {
      yPos += 7;
      const splitNotes = doc.splitTextToSize(lead.notes, 170);
      doc.text(splitNotes, 20, yPos);
      yPos += splitNotes.length * 5;
    }
    
    yPos += 10;
  });

  doc.save(`leads-${Date.now()}.pdf`);
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};