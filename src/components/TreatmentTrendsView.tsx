/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { analyticalData, regionalInfoMap } from '../data/analyticalData';
import { RegionKey } from '../types';
import { 
  HeartHandshake, 
  MapPin, 
  TrendingUp, 
  Layers, 
  Info,
  ChevronRight
} from 'lucide-react';

interface TreatmentTrendsViewProps {
  id: string;
  yearRange: [number, number];
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
}

const REGION_COLORS: Record<RegionKey, { stroke: string; fill: string; dot: string; text: string }> = {
  Northeast: { stroke: '#818cf8', fill: 'rgba(129, 140, 248, 0.08)', dot: '#818cf8', text: 'text-indigo-400' },
  Midwest: { stroke: '#f472b6', fill: 'rgba(244, 114, 182, 0.08)', dot: '#f472b6', text: 'text-pink-400' },
  South: { stroke: '#fbbf24', fill: 'rgba(251, 191, 36, 0.08)', dot: '#fbbf24', text: 'text-amber-400 font-sans' },
  West: { stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.08)', dot: '#38bdf8', text: 'text-sky-400' },
  Total: { stroke: '#34d399', fill: 'rgba(52, 211, 153, 0.07)', dot: '#34d399', text: 'text-emerald-400' }
};

export const TreatmentTrendsView: React.FC<TreatmentTrendsViewProps> = ({
  id,
  yearRange,
  selectedYear,
  onSelectYear
}) => {
  const [focusedRegion, setFocusedRegion] = useState<RegionKey>('South');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(650);
  const svgHeight = 280;

  // Track parent dimension for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 10) {
          setSvgWidth(entry.contentRect.width); 
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter actual timeframe
  const filteredData = useMemo(() => {
    return analyticalData.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);
  }, [yearRange]);

  // Find general maximum based on selection
  const maxAdmissionsLimit = useMemo(() => {
    if (filteredData.length === 0) return 1;
    // Map max based on centered region or the national total if 'Total' selected
    if (focusedRegion === 'Total') {
      return Math.max(...filteredData.map(d => d.tedsAdmissionsTotal));
    }
    return Math.max(...filteredData.map(d => Math.max(
      d.tedsAdmissionsNortheast,
      d.tedsAdmissionsMidwest,
      d.tedsAdmissionsSouth,
      d.tedsAdmissionsWest
    )));
  }, [filteredData, focusedRegion]);

  // Generate SVG Coordinates
  const padding = { left: 55, right: 25, top: 20, bottom: 35 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const points = useMemo(() => {
    if (filteredData.length === 0) return [];
    
    return filteredData.map((d, index) => {
      const x = padding.left + (index / (filteredData.length - 1)) * graphWidth;
      
      const valNorth = d.tedsAdmissionsNortheast;
      const valMid = d.tedsAdmissionsMidwest;
      const valSouth = d.tedsAdmissionsSouth;
      const valWest = d.tedsAdmissionsWest;
      const valTotal = d.tedsAdmissionsTotal;

      const yNorth = padding.top + graphHeight - ((valNorth / maxAdmissionsLimit) * graphHeight);
      const yMid = padding.top + graphHeight - ((valMid / maxAdmissionsLimit) * graphHeight);
      const ySouth = padding.top + graphHeight - ((valSouth / maxAdmissionsLimit) * graphHeight);
      const yWest = padding.top + graphHeight - ((valWest / maxAdmissionsLimit) * graphHeight);
      const yTotal = padding.top + graphHeight - ((valTotal / maxAdmissionsLimit) * graphHeight);

      return {
        year: d.year,
        x,
        Northeast: { y: yNorth, value: valNorth },
        Midwest: { y: yMid, value: valMid },
        South: { y: ySouth, value: valSouth },
        West: { y: yWest, value: valWest },
        Total: { y: yTotal, value: valTotal },
        original: d
      };
    });
  }, [filteredData, graphWidth, graphHeight, maxAdmissionsLimit]);

  // Create paths for all series
  const paths = useMemo(() => {
    if (points.length === 0) return { Stroke: '', Area: '' };

    const strokeCoords = points.map(p => `${p.x},${p[focusedRegion].y}`).join(' L ');
    const firstPt = points[0];
    const lastPt = points[points.length - 1];

    return {
      Stroke: `M ${strokeCoords}`,
      Area: `M ${firstPt.x},${padding.top + graphHeight} L ${strokeCoords} L ${lastPt.x},${padding.top + graphHeight} Z`
    };
  }, [points, focusedRegion, graphHeight]);

  // Handle manual tracking coordinates
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left;

    let closestYear = points[0].year;
    let minDist = Math.abs(points[0].x - xPos);

    for (const p of points) {
      const d = Math.abs(p.x - xPos);
      if (d < minDist) {
        minDist = d;
        closestYear = p.year;
      }
    }
    setHoveredYear(closestYear);
  };

  const handleMouseLeave = () => {
    setHoveredYear(null);
  };

  const handleSvgClick = () => {
    if (hoveredYear) {
      onSelectYear(hoveredYear);
    }
  };

  const activeFocusYear = hoveredYear || selectedYear;
  
  // Dynamic breakdown computation for selected focus year
  const activeBreakdown = useMemo(() => {
    const d = analyticalData.find(item => item.year === activeFocusYear);
    if (!d) return null;
    
    const tot = d.tedsAdmissionsTotal;
    return {
      year: d.year,
      Northeast: { count: d.tedsAdmissionsNortheast, pct: (d.tedsAdmissionsNortheast / tot) * 100 },
      Midwest: { count: d.tedsAdmissionsMidwest, pct: (d.tedsAdmissionsMidwest / tot) * 100 },
      South: { count: d.tedsAdmissionsSouth, pct: (d.tedsAdmissionsSouth / tot) * 100 },
      West: { count: d.tedsAdmissionsWest, pct: (d.tedsAdmissionsWest / tot) * 100 },
      Total: { count: tot, pct: 100 }
    };
  }, [activeFocusYear]);

  const regionMeta = regionalInfoMap[focusedRegion];
  const activeColor = REGION_COLORS[focusedRegion];

  return (
    <div id={id} className="bg-slate-800/20 border border-slate-700/80 rounded p-4 shadow-sm flex flex-col gap-4">
      
      {/* Sub Title */}
      <div className="sm:flex sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5 leading-tight">
            <span className="bg-emerald-500 w-1 h-4 rounded-xs inline-block"></span>
            Opioid Therapy & Treatment Admission Trends
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Analyzing SAMHSA Treatment Episode Data Set (TEDS) primary rehabilitation admissions for prescription opioids.
          </p>
        </div>
      </div>

      {/* Main Grid: Regional Panel Selector & Map Info vs Graphical Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Interactive selectors */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            Focus Region Selection
          </span>

          <div className="flex flex-col gap-1.5">
            {(Object.keys(regionalInfoMap) as RegionKey[]).map((key) => {
              const info = regionalInfoMap[key];
              const isSelected = focusedRegion === key;
              const col = REGION_COLORS[key];

              return (
                <button
                  id={`btn-region-${key}`}
                  key={key}
                  onClick={() => setFocusedRegion(key)}
                  className={`text-left p-2 rounded border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-805 bg-slate-900 border-slate-650 ring-1 ring-slate-800'
                      : 'bg-slate-800/10 border-slate-800/85 hover:bg-slate-800/25'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full inline-block`} style={{ backgroundColor: col.stroke }} />
                    <span className={`text-xs font-bold ${isSelected ? 'text-slate-100' : 'text-slate-400 font-medium'}`}>
                      {info.name.replace(' Region', '')}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              );
            })}
          </div>

          {/* Region details overlay */}
          <div className="bg-slate-800/10 p-3 rounded border border-slate-750/80 mt-1 flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              States Represented
            </h4>
            <div className="flex flex-wrap gap-1">
              {regionMeta.states.slice(0, 7).map((state) => (
                <span key={state} className="inline-block bg-slate-950/40 text-slate-400 border border-slate-800/85 px-1.5 py-0.5 rounded text-[9px] font-medium font-mono">
                  {state}
                </span>
              ))}
              {regionMeta.states.length > 7 && (
                <span className="inline-block bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono">
                  +{regionMeta.states.length - 7}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal mt-0.5 border-t border-slate-800/80 pt-2 font-sans">
              {regionMeta.description}
            </p>
          </div>
        </div>

        {/* Right Side Graph & Metrics Breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          
          <div className="flex items-center justify-between text-[11px] px-1 font-mono">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Admissions Curve: <span className={activeColor.text}>{regionMeta.name}</span>
            </span>
            {activeFocusYear && (
              <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10">
                Tracking admissions in {activeFocusYear}
              </span>
            )}
          </div>

          {/* Custom admissions area SVG */}
          <div ref={containerRef} className="relative bg-slate-950/25 rounded border border-slate-800/80 p-3">
            <svg
              id="treatment-svg-chart"
              width={svgWidth}
              height={svgHeight}
              className="overflow-visible select-none cursor-crosshair bg-slate-950/20"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleSvgClick}
            >
              {/* Guidelines Y Grid */}
              {[0, 0.5, 1].map((ratio) => {
                const y = padding.top + ratio * graphHeight;
                return (
                  <line
                    key={ratio}
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Vertical Reference line */}
              {activeFocusYear && (() => {
                const stepIdx = filteredData.findIndex(item => item.year === activeFocusYear);
                if (stepIdx >= 0) {
                  const focalX = padding.left + (stepIdx / (filteredData.length - 1)) * graphWidth;
                  return (
                    <line
                      x1={focalX}
                      y1={padding.top}
                      x2={focalX}
                      y2={padding.top + graphHeight}
                      stroke="#475569"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                  );
                }
                return null;
              })()}

              {/* Gradient Fill definition */}
              <defs>
                <linearGradient id={`gradient-${focusedRegion}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeColor.stroke} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={activeColor.stroke} stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Shaded Area line */}
              <path
                d={paths.Area}
                fill={`url(#gradient-${focusedRegion})`}
                stroke="none"
              />

              {/* Outer Stroke line */}
              <path
                d={paths.Stroke}
                fill="none"
                stroke={activeColor.stroke}
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              {/* Markers */}
              {points.map((pt, i) => {
                const isFocussed = pt.year === activeFocusYear;
                return (
                  <g key={pt.year}>
                    <circle
                      cx={pt.x}
                      cy={pt[focusedRegion].y}
                      r={isFocussed ? 6 : 3}
                      fill={activeColor.dot}
                      stroke="#fff"
                      strokeWidth={1.2}
                      className="transition-all"
                    />

                    {i % Math.ceil(filteredData.length / 8) === 0 && (
                      <text
                        x={pt.x}
                        y={padding.top + graphHeight + 18}
                        fill="#64748b"
                        fontSize={9.5}
                        fontWeight="600"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {pt.year}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Left axis values */}
              {[0, 0.5, 1].map((ratio) => {
                const y = padding.top + (1 - ratio) * graphHeight;
                const value = Math.round(ratio * maxAdmissionsLimit);
                return (
                  <text
                    key={ratio}
                    x={padding.left - 8}
                    y={y + 3}
                    fill="#475569"
                    fontSize={9.5}
                    fontFamily="monospace"
                    textAnchor="end font-bold"
                  >
                    {value.toLocaleString()}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Dynamic regional proportion breakout table */}
          {activeBreakdown && (
            <AnimatePresence mode="wait">
              <motion.div
                id={`region-breakdown-${activeBreakdown.year}`}
                key={activeBreakdown.year}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/30 border border-slate-755 p-3 rounded mt-2 flex flex-col gap-2 border-slate-700/80"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                    US Clinical Admission Breakout (% of national cases): {activeBreakdown.year}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono italic">
                    Aggregate total: {activeBreakdown.Total.count.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-0.5">
                  {(['Northeast', 'Midwest', 'South', 'West'] as RegionKey[]).map((regionKey) => {
                    const data = activeBreakdown[regionKey];
                    const col = REGION_COLORS[regionKey];
                    const isFocussedRegion = focusedRegion === regionKey;

                    return (
                      <div
                        id={`breakout-card-${regionKey}`}
                        key={regionKey}
                        className={`p-2 rounded border flex flex-col justify-between font-sans ${
                          isFocussedRegion 
                            ? 'bg-slate-900 border-indigo-900/40 shadow-inner' 
                            : 'bg-slate-950/40 border-slate-850 border-slate-800/80'
                        }`}
                      >
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${col.text}`}>
                          {regionKey}
                        </span>
                        <div className="mt-1">
                          <span className="text-sm font-extrabold text-slate-100 font-mono">
                            {data.count.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-550 block font-mono mt-0.5 text-slate-500">
                            {data.pct.toFixed(1)}% of US
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>

      </div>

    </div>
  );
};
