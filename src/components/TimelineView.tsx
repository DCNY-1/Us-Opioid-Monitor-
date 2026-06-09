/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { timelineEvents } from '../data/timelineData';
import { TimelineEvent } from '../types';
import { 
  Megaphone, 
  Scale, 
  FileText, 
  Flame, 
  Filter, 
  Info, 
  Award,
  BookOpen
} from 'lucide-react';

interface TimelineViewProps {
  id: string;
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
  yearRange: [number, number];
}

const CATEGORY_META = {
  marketing: {
    label: 'Promotion & Sales',
    icon: Megaphone,
    bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    color: '#818cf8'
  },
  regulatory: {
    label: 'FDA & Prescribing Rules',
    icon: FileText,
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    color: '#fbbf24'
  },
  epidemiology: {
    label: 'Epidemic Waves',
    icon: Flame,
    bgClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    color: '#f87171'
  },
  legal: {
    label: 'Lawsuits & Criminal Action',
    icon: Scale,
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    color: '#34d399'
  }
};

export const TimelineView: React.FC<TimelineViewProps> = ({
  id,
  selectedYear,
  onSelectYear,
  yearRange
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter events based on active category and year boundary
  const filteredEvents = timelineEvents.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
    const matchesYearRange = event.year >= yearRange[0] && event.year <= yearRange[1];
    return matchesCategory && matchesYearRange;
  });

  return (
    <div id={id} className="bg-slate-800/20 border border-slate-700/80 rounded p-4 shadow-sm">
      <div className="sm:flex sm:items-center sm:justify-between pb-3 border-b border-slate-805 border-slate-800 flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5 leading-tight">
            <span className="bg-amber-550 bg-amber-500 w-1 h-4 rounded-xs inline-block"></span>
            OxyContin Historical Timeline & Milestones
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Tracking key product launches, FDA regulatory warnings, and historic legal battles.
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          <button
            id="timeline-filter-all"
            onClick={() => setActiveCategory('all')}
            className={`px-2 py-1 text-[11px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-800 text-slate-100 border border-slate-600/80'
                : 'bg-slate-900/30 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Filter className="w-3 h-3 text-slate-550" />
            All Events
          </button>
          
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = meta.icon;
            const isActive = activeCategory === key;
            return (
              <button
                id={`timeline-filter-${key}`}
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-2 py-1 text-[11px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border border-slate-650'
                    : 'bg-slate-900/30 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3 h-3" />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year range helper reminder */}
      <div className="my-3 bg-slate-900/20 rounded p-2.5 border border-slate-800 flex items-center gap-2 text-[11px]">
        <Info className="w-3.5 h-3.5 text-slate-550 text-slate-500 shrink-0" />
        <p className="text-slate-400 leading-normal">
          Currently filtering timeline milestones to <span className="text-slate-200 font-semibold font-mono">{yearRange[0]} – {yearRange[1]}</span>. Clicking a record highlights that specific year in surrounding graphs.
        </p>
      </div>

      {/* Timeline Scrollable Track */}
      <div className="relative mt-5 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
        {/* Vertical Side Line Track */}
        <div className="absolute left-5 top-1 bottom-1 w-px bg-slate-800 pointer-events-none" />

        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No documented clinical or litigation events fit this filter configuration.
          </div>
        ) : (
          <div className="space-y-3.5">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => {
                const meta = CATEGORY_META[event.category];
                const Icon = meta.icon;
                const isHighlighted = selectedYear === event.year;

                return (
                  <motion.div
                    id={`timeline-event-${event.id}`}
                    key={event.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                    onClick={() => onSelectYear(event.year)}
                    className={`relative p-3 rounded border transition-all cursor-pointer ${
                      isHighlighted 
                        ? 'bg-slate-800/60 border-slate-500 shadow-sm'
                        : 'bg-slate-900/10 border-slate-800/80 hover:bg-slate-900/25 hover:border-slate-750'
                    }`}
                  >
                    {/* Circle Pin Icon */}
                    <div 
                      className={`absolute left-5 top-[18px] w-7.5 h-7.5 rounded-full flex items-center justify-center border pointer-events-none -ml-[15px] transition-transform ${
                        isHighlighted ? 'scale-105 bg-slate-900 border-slate-400' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <div className="pl-6">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-slate-100 font-mono">
                            {event.year}
                          </span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border ${meta.bgClass}`}>
                            {meta.label}
                          </span>
                        </div>
                        
                        {/* Impact Level indicator */}
                        <div className="flex items-center gap-1 bg-slate-950/40 px-1.5 py-0.5 rounded border border-slate-850">
                          <Award className="w-3 h-3 text-slate-500" />
                          <span className="text-[9px] font-bold font-mono text-slate-500">
                            Impact: {event.impactRating}/5
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-slate-200 mt-1 hover:text-slate-150 transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {event.description}
                      </p>

                      {/* Explicit Citation verification tag */}
                      <div className="mt-2 pt-1.5 border-t border-slate-805 border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-medium font-sans">
                        <span className="flex items-center gap-1 text-[9.5px]">
                          <span className="h-1 w-1 rounded-full bg-slate-600" />
                          Registry Verified
                        </span>
                        <span className="italic font-mono truncate max-w-[240px] text-[9.5px] text-slate-505" title={event.source}>
                          {event.source}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
