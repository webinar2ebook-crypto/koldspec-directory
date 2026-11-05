import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, FileText, Download, RefreshCw, Database } from 'lucide-react';
import { parseCsvContent, convertRowsToIceMachines, ParseCsvFileResult } from '../utils/csvParser';
import { IceMachine, CsvColumnMapping } from '../types/iceMachine';
import { generateEnergyStarCsvTemplate, getOfficialEnergyStarSampleRecords } from '../db/iceMachinesDb';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (machines: IceMachine[], mode: 'replace' | 'append') => void;
  initialFile?: File | null;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  initialFile,
}) => {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [parseResult, setParseResult] = useState<ParseCsvFileResult | null>(null);
  const [mapping, setMapping] = useState<CsvColumnMapping>({
    brand: '',
    modelNumber: '',
    modelName: '',
    equipmentType: '',
    iceType: '',
    harvestRateLbs: '',
    energyUseRateKwh: '',
    potableWaterUseGal: '',
    condenserCooling: '',
    refrigerant: '',
    energyStarCertified: '',
    certifiedDate: '',
    voltage: '',
  });
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If initial file passed, parse immediately
  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      processFile(initialFile);
    }
  }, [initialFile]);

  if (!isOpen) return null;

  const processFile = async (f: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await parseCsvContent(f);
      if (res.headers.length === 0 || res.allRawRows.length === 0) {
        setErrorMsg('The selected CSV file appears to be empty or has no recognizable rows.');
        setIsProcessing(false);
        return;
      }
      setParseResult(res);
      setMapping(res.detectedMapping as CsvColumnMapping);
    } catch (err: any) {
      setErrorMsg(`Failed to parse CSV file: ${err?.message || 'Unknown parsing error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      processFile(selected);
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

  const handleLoadSample = () => {
    const sample = getOfficialEnergyStarSampleRecords();
    onImportComplete(sample, importMode);
    onClose();
  };

  const handleExecuteImport = () => {
    if (!parseResult) return;
    const { machines, skippedCount } = convertRowsToIceMachines(parseResult.allRawRows, mapping);
    if (machines.length === 0) {
      setErrorMsg('No valid ice machine records could be created. Please verify that Brand and Model Number columns are mapped.');
      return;
    }
    onImportComplete(machines, importMode);
    onClose();
  };

  const requiredFields = [
    { key: 'brand', label: 'Brand / Partner Name', required: true },
    { key: 'modelNumber', label: 'Model Number', required: true },
    { key: 'harvestRateLbs', label: 'Daily Harvest Rate (lbs/day)', required: true },
    { key: 'energyUseRateKwh', label: 'Energy Use Rate (kWh/100 lbs)', required: true },
    { key: 'iceType', label: 'Ice Type / Form', required: false },
    { key: 'potableWaterUseGal', label: 'Water Use (gal/100 lbs)', required: false },
    { key: 'equipmentType', label: 'Equipment Type (IMH/SCU/RCU)', required: false },
    { key: 'condenserCooling', label: 'Condenser Cooling Type', required: false },
    { key: 'refrigerant', label: 'Refrigerant', required: false },
    { key: 'modelName', label: 'Model Family / Name', required: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Import Commercial Ice Machine CSV Data
              </h2>
              <p className="text-xs text-slate-500">
                ENERGY STAR® Government Database & Equipment Spec Ingestion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div>
                <strong className="font-semibold block">Import Warning</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* File Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              1. Select CSV File
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-700 truncate">
                  {file ? file.name : 'Choose ENERGY STAR or commercial ice specs CSV...'}
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Template CSV</span>
              </button>

              <a
                href="/insert_data.sql"
                download="insert_data.sql"
                className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0"
                title="Download complete SQL insert script for Neon SQL Editor"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>insert_data.sql (651 models)</span>
              </a>

              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3.5 py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                title="Populate with authentic EPA ENERGY STAR models"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Load Sample Dataset</span>
              </button>
            </div>
          </div>

          {/* Parse Stats & Column Mapping */}
          {parseResult && (
            <div className="space-y-6 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500">File Loaded:</span>{' '}
                  <strong className="text-slate-800 font-mono">{file?.name}</strong>
                </div>
                <div className="flex items-center gap-4">
                  <span>
                    Rows Found: <strong className="font-mono text-slate-900">{parseResult.allRawRows.length}</strong>
                  </span>
                  <span>
                    Columns: <strong className="font-mono text-slate-900">{parseResult.headers.length}</strong>
                  </span>
                </div>
              </div>

              {/* Column Mapping Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Column Mapping
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Auto-detected based on ENERGY STAR headers. Adjust if necessary.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                  {requiredFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </span>
                      </div>
                      <select
                        value={(mapping as any)[field.key] || ''}
                        onChange={(e) =>
                          setMapping({ ...mapping, [field.key]: e.target.value })
                        }
                        className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800"
                      >
                        <option value="">— Select Column —</option>
                        {parseResult.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Table of First 3 Parsed Rows */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  3. Ingestion Preview (First 3 Rows)
                </label>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      <tr>
                        <th className="px-3 py-2">Brand</th>
                        <th className="px-3 py-2">Model #</th>
                        <th className="px-3 py-2">Ice Form</th>
                        <th className="px-3 py-2 text-right">Harvest (lbs)</th>
                        <th className="px-3 py-2 text-right">Energy (kWh/100)</th>
                        <th className="px-3 py-2 text-right">Water (gal/100)</th>
                        <th className="px-3 py-2">Cooling</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parseResult.sampleRows.slice(0, 3).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium">{r[mapping.brand] || '—'}</td>
                          <td className="px-3 py-2 font-mono">{r[mapping.modelNumber] || '—'}</td>
                          <td className="px-3 py-2">{r[mapping.iceType] || 'Cube'}</td>
                          <td className="px-3 py-2 text-right font-mono">{r[mapping.harvestRateLbs] || '—'}</td>
                          <td className="px-3 py-2 text-right font-mono">{r[mapping.energyUseRateKwh] || '—'}</td>
                          <td className="px-3 py-2 text-right font-mono">{r[mapping.potableWaterUseGal] || '—'}</td>
                          <td className="px-3 py-2">{r[mapping.condenserCooling] || 'Air-Cooled'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ingestion Destination Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  4. Database Operation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-start gap-2.5 ${
                      importMode === 'replace'
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Replace Existing Database
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Wipe existing records and populate with this CSV file.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-start gap-2.5 ${
                      importMode === 'append'
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Append / Merge Records
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Add rows to existing records without erasing current data.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!parseResult || isProcessing}
              onClick={handleExecuteImport}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {parseResult
                  ? `Import ${parseResult.allRawRows.length} Ice Machines`
                  : 'Select CSV to Import'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
