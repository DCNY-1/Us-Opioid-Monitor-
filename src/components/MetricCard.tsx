/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  icon: LucideIcon;
  colorClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  colorClass
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/40 border border-slate-700/80 rounded p-3 shadow-sm flex flex-col justify-between hover:border-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider leading-none">
            {title}
          </span>
          <h3 className="text-2xl font-semibold text-slate-100 font-mono tracking-tight mt-1">
            {value}
          </h3>
        </div>
        <div className={`p-1.5 rounded ${colorClass.split(' ')[0]} bg-opacity-10 ${colorClass.split(' ')[1]} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="mt-2.5 pt-2 border-t border-slate-750 border-slate-800/60 flex items-center justify-between text-[10px]">
        <span className="text-slate-400 line-clamp-1">
          {subtitle}
        </span>
        
        {trend && (
          <span
            className={`font-semibold px-2 py-0.5 rounded shrink-0 font-mono ${
              trend.type === 'up'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : trend.type === 'down'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border border-slate-700/40'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
};
