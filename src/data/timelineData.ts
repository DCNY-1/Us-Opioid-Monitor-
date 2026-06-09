/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TimelineEvent } from '../types';

export const timelineEvents: TimelineEvent[] = [
  {
    id: '1995-approval',
    year: 1995,
    title: 'FDA Approves OxyContin',
    category: 'regulatory',
    description: 'The FDA approves OxyContin (oxycodone HCl controlled-release) for moderate-to-severe pain lasting more than a few days. The original FDA-approved label controversially declared that "delayed absorption... is believed to reduce the abuse liability of a drug," despite a lack of scientific, clinical trials to verify this claim.',
    source: 'FDA Policy & Regulatory Review Archives',
    impactRating: 5
  },
  {
    id: '1996-launch',
    year: 1996,
    title: 'OxyContin Commercial Launch',
    category: 'marketing',
    description: 'Purdue Pharma launches OxyContin on the domestic market, backing it with an unprecedented sales campaign. Purdue targeted primary care physicians with branded promotional merchandise, sponsored medical conferences, and implemented a physician-incentive system that rewarded the high-volume prescribing of high-strength tablets.',
    source: 'American Journal of Public Health (AJPH)',
    impactRating: 5
  },
  {
    id: '1999-first-wave',
    year: 1999,
    title: 'CDC "First Wave" Begins',
    category: 'epidemiology',
    description: 'Overdose deaths involving prescription opioids rise significantly above historical baselines, registering 3,442 deaths for the year. This marks what the CDC taxonomizes as the "First Wave" of the opioid overdose epidemic, directly driven by prescription opioid prescribing increases.',
    source: 'CDC National Center for Health Statistics (NCHS)',
    impactRating: 4
  },
  {
    id: '2001-warning-label',
    year: 2001,
    title: 'FDA Orders "Black Box" Warning',
    category: 'regulatory',
    description: 'The FDA mandates a major label modification for OxyContin. The agency orders the addition of a prominent "Black Box" warning — the FDA\'s most severe warning category — asserting the drug\'s high potential for abuse, physical dependence, and respiratory depression, while striking the unsubstantiated claim of reduced abuse liability.',
    source: 'FDA Safety Alerts & Communications',
    impactRating: 5
  },
  {
    id: '2002-congressional-hearing',
    year: 2002,
    title: 'Senate Hearing on OxyContin Abuse',
    category: 'legal',
    description: 'The US Senate Committee on Health, Education, Labor, and Pensions holds formal hearings on OxyContin. The proceedings highlight widespread diversion, crushing/snorting administration methods used by abusers, and the severe concentration of addiction epidemics in Appalachia, New England, and rural areas.',
    source: 'US Senate Congressional Record',
    impactRating: 3
  },
  {
    id: '2003-fda-warning-letter',
    year: 2003,
    title: 'FDA Warns Purdue on Misleading Ads',
    category: 'regulatory',
    description: 'The FDA issues a highly critical warning letter to Purdue Pharma regarding two-page journal advertisements that omitted safety information and minimized the drug\'s serious risks, claiming OxyContin could reduce patients\' overall pain sensitivity while ignoring life-threatening respiratory hazards.',
    source: 'FDA Division of Drug Marketing, Advertising, and Communications',
    impactRating: 4
  },
  {
    id: '2007-guilty-plea',
    year: 2007,
    title: 'Purdue Pleads Guilty to Misbranding',
    category: 'legal',
    description: 'Purdue Frederick Co. enters a guilty plea in US federal court on criminal charges of misbranding OxyContin "with intent to defraud or mislead." Purdue and three top executives acknowledge they falsely claimed the drug was less addictive and less subject to abuse than other painkillers. They are ordered to pay $634.5 million in criminal and civil penalties.',
    source: 'US Department of Justice (DOJ) Settlement Press Archives',
    impactRating: 5
  },
  {
    id: '2010-abuse-deterrent',
    year: 2010,
    title: 'Abuse-Deterrent Reformulation',
    category: 'regulatory',
    description: 'Purdue Pharma stops shipping the original OxyContin formulation, replacing it with a new "abuse-deterrent" version (OxyContin OP). The new tablets contain a hard polymer matrix that makes them much harder to crush, and they form a thick gel when mixed with liquids, making snorting or injection difficult.',
    source: 'FDA Joint Advisory Committee Proceedings',
    impactRating: 5
  },
  {
    id: '2011-second-wave',
    year: 2011,
    title: 'CDC "Second Wave" Heroin Peak',
    category: 'epidemiology',
    description: 'Prescription opioid deaths hover around historic highs of 15,131, but regulatory tightening, decreased prescribing, and the introducing of the abuse-deterrent OxyContin formula unintendedly push users toward cheaper, highly potent illicit drugs. This starts the "Second Wave" — a catastrophic rise in heroin-involved overdose deaths.',
    source: 'CDC National Center for Health Statistics (NCHS)',
    impactRating: 4
  },
  {
    id: '2013-third-wave',
    year: 2013,
    title: 'CDC "Third Wave" Synthetic Surge',
    category: 'epidemiology',
    description: 'The US enters the "Third Wave" of the opioid epidemic. This phase is characterized by a violent, exponential rise in overdose deaths involving synthetic opioids, primarily illicitly manufactured fentanyl (IMF), which is frequently pressed into counterfeit prescription pills.',
    source: 'CDC Morbidity and Mortality Weekly Report (MMWR)',
    impactRating: 5
  },
  {
    id: '2016-prescribing-guideline',
    year: 2016,
    title: 'CDC Issues Prescribing Guideline',
    category: 'regulatory',
    description: 'The CDC issues its "Guideline for Prescribing Opioids for Chronic Pain" to help primary care clinicians provide safer pain management, setting clear thresholds for Morphine Milligram Equivalents (MME) per day and urging non-opioid treatments as first-line therapies.',
    source: 'CDC Guideline Publication / HHS',
    impactRating: 4
  },
  {
    id: '2019-purdue-bankruptcy',
    year: 2019,
    title: 'Purdue Pharma Files for Bankruptcy',
    category: 'legal',
    description: 'Faced with more than 2,900 lawsuits from state governments, counties, cities, and tribes, Purdue Pharma files for Chapter 11 bankruptcy. The filing initiates a prolonged, highly controversial restructuring process involving billions of dollars in proposed funding for addiction treatment and opioid remediation programs.',
    source: 'US Bankruptcy Court (Southern District of New York)',
    impactRating: 5
  },
  {
    id: '2020-pandemic-spike',
    year: 2020,
    title: 'COVID-19 Pandemic Overdose Spike',
    category: 'epidemiology',
    description: 'The isolation, economic instability, disruption of outreach services, and increasingly unstable illicit drug supply chain during COVID-19 lock-downs prompt a severe surge in fatal overdoses. Prescription opioid deaths climb from 14,139 to 16,416, while synthetic opioid deaths reach record levels.',
    source: 'CDC National Vital Statistics System (NVSS)',
    impactRating: 4
  },
  {
    id: '2021-multistate-settlement',
    year: 2021,
    title: '$26 Billion Multistate Opioid Settlement',
    category: 'legal',
    description: 'A coalition of state attorneys general negotiates a final public health reclamation settlement of $26 billion with the nation\'s three major pharmaceutical distributors (AmerisourceBergen, Cardinal Health, and McKesson) along with manufacturer Johnson & Johnson, routing vast funds strictly into local opioid recovery.',
    source: 'National Association of Attorneys General (NAAG)',
    impactRating: 5
  }
];
