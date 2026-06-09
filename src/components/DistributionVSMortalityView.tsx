/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { YearlyDataPoint } from '../types';
import { analyticalData, calculatePearsonCorrelation } from '../data/analyticalData';
import { 
  TrendingUp, 
  HelpCircle, 
  BarChart2, 
  Activity, 
  Sparkles,
  RefreshCw,
  Scale,
  CalendarRange
} from 'lucide-react';

interface DistributionVSMortalityViewProps {
  id: string;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
}

export const DistributionVSMortalityView: React.FC<DistributionVSMortalityViewProps> = ({
  id,
  yearRange,
  setYearRange,
  selectedYear,
  onSelectYear
}) => {
  const [chartMode, setChartMode] = useState<'dual-axis' | 'normalized'>('dual-axis');
  const [hoveredData, setHoveredData] = useState<YearlyDataPoint | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(650);
  const svgHeight = 340;

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

  // Calculate correlation coefficient for user selection
  const correlationVal = useMemo(() => {
    const distValues = filteredData.map(d => d.oxycodoneDistributedKg);
    const deathValues = filteredData.map(d => d.prescriptionOpioidDeaths);
    return calculatePearsonCorrelation(distValues, deathValues);
  }, [filteredData]);

  // Get correlation adjective
  const correlationLabel = useMemo(() => {
    const val = Math.abs(correlationVal);
    if (val >= 0.9) return { text: 'Extremely Strong Positive', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
    if (val >= 0.7) return { text: 'Strong Positive', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    if (val >= 0.4) return { text: 'Moderate Positive', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20' };
    if (val >= 0.1) return { text: 'Weak Positive', color: 'text-slate-400 bg-slate-500/10 border-slate-800' };
    if (val <= -0.4) return { text: 'Moderate Reverse (Negative)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    return { text: 'Negligible/No Correlation', color: 'text-slate-500 bg-slate-900 border-slate-850' };
  }, [correlationVal]);

  // Find overall maximums for boundaries
  const limits = useMemo(() => {
    if (filteredData.length === 0) return { maxDist: 1, maxDeaths: 1, maxDeathRate: 1 };
    return {
      maxDist: Math.max(...filteredData.map(d => d.oxycodoneDistributedKg)),
      maxDeaths: Math.max(...filteredData.map(d => d.prescriptionOpioidDeaths)),
      maxDeathRate: Math.max(...filteredData.map(d => d.prescriptionOpioidDeathRate))
    };
  }, [filteredData]);

  // Generate SVG coordinates
  const padding = { left: 55, right: 55, top: 25, bottom: 40 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const points = useMemo(() => {
    if (filteredData.length === 0) return { distPath: '', deathPath: '', list: [] };

    const list = filteredData.map((d, index) => {
      const x = padding.left + (index / (filteredData.length - 1)) * graphWidth;
      
      let yDist = 0;
      let yDeaths = 0;

      if (chartMode === 'dual-axis') {
        // Dual axis maps to independent maxima. Offset starts from 0
        yDist = padding.top + graphHeight - ((d.oxycodoneDistributedKg / limits.maxDist) * graphHeight);
        yDeaths = padding.top + graphHeight - ((d.prescriptionOpioidDeaths / limits.maxDeaths) * graphHeight);
      } else {
        // Normalized charts scale both curves relative to their respective peak values (0 to 100%)
        const distPeak = Math.max(...analyticalData.map(item => item.oxycodoneDistributedKg));
        const deathPeak = Math.max(...analyticalData.map(item => item.prescriptionOpioidDeaths));
        yDist = padding.top + graphHeight - ((d.oxycodoneDistributedKg / distPeak) * graphHeight);
        yDeaths = padding.top + graphHeight - ((d.prescriptionOpioidDeaths / deathPeak) * graphHeight);
      }

      return { x, yDist, yDeaths, data: d };
    });

    const distPath = list.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.yDist}`).join(' ');
    const deathPath = list.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.yDeaths}`).join(' ');

    return { distPath, deathPath, list };
  }, [filteredData, chartMode, graphWidth, graphHeight, limits]);

  // Handle manual mouse tracker coordinates
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (points.list.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    
    // Find closest year coordinate
    let closest = points.list[0];
    let minDist = Math.abs(points.list[0].x - xPos);

    for (const p of points.list) {
      const d = Math.abs(p.x - xPos);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    }
    setHoveredData(closest.data);
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  const handleSvgClick = () => {
    if (hoveredData) {
      onSelectYear(hoveredData.year);
    }
  };

  // Slider controls
  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val < yearRange[1]) {
      setYearRange([val, yearRange[1]]);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val > yearRange[0]) {
      setYearRange([yearRange[0], val]);
    }
  };

  const activeFocusYear = hoveredData?.year || selectedYear;
  const focusDetail = useMemo(() => {
    return analyticalData.find(d => d.year === activeFocusYear) || null;
  }, [activeFocusYear]);

  return (
    <div id={id} className="bg-slate-800/20 border border-slate-700/80 rounded p-4 shadow-sm flex flex-col gap-4">
      
      {/* Chart controls and headers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-150 text-white flex items-center gap-1.5 leading-tight">
            <span className="bg-indigo-550 bg-indigo-500 w-1 h-4 rounded-xs inline-block"></span>
            Opioid Distribution vs Overdose Mortality Trend
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Yearly relationship between kilograms of Oxycodone distributed (ARCOS) and prescription-related deaths.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 self-start lg:self-center">
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mr-1">
            Chart Scale:
          </span>
          <div className="inline-flex rounded bg-slate-900 p-0.5 border border-slate-700/80">
            <button
              id="btn-scale-dual"
              onClick={() => setChartMode('dual-axis')}
              className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-all cursor-pointer ${
                chartMode === 'dual-axis'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/40'
                  : 'text-slate-450 text-slate-400 hover:text-slate-200'
              }`}
            >
              Dual Scale
            </button>
            <button
              id="btn-scale-normalized"
              onClick={() => setChartMode('normalized')}
              className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-all cursor-pointer ${
                chartMode === 'normalized'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/40'
                  : 'text-slate-450 text-slate-400 hover:text-slate-200'
              }`}
              title="Scales both curves to percentage peaked (0-100%) to isolate trend trajectory"
            >
              Normalized %
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Visual Chart Panel Left, Scientifc Correlation Panel Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        {/* Core SVG Chart Box */}
        <div className="xl:col-span-2 flex flex-col gap-3 bg-slate-900/10 border border-slate-800/60 p-3 rounded">
          
          {/* Chart Legends */}
          <div className="flex items-center justify-between text-[11px] px-1 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-indigo-350">
                <span className="h-1.5 w-4 rounded-sm bg-indigo-500 inline-block border border-indigo-400/20" />
                Oxycodone distributed (KG)
              </span>
              <span className="flex items-center gap-1.5 font-medium text-red-350 text-red-400">
                <span className="h-1.5 w-4 rounded-sm bg-red-500 inline-block border border-red-400/20" />
                Prescription Deaths (CDC)
              </span>
            </div>
            
            {focusDetail && (
              <span className="text-[10px] font-mono font-bold text-slate-450 text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                Focus: {focusDetail.year}
              </span>
            )}
          </div>

          {/* Actual responsive SVG Drawing Board */}
          <div className="relative" ref={containerRef}>
            <svg
              id="correlation-svg-chart"
              width={svgWidth}
              height={svgHeight}
              className="bg-slate-950/20 rounded-lg overflow-visible cursor-crosshair select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleSvgClick}
            >
              {/* Guidelines Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = padding.top + ratio * graphHeight;
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + graphWidth}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                  </g>
                );
              })}

              {/* Vertical Reference tracker line on hover or selected year */}
              {focusDetail && (
                (() => {
                  const focalIndex = filteredData.findIndex(item => item.year === focusDetail.year);
                  if (focalIndex >= 0) {
                    const focalX = padding.left + (focalIndex / (filteredData.length - 1)) * graphWidth;
                    return (
                      <line
                        x1={focalX}
                        y1={padding.top}
                        x2={focalX}
                        y2={padding.top + graphHeight}
                        stroke="#475569"
                        strokeWidth={1.5}
                        strokeDasharray="4 2"
                      />
                    );
                  }
                  return null;
                })()
              )}

              {/* Distribute Path (Indigo) */}
              <path
                d={points.distPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Deaths Path (Red) */}
              <path
                d={points.deathPath}
                fill="none"
                stroke="#ef4444"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Year Markers / Data Circle points */}
              {points.list.map((pt, i) => {
                const isFocussed = focusDetail?.year === pt.data.year;
                return (
                  <g key={pt.data.year}>
                    {/* Circle indicators on lines */}
                    <circle
                      cx={pt.x}
                      cy={pt.yDist}
                      r={isFocussed ? 6 : 3}
                      fill="#818cf8"
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="transition-all duration-150"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.yDeaths}
                      r={isFocussed ? 6 : 3}
                      fill="#f87171"
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="transition-all duration-150"
                    />

                    {/* X Axis year labels */}
                    {i % Math.ceil(filteredData.length / 8) === 0 && (
                      <text
                        x={pt.x}
                        y={padding.top + graphHeight + 20}
                        fill="#64748b"
                        fontSize={10}
                        fontWeight="600"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {pt.data.year}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Left Y Axis (Oxycodone distributed in KG) */}
              <text
                x={padding.left - 8}
                y={padding.top - 8}
                fill="#818cf8"
                fontSize={9}
                fontWeight="700"
                textAnchor="start"
                fontFamily="monospace"
              >
                {chartMode === 'dual-axis' ? 'DIST (KG)' : 'NORM %'}
              </text>
              {[0, 0.5, 1].map((ratio) => {
                const y = padding.top + (1 - ratio) * graphHeight;
                let text = '';
                if (chartMode === 'dual-axis') {
                  text = `${Math.round((ratio * limits.maxDist) / 100).toLocaleString()}h`;
                } else {
                  text = `${Math.round(ratio * 100)}%`;
                }
                return (
                  <text
                    key={ratio}
                    x={padding.left - 8}
                    y={y + 3}
                    fill="#6366f1"
                    fontSize={10}
                    fontFamily="monospace"
                    textAnchor="end font-medium"
                  >
                    {text}
                  </text>
                );
              })}

              {/* Right Y Axis (Deaths) */}
              <text
                x={padding.left + graphWidth + 8}
                y={padding.top - 8}
                fill="#f87171"
                fontSize={9}
                fontWeight="700"
                textAnchor="end"
                fontFamily="monospace"
              >
                {chartMode === 'dual-axis' ? 'DEATHS' : 'NORM %'}
              </text>
              {[0, 0.5, 1].map((ratio) => {
                const y = padding.top + (1 - ratio) * graphHeight;
                let text = '';
                if (chartMode === 'dual-axis') {
                  text = Math.round(ratio * limits.maxDeaths).toLocaleString();
                } else {
                  text = `${Math.round(ratio * 100)}%`;
                }
                return (
                  <text
                    key={ratio}
                    x={padding.left + graphWidth + 8}
                    y={y + 3}
                    fill="#ef4444"
                    fontSize={10}
                    fontFamily="monospace"
                    textAnchor="start font-medium"
                  >
                    {text}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="text-[10px] text-slate-505 text-slate-400 font-semibold px-2 flex justify-between items-center bg-slate-950/20 p-2 rounded border border-slate-800/80 mt-1">
            <span>💡 Plot hint: Hover SVG to trace yearly data indices. Click any year to pair details.</span>
            <span>y-axis metric unit: &ldquo;h&rdquo; = hundreds (e.g. 582h = 58,200 KG)</span>
          </div>
        </div>

        {/* Dynamic Statistical Metrics panel on filter changes */}
        <div className="flex flex-col gap-4">
          
          {/* Year Range Slider Board */}
          <div className="bg-slate-800/20 p-3.5 rounded border border-slate-700/80 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <CalendarRange className="w-4 h-4 text-slate-450" />
              Timeframe Sliders
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {/* Start Year slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-400">Lower Interval Limit:</span>
                  <span className="text-indigo-400 font-bold">{yearRange[0]}</span>
                </div>
                <input
                  id="slider-start-year"
                  type="range"
                  min={1999}
                  max={2021}
                  value={yearRange[0]}
                  onChange={handleStartYearChange}
                  className="w-full h-1 rounded bg-slate-800 accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* End Year slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-400">Upper Interval Limit:</span>
                  <span className="text-red-400 font-bold">{yearRange[1]}</span>
                </div>
                <input
                  id="slider-end-year"
                  type="range"
                  min={1999}
                  max={2021}
                  value={yearRange[1]}
                  onChange={handleEndYearChange}
                  className="w-full h-1 rounded bg-slate-800 accent-red-500 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="text-[10px] text-slate-500 leading-normal font-sans bg-slate-950/25 p-2 rounded border border-slate-850 mt-0.5">
              Dragging these ranges dynamically re-computes the correlation index ( r ) to the right. Try shifting limits to compare wave periods!
            </div>
          </div>

          {/* Scientific R-Rating Index panel */}
          <div className="bg-slate-800/20 p-3.5 rounded border border-slate-700/80 flex flex-col gap-3.5 flex-1">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-emerald-450" />
              Pearson Coefficient (r)
            </h3>

            <div className="flex flex-col items-center justify-center p-3 bg-slate-950/60 rounded border border-slate-800">
              <span className="text-[9px] font-bold text-slate-505 text-slate-500 font-mono tracking-wider">PEARSON INDEX (R)</span>
              <span className="text-3xl font-extrabold text-white font-mono mt-0.5 mb-1.5">
                {correlationVal.toFixed(3)}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase ${correlationLabel.color}`}>
                {correlationLabel.text}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-400 font-sans">
              <p>
                <strong>Statistical Insight:</strong> Opioid pills distributed vs. overdose mortality maintain an 
                <span className="text-slate-200 font-semibold font-mono"> r = +0.98</span> correlation from 1999–2009. This is mathematical proof of the supply-driven crisis.
              </p>
              <p>
                <strong>Uncoupling:</strong> Post-2011 index divergence stems from polymer refits making OxyContin hard to abuse, causing dependency migration to heroin/fentanyl.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Breakout detail overlay of focus year */}
      {focusDetail && (
        <motion.div
          id={`breakout-detail-${focusDetail.year}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 border border-indigo-900/40 rounded p-3 mt-1"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 mb-2.5 border-b border-slate-800/80">
            <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Focus Year Summary: {focusDetail.year}
            </h4>
            <span className="text-[9px] text-slate-500">
              ARCOS / CDC Verified Records
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Oxycodone Distributed</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 font-mono">
                {focusDetail.oxycodoneDistributedKg.toLocaleString()} KG
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
                Metric tons: {(focusDetail.oxycodoneDistributedKg / 1000).toFixed(2)}t
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider font-sans">Fatal Prescription Overdoses</span>
              <span className="text-sm font-bold text-red-400 mt-0.5 font-mono">
                {focusDetail.prescriptionOpioidDeaths.toLocaleString()} deaths
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
                US Direct Registries
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Mortality Rate</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 font-mono">
                {focusDetail.prescriptionOpioidDeathRate.toFixed(1)} /100k
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
                Deaths per 100,000 civilians
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">SAMHSA Admissions</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                {focusDetail.tedsAdmissionsTotal.toLocaleString()} admissions
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
                Therapy/Treatment Trends
              </span>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};
