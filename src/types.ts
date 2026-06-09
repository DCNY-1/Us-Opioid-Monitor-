/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  category: 'marketing' | 'regulatory' | 'epidemiology' | 'legal';
  description: string;
  source: string;
  impactRating: 1 | 2 | 3 | 4 | 5; // 1 = Minimal context, 5 = Critical inflection point
}

export interface YearlyDataPoint {
  year: number;
  oxycodoneDistributedKg: number;
  prescriptionOpioidDeaths: number;
  prescriptionOpioidDeathRate: number; // death rate per 100k civilians
  tedsAdmissionsNortheast: number;
  tedsAdmissionsMidwest: number;
  tedsAdmissionsSouth: number;
  tedsAdmissionsWest: number;
  tedsAdmissionsTotal: number;
}

export type RegionKey = 'Northeast' | 'Midwest' | 'South' | 'West' | 'Total';

export interface RegionalMetrics {
  region: RegionKey;
  states: string[];
  totalAdmissionsCount: number;
  percentageOfNational: number;
}
