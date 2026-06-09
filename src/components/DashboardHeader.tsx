/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, CalendarRange, Info } from 'lucide-react';

interface EraPreset {
  label: string;
  startYear: number;
  endYear: number;
  description: string;
}

interface DashboardHeaderProps {
  id: string;
  activePresetLabel: string;
  onSelectEra: (start: number, end: number, label: string) => void;
  yearRange: [number, number];
}

const ERA_PRESETS: EraPreset[] = [
  {
    label: 'Overview (1999 - 2021)',
    startYear: 1999,
    endYear: 2021,
    description: 'The complete duration of the tracked dataset, showing early growth, reformulation shifts, and modern synthetic opioid surges.'
  },
  {
    label: 'Unchecked Rise (1999 - 2009)',
    startYear: 1999,
    endYear: 2009,
    description: 'The first wave. OxyContin distribution and prescription overdose deaths rose in absolute lockstep as marketing peaked.'
  },
  {
    label: 'The Deterrent Pivot (2010 - 2015)',
    startYear: 2010,
    endYear: 2015,
    description: 'Reformulations made tablets hard to crush. Prescription volume dipped, but overdose death numbers hovered as heroin emerged.'
  },
  {
    label: 'Illicit Fentanyl Dominance (2016 - 2021)',
    startYear: 2016,
    endYear: 2021,
    description: 'Prescription volume dropped to record lows, but illicit synthetic fentanyl flooded markets, soaring overall overdose numbers.'
  }
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  id,
  activePresetLabel,
  onSelectEra,
  yearRange
}) => {
  return (
    <header id={id} className="border-b border-slate-700/80 bg-slate-900/40 pb-4 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            {/* Meta Indicator */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <ShieldCheck className="w-3" />
                Verified Clinical Registries
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide">
                CDC WONDER • SAMHSA TEDS-A • DEA ARCOS
              </span>
            </div>
            
            {/* Main Title with colorful tag */}
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="bg-red-600 w-1.5 h-5 rounded-xs inline-block shrink-0"></span>
              OxyContin & US Opioid Epidemic Monitor
              <span className="text-slate-400 font-light text-xs sm:text-sm font-mono">[1999—2021]</span>
            </h1>
            
            {/* Dashboard Subtitle */}
            <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider max-w-4xl font-sans">
              Critical analysis of prescription oxycodone distribution correlates against direct public health outcomes.
            </p>
          </div>
        </div>

        {/* Epidemic Presets Grid */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <CalendarRange className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Wave Filter presets (re-aggregates calculations on click)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ERA_PRESETS.map((preset) => {
              const isActive = activePresetLabel === preset.label;
              return (
                <button
                  id={`preset-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
                  key={preset.label}
                  onClick={() => onSelectEra(preset.startYear, preset.endYear, preset.label)}
                  className={`text-left p-3 rounded border text-slate-300 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 border-slate-600 ring-1 ring-slate-500 bg-opacity-95'
                      : 'bg-slate-800/10 border-slate-800/80 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold font-mono tracking-wider ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                      {preset.startYear} – {preset.endYear}
                    </span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-pulse" />
                    )}
                  </div>
                  <h3 className={`text-xs font-semibold mt-0.5 truncate ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                    {preset.label.split(' (')[0]}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Grounding Notice */}
        <div className="mt-3.5 bg-slate-900/60 border border-slate-800 rounded p-2.5 flex items-start gap-2 text-[10.5px] text-slate-400 leading-normal">
          <Info className="w-3.5 shrink-0 mt-0.5 text-slate-500" />
          <span>
            <strong>Analysis Mode:</strong> Visualizing historical database entries. Adjust timeframe parameters using preset buttons or lower manual sliders. Core correlation indices update in real-time.
          </span>
        </div>
      </div>
    </header>
  );
};
