/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { DashboardHeader } from './components/DashboardHeader';
import { MetricCard } from './components/MetricCard';
import { TimelineView } from './components/TimelineView';
import { DistributionVSMortalityView } from './components/DistributionVSMortalityView';
import { TreatmentTrendsView } from './components/TreatmentTrendsView';
import { DataSourcesView } from './components/DataSourcesView';
import { analyticalData } from './data/analyticalData';
import { 
  Pill, 
  Users2, 
  Skull, 
  TrendingUp,
  RefreshCw,
  Info
} from 'lucide-react';

export default function App() {
  const [yearRange, setYearRange] = useState<[number, number]>([1999, 2021]);
  const [selectedYear, setSelectedYear] = useState<number | null>(2011);
  const [activePresetLabel, setActivePresetLabel] = useState<string>('Overview (1999 - 2021)');

  // Filter dataset based on current timeframe
  const filteredData = useMemo(() => {
    return analyticalData.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);
  }, [yearRange]);

  // Handle preset selections
  const handleSelectEraRange = (startYear: number, endYear: number, label: string) => {
    setYearRange([startYear, endYear]);
    setActivePresetLabel(label);
    
    // Auto binding typical peak years inside the era for convenient UX
    if (startYear === 1999) setSelectedYear(2011);
    else if (startYear === 2010) setSelectedYear(2012);
    else if (startYear === 2016) setSelectedYear(2020);
    else setSelectedYear(startYear);
  };

  // Adjust sliders manually
  const handleManualYearRangeChange = (newRange: [number, number]) => {
    setYearRange(newRange);
    setActivePresetLabel('Manual Interval Selected');
  };

  // Bind selection callbacks
  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
  };

  // Reset range filters to full Overview
  const handleResetFilters = () => {
    setYearRange([1999, 2021]);
    setSelectedYear(2011);
    setActivePresetLabel('Overview (1999 - 2021)');
  };

  // Calculate dynamic statistics for cards based on user YearRange selectors
  const summaryMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        peakDistribution: 'N/A',
        peakDistYear: 0,
        cumulativeDeaths: 0,
        peakDeathRate: '0.0',
        peakRateYear: 0,
        totalTedsAdmissionsCount: 0
      };
    }

    // 1. Peak distribution weight and associated year
    let maxDist = 0;
    let maxDistYear = 0;
    // 2. Cumulative deaths sum
    let totalDeaths = 0;
    // 3. Peak death rate and associated year
    let maxDeathRate = 0;
    let maxRateYear = 0;
    // 4. Sum of all treatment admissions
    let sumTedsAdmissions = 0;

    filteredData.forEach(d => {
      totalDeaths += d.prescriptionOpioidDeaths;
      sumTedsAdmissions += d.tedsAdmissionsTotal;
      
      if (d.oxycodoneDistributedKg > maxDist) {
        maxDist = d.oxycodoneDistributedKg;
        maxDistYear = d.year;
      }
      
      if (d.prescriptionOpioidDeathRate > maxDeathRate) {
        maxDeathRate = d.prescriptionOpioidDeathRate;
        maxRateYear = d.year;
      }
    });

    return {
      peakDistribution: `${maxDist.toLocaleString()} KG`,
      peakDistYear: maxDistYear,
      cumulativeDeaths: totalDeaths,
      peakDeathRate: `${maxDeathRate.toFixed(1)} /100k`,
      peakRateYear: maxRateYear,
      totalTedsAdmissionsCount: sumTedsAdmissions
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col selection:bg-indigo-500/20 selection:text-indigo-200">
      
      {/* Prime Header & Preset Selectors */}
      <DashboardHeader
        id="dashboard-header"
        activePresetLabel={activePresetLabel}
        onSelectEra={handleSelectEraRange}
        yearRange={yearRange}
      />

      {/* Main Content Body Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">
        
        {/* Dynamic Summary Cards Row based on user slider bounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" id="stats-banner">
          
          <MetricCard
            id="stat-deaths"
            title="Cumulative Fatal Overdoses"
            value={summaryMetrics.cumulativeDeaths.toLocaleString()}
            subtitle={`Sum of fatal outcomes during selected period`}
            trend={{
              value: `${yearRange[0]} - ${yearRange[1]}`,
              type: 'neutral'
            }}
            icon={Skull}
            colorClass="bg-red-500 text-red-500"
          />

          <MetricCard
            id="stat-distribution"
            title="Peak Distribution Weight"
            value={summaryMetrics.peakDistribution}
            subtitle={`Year of Peak: ${summaryMetrics.peakDistYear}`}
            trend={{
              value: 'ARCOS DEA',
              type: 'neutral'
            }}
            icon={Pill}
            colorClass="bg-indigo-500 text-blue-400"
          />

          <MetricCard
            id="stat-deathrate"
            title="Max Annual Mortality Rate"
            value={summaryMetrics.peakDeathRate}
            subtitle={`Peak Year: ${summaryMetrics.peakRateYear}`}
            trend={{
              value: 'CDC WONDER',
              type: 'neutral'
            }}
            icon={TrendingUp}
            colorClass="bg-pink-550 bg-pink-500 text-red-400"
          />

          <MetricCard
            id="stat-admissions"
            title="Rehabilitation Ingress"
            value={summaryMetrics.totalTedsAdmissionsCount.toLocaleString()}
            subtitle="Admissions for pharmaceutical dependency"
            trend={{
              value: 'SAMHSA TEDS',
              type: 'neutral'
            }}
            icon={Users2}
            colorClass="bg-emerald-500 text-emerald-400"
          />
        </div>

        {/* Dynamic Reset Indicator banner */}
        {(yearRange[0] !== 1999 || yearRange[1] !== 2021) && (
          <motion.div
            id="filters-active-banner"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-2.5 rounded border border-slate-700 bg-slate-800/20 text-xs"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Active Filters: Isolating analysis indices to <strong className="text-slate-100 font-mono">{yearRange[0]} – {yearRange[1]}</strong>. Calculation ratios parsed on-the-fly.
              </span>
            </div>
            
            <button
              id="btn-reset-filters"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restore Full Range
            </button>
          </motion.div>
        )}

        {/* Primary Row: Detailed multi-series charts representing distribution & mortality */}
        <div className="grid grid-cols-1 gap-5" id="primary-visualizations">
          
          <DistributionVSMortalityView
            id="correlation-chart-section"
            yearRange={yearRange}
            setYearRange={handleManualYearRangeChange}
            selectedYear={selectedYear}
            onSelectYear={handleSelectYear}
          />

          {/* Treatment Admissions trend section */}
          <TreatmentTrendsView
            id="treatment-trends-section"
            yearRange={yearRange}
            selectedYear={selectedYear}
            onSelectYear={handleSelectYear}
          />
        </div>

        {/* Secondary Row: Timeline Visualizer */}
        <div className="grid grid-cols-1 gap-5" id="chronological-milestones">
          <TimelineView
            id="interactive-timeline-panel"
            selectedYear={selectedYear}
            onSelectYear={handleSelectYear}
            yearRange={yearRange}
          />
        </div>

        {/* Tertiary Row: Citations & Methodology Reference */}
        <DataSourcesView id="data-citations-panel" />

      </main>

      {/* Modern, clean footer */}
      <footer className="border-t border-slate-805 border-slate-800 bg-slate-900/20 py-5 text-center text-[10px] text-slate-400 mt-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Clinical Public Health Analytics. Built strictly on public federal registries.</p>
          <p className="mt-1 text-slate-500">This platform serves as a socio-clinical chronicle. Data is static and sourced directly from official archives.</p>
        </div>
      </footer>
    </div>
  );
}
