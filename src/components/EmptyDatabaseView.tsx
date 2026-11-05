import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { generateEnergyStarCsvTemplate } from '../db/iceMachinesDb';

interface EmptyDatabaseViewProps {
  onOpenFileSelect: (file: File) => void;
  onOpenImporterModal: () => void;
  onLoadSampleData: () => void;
}

export const EmptyDatabaseView: React.FC<EmptyDatabaseViewProps> = ({
  onOpenFileSelect,
  onOpenImporterModal,
  onLoadSampleData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv') || file.type.includes('csv') || file.type.includes('text')) {
        onOpenFileSelect(file);
      }
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateEnergyStarCsvTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ENERGY_STAR_Commercial_Ice_Makers_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const schemaColumns = [
    {
      govHeader: 'ENERGY STAR Partner / Brand Name',
      appField: 'Brand',
      desc: 'e.g. Scotsman, Manitowoc, Hoshizaki, Follett',
      type: 'Text',
    },
    {
      govHeader: 'Model Number',
      appField: 'Model #',
      desc: 'Unique commercial equipment part number',
      type: 'Alphanumeric',
    },
    {
      govHeader: 'Ice Type',
      appField: 'Ice Form',
      desc: 'Cube, Nugget, Flake, Crescent, Gourmet',
      type: 'Category',
    },
    {
      govHeader: 'Harvest Rate (lbs ice/day)',
      appField: 'Daily Production',
      desc: 'AHRI 810 tested capacity (90°F air / 70°F water)',
      type: 'Integer (lbs)',
    },
    {
      govHeader: 'Energy Use Rate (kWh/100 lbs ice)',
      appField: 'Energy Efficiency',
      desc: 'Kilowatt-hours per hundredweight of ice',
      type: 'Decimal (kWh)',
    },
    {
      govHeader: 'Potable Water Use Rate (gal/100 lbs ice)',
      appField: 'Water Consumption',
      desc: 'Gallons of drinking water per 100 lbs ice',
      type: 'Decimal (gal)',
    },
    {
      govHeader: 'Equipment Type',
      appField: 'Unit Configuration',
      desc: 'IMH (Ice Making Head), SCU (Self-Contained), RCU (Remote)',
      type: 'Category',
    },
    {
      govHeader: 'Condenser Cooling Type',
      appField: 'Cooling Type',
      desc: 'Air-Cooled, Water-Cooled, Remote Air-Cooled',
      type: 'Category',
    },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* Primary Empty State Hero Banner & Dropzone */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-semibold">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Database Ready · Awaiting Government Dataset</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
            Import Your Commercial Ice Machine Specification CSV
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            The database structure, search index, and filtering system are initialized and empty. Drop your ENERGY STAR® Government export CSV file below to ingest machine models.
          </p>

          {/* Interactive Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-6 border-2 border-dashed rounded-xl p-8 sm:p-12 transition-all text-center cursor-pointer ${
              isDragOver
                ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onOpenFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 mx-auto rounded-full bg-blue-100/70 flex items-center justify-center text-blue-600 mb-4">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Drag and drop your ENERGY STAR CSV file here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports official EPA .csv files or custom commercial equipment spec sheets
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Browse CSV File
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadTemplate();
                }}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>
          </div>

          {/* Optional Test Loader */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official EPA ENERGY STAR certified dataset compatibility built-in</span>
            </div>

            <button
              onClick={onLoadSampleData}
              className="font-medium text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              Want to test drive first? Load 20 Real ENERGY STAR Reference Models
            </button>
          </div>
        </div>
      </div>

      {/* Built Empty Specification Table Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Empty Database Specification Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Structured columns awaiting CSV data population
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
            0 Records Loaded
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3">Brand Name</th>
                  <th className="px-4 py-3">Model Number</th>
                  <th className="px-3 py-3">Ice Form</th>
                  <th className="px-3 py-3">Equipment Type</th>
                  <th className="px-4 py-3 text-right">Harvest Rate (lbs/day)</th>
                  <th className="px-4 py-3 text-right">Energy (kWh/100 lbs)</th>
                  <th className="px-4 py-3 text-right">Water (gal/100 lbs)</th>
                  <th className="px-3 py-3">Condenser Cooling</th>
                  <th className="px-3 py-3">Refrigerant</th>
                  <th className="px-3 py-3 text-center">ENERGY STAR®</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((idx) => (
                  <tr key={idx} className="border-b border-slate-100 text-slate-300">
                    <td className="px-4 py-3 italic">Awaiting CSV import...</td>
                    <td className="px-4 py-3 italic font-mono">—</td>
                    <td className="px-3 py-3 italic">—</td>
                    <td className="px-3 py-3 italic font-mono">—</td>
                    <td className="px-4 py-3 text-right italic font-mono">—</td>
                    <td className="px-4 py-3 text-right italic font-mono">—</td>
                    <td className="px-4 py-3 text-right italic font-mono">—</td>
                    <td className="px-3 py-3 italic">—</td>
                    <td className="px-3 py-3 italic font-mono">—</td>
                    <td className="px-3 py-3 text-center italic">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Database Schema Field Specifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="max-w-2xl mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Government CSV Field Mapping Specification</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Our ingestion engine automatically detects and normalizes these standard ENERGY STAR column headers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schemaColumns.map((col) => (
            <div
              key={col.appField}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">
                  {col.appField}
                </span>
                <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {col.type}
                </span>
              </div>
              <div className="text-[11px] font-mono text-blue-700 mt-1 truncate">
                {col.govHeader}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {col.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
