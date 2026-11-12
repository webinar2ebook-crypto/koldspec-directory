import React, { useState } from 'react';
import { IceMachine } from '../types/iceMachine';
import { ArrowUpDown, ArrowUp, ArrowDown, ShieldCheck, CheckSquare, Square, ExternalLink, Trash2, Box, Sparkles, Snowflake, Layers, Award } from 'lucide-react';

interface MachineTableViewProps {
  machines: IceMachine[];
  onSelectMachine: (machine: IceMachine) => void;
  comparedIds: string[];
  onToggleCompare: (machine: IceMachine) => void;
  onDeleteMachine?: (id: string) => void;
  onOpenImporter: () => void;
  onOpenQuote?: (machine: IceMachine) => void;
}

const renderIceIcon = (iceType: string) => {
  switch (iceType) {
    case 'Nugget':
      return <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />;
    case 'Flake':
      return <Snowflake className="w-3.5 h-3.5 text-sky-600 shrink-0" />;
    case 'Crescent':
      return <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    case 'Gourmet':
      return <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    case 'Cube':
    default:
      return <Box className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
  }
};

type SortField = 'brand' | 'modelNumber' | 'harvestRateLbs' | 'energyUseRateKwh' | 'potableWaterUseGal' | 'iceType';

export const MachineTableView: React.FC<MachineTableViewProps> = ({
  machines,
  onSelectMachine,
  comparedIds,
  onToggleCompare,
  onDeleteMachine,
  onOpenImporter,
  onOpenQuote,
}) => {
  const [sortField, setSortField] = useState<SortField>('harvestRateLbs');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'harvestRateLbs' ? 'desc' : 'asc');
    }
  };

  const sortedMachines = [...machines].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (aVal === undefined) aVal = 0;
    if (bVal === undefined) bVal = 0;

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Title Bar */}
      <div className="p-4 px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            AHRI Tested Specification Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Standard Rating Conditions: 90°F ambient air / 70°F inlet water / continuous operation
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 tabular-nums">
          {machines.length} records in active table view
        </div>
      </div>

      {/* Overflow Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/95 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th scope="col" className="w-9 min-w-[36px] px-2 py-2 text-center sticky left-0 z-20 bg-slate-100">
                <span className="sr-only">Compare</span>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('brand')}
                className="min-w-[95px] px-2.5 py-2 cursor-pointer select-none group sticky left-[36px] z-20 bg-slate-100"
              >
                <div className="flex items-center gap-1">
                  <span>Brand</span>
                  {renderSortIndicator('brand')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('modelNumber')}
                className="min-w-[130px] px-2.5 py-2 cursor-pointer select-none group sticky left-[131px] z-20 bg-slate-100 border-r border-slate-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-1">
                  <span>Model</span>
                  {renderSortIndicator('modelNumber')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('iceType')}
                className="px-2 py-2 cursor-pointer select-none group whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Ice</span>
                  {renderSortIndicator('iceType')}
                </div>
              </th>
              <th scope="col" className="px-2 py-2 whitespace-nowrap">
                Type
              </th>
              <th
                scope="col"
                onClick={() => handleSort('harvestRateLbs')}
                className="px-2.5 py-2 text-right cursor-pointer select-none group whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Harvest (lbs)</span>
                  {renderSortIndicator('harvestRateLbs')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('energyUseRateKwh')}
                className="px-2.5 py-2 text-right cursor-pointer select-none group whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Energy (kWh)</span>
                  {renderSortIndicator('energyUseRateKwh')}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => handleSort('potableWaterUseGal')}
                className="px-2.5 py-2 text-right cursor-pointer select-none group whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Water (gal)</span>
                  {renderSortIndicator('potableWaterUseGal')}
                </div>
              </th>
              <th scope="col" className="px-2 py-2 whitespace-nowrap">
                Cooling
              </th>
              <th scope="col" className="px-2 py-2 whitespace-nowrap">
                Refrig
              </th>
              <th scope="col" className="px-2 py-2 text-center whitespace-nowrap">
                ENERGY STAR
              </th>
              <th scope="col" className="px-2 py-2 text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedMachines.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-16 text-center">
                  <div className="max-w-md mx-auto px-4 space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-mono text-base font-bold">
                      0
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      Empty Specification Table
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      No machines match the selected filter criteria or no CSV data has been loaded into the database yet.
                    </p>
                    <button
                      onClick={onOpenImporter}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Import ENERGY STAR CSV</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              sortedMachines.map((m) => {
                const isCompared = comparedIds.includes(m.id);
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* Compare */}
                    <td className="w-9 min-w-[36px] px-2 py-2 text-center sticky left-0 z-10 bg-white group-hover:bg-blue-50/80">
                      <button
                        onClick={() => onToggleCompare(m)}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 cursor-pointer"
                        title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                      >
                        {isCompared ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Brand */}
                    <td className="min-w-[95px] px-2.5 py-2 font-semibold text-slate-900 whitespace-nowrap sticky left-[36px] z-10 bg-white group-hover:bg-blue-50/80">
                      {m.brand}
                    </td>

                    {/* Model */}
                    <td className="min-w-[130px] px-2.5 py-2 whitespace-nowrap sticky left-[131px] z-10 bg-white group-hover:bg-blue-50/80 border-r border-slate-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                      <button
                        onClick={() => onSelectMachine(m)}
                        className="font-mono font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left cursor-pointer"
                      >
                        {m.modelNumber}
                      </button>
                      {m.modelName && (
                        <div className="text-[10px] text-slate-400 max-w-[140px] truncate">
                          {m.modelName}
                        </div>
                      )}
                    </td>

                    {/* Ice Type */}
                    <td className="px-2 py-2 whitespace-nowrap text-slate-700 text-[11px]">
                      <div className="flex items-center gap-1">
                        {renderIceIcon(m.iceType)}
                        <span>{m.iceType}</span>
                      </div>
                    </td>

                    {/* Equipment Type */}
                    <td className="px-2 py-2 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {m.equipmentType}
                    </td>

                    {/* Harvest Rate (lbs/day) */}
                    <td className="px-2.5 py-2 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap text-[11px]">
                      {m.harvestRateLbs.toLocaleString()}
                    </td>

                    {/* Energy (kWh/100 lbs) */}
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums whitespace-nowrap text-[11px]">
                      <span className="font-semibold text-slate-800">
                        {m.energyUseRateKwh.toFixed(2)}
                      </span>
                    </td>

                    {/* Potable Water (gal/100 lbs) */}
                    <td className="px-2.5 py-2 text-right font-mono tabular-nums whitespace-nowrap text-slate-700 text-[11px]">
                      {m.potableWaterUseGal !== undefined
                        ? m.potableWaterUseGal.toFixed(1)
                        : '—'}
                    </td>

                    {/* Condenser */}
                    <td className="px-2 py-2 whitespace-nowrap text-slate-600 text-[11px]">
                      {m.condenserCooling}
                    </td>

                    {/* Refrigerant */}
                    <td className="px-2 py-2 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {m.refrigerant || '—'}
                    </td>

                    {/* ENERGY STAR */}
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      {m.energyStarCertified ? (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-blue-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-2 py-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectMachine(m)}
                          className="px-2 py-1 text-[10px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          title="View specification sheet"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => onOpenQuote?.(m)}
                          className="px-2 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors cursor-pointer"
                          title="Get a commercial quote for this model"
                        >
                          Quote
                        </button>
                        {onDeleteMachine && (
                          <button
                            onClick={() => onDeleteMachine(m.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded cursor-pointer"
                            title="Delete this record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
