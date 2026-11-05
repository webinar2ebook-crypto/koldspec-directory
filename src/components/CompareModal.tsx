import React from 'react';
import { IceMachine } from '../types/iceMachine';
import { X, ShieldCheck, Zap, Droplets, Gauge, Trash2, ArrowRight } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedMachines: IceMachine[];
  onRemoveMachine: (id: string) => void;
  onSelectMachine: (machine: IceMachine) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedMachines,
  onRemoveMachine,
  onSelectMachine,
}) => {
  if (!isOpen) return null;

  // Find lowest energy user and highest producer for highlighting
  const lowestEnergy = comparedMachines.length > 0
    ? Math.min(...comparedMachines.map((m) => m.energyUseRateKwh))
    : 0;

  const highestHarvest = comparedMachines.length > 0
    ? Math.max(...comparedMachines.map((m) => m.harvestRateLbs))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Side-by-Side Technical Comparison
            </h2>
            <p className="text-xs text-slate-500">
              Evaluating {comparedMachines.length} commercial ice machine models under AHRI 810 specifications
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {comparedMachines.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                No Machines Selected for Comparison
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check the "Compare" box on any machine cards or rows in the directory table to evaluate their production rates and energy efficiency side-by-side.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Return to Directory
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200">
                    <th className="p-4 w-44 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      Parameter
                    </th>
                    {comparedMachines.map((m) => (
                      <th key={m.id} className="p-4 min-w-[200px] border-l border-slate-200 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[11px] font-semibold text-slate-500">{m.brand}</div>
                            <div className="text-sm font-extrabold text-slate-900 font-mono">{m.modelNumber}</div>
                          </div>
                          <button
                            onClick={() => onRemoveMachine(m.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Ice Form */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Ice Form & Shape
                    </td>
                    {comparedMachines.map((m) => (
                      <td key={m.id} className="p-3.5 border-l border-slate-200 text-slate-800 font-medium">
                        {m.iceType} {m.iceShapeDetail ? `(${m.iceShapeDetail})` : ''}
                      </td>
                    ))}
                  </tr>

                  {/* Daily Harvest Rate */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Daily Harvest (lbs/24h)
                    </td>
                    {comparedMachines.map((m) => {
                      const isTop = m.harvestRateLbs === highestHarvest && comparedMachines.length > 1;
                      return (
                        <td key={m.id} className="p-3.5 border-l border-slate-200">
                          <div className="flex items-baseline gap-1.5 font-mono">
                            <span className="text-lg font-bold text-slate-900 tabular-nums">
                              {m.harvestRateLbs.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-500">lbs</span>
                            {isTop && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded border border-emerald-200">
                                Highest Output
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Energy Use Rate */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Energy Use (kWh/100 lbs)
                    </td>
                    {comparedMachines.map((m) => {
                      const isBest = m.energyUseRateKwh === lowestEnergy && comparedMachines.length > 1;
                      return (
                        <td key={m.id} className="p-3.5 border-l border-slate-200">
                          <div className="flex items-baseline gap-1.5 font-mono">
                            <span className="text-lg font-bold text-slate-900 tabular-nums">
                              {m.energyUseRateKwh.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-slate-500">kWh</span>
                            {isBest && (
                              <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.2 rounded border border-blue-200">
                                Most Efficient
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Annual Electric Cost */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Est. Annual Electric ($0.14/kWh)
                    </td>
                    {comparedMachines.map((m) => {
                      const cost = Math.round(((m.harvestRateLbs * 365) / 100) * m.energyUseRateKwh * 0.14);
                      return (
                        <td key={m.id} className="p-3.5 border-l border-slate-200 font-mono font-bold text-slate-800 tabular-nums">
                          ${cost.toLocaleString()} / year
                        </td>
                      );
                    })}
                  </tr>

                  {/* Potable Water Rate */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Potable Water (gal/100 lbs)
                    </td>
                    {comparedMachines.map((m) => (
                      <td key={m.id} className="p-3.5 border-l border-slate-200 font-mono tabular-nums text-slate-700">
                        {m.potableWaterUseGal !== undefined ? `${m.potableWaterUseGal} gal` : '—'}
                      </td>
                    ))}
                  </tr>

                  {/* Equipment Type */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Unit Configuration
                    </td>
                    {comparedMachines.map((m) => (
                      <td key={m.id} className="p-3.5 border-l border-slate-200 text-slate-700">
                        {m.equipmentType} ({m.equipmentType === 'IMH' ? 'Modular Head' : m.equipmentType === 'SCU' ? 'Self-Contained' : 'Remote'})
                      </td>
                    ))}
                  </tr>

                  {/* Condenser Cooling */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Condenser Cooling
                    </td>
                    {comparedMachines.map((m) => (
                      <td key={m.id} className="p-3.5 border-l border-slate-200 text-slate-700">
                        {m.condenserCooling}
                      </td>
                    ))}
                  </tr>

                  {/* Refrigerant */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      Refrigerant
                    </td>
                    {comparedMachines.map((m) => (
                      <td key={m.id} className="p-3.5 border-l border-slate-200 font-mono text-slate-700">
                        {m.refrigerant || 'Standard'}
                      </td>
                    ))}
                  </tr>

                  {/* ENERGY STAR */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-700 bg-slate-50/50">
                      ENERGY STAR® Verified
                    </td>
                    {comparedMachines.map((m) => (
                      <td key={m.id} className="p-3.5 border-l border-slate-200">
                        {m.energyStarCertified ? (
                          <span className="text-blue-700 font-semibold inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Action */}
                  <tr>
                    <td className="p-3.5 bg-slate-50/50"></td>
                    {comparedMachines.map((m) => (
                      <td key={m.id} className="p-3.5 border-l border-slate-200">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectMachine(m);
                          }}
                          className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
                        >
                          View Full Specs
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Compare up to 4 models simultaneously
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
