# US Opioid Monitor

A comprehensive React-based analytics dashboard and monitoring tool designed to track, analyze, and visualize historical commercial prescription opioid distribution data alongside national prescription opioid-related mortality trends from 1999 to 2021. The dashboard aims to provide clear data views to understand the correlation between oxycodone distribution volume, mortality rates, and treatment admissions (TEDS) over key historical eras.

## 📊 Key Features

- **Dynamic Interactive Dashboard**: Filter analytic timelines across key opioid epidemic eras (e.g., Rise in Prescribing, Reformulation Era, Fentanyl Surge) or manually specify multi-year window intervals.
- **Correlation Visualizations**: Direct charting of oxycodone distribution kilograms against prescription opioid deaths and death rates per 100,000 people.
- **State Admissions Trends (TEDS)**: Interactive monitoring of medication-assisted treatment admissions, highlighting changes in primary substances of abuse and demographics.
- **Timeline & Milestones**: Detailed chronology of federal, medical, and clinical policy milestones that shaped the course of public health responses.
- **Fluid & Responsive UI**: Clean typography pairing "Inter" and "JetBrains Mono" fonts on a modern high-contrast interface designed with Tailwind CSS and Motion.

## 🛠️ Built With

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (animation library)
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To run the application locally on your machine, follow these simple steps:

### 1. Prerequisites

Make sure you have Node.js (version 20 or greater) installed:

```bash
node -v
```

### 2. Installation

Install project dependencies using your preferred package manager:

```bash
npm install
```

### 3. Start Development Server

Run the local development server:

```bash
npm run dev
```

Your browser will automatically open the app at `http://localhost:3000` (or the configured workspace address).

### 4. Build for Production

To build a productionic, optimized version of the app:

```bash
npm run build
```

This compiles static assets into the `/dist` directory.

## 🌐 Deploying to GitHub Pages

This repository is equipped with a GitHub Actions workflow to deploy the app directly to GitHub Pages.

1. Go to the repository's **Settings** tab on GitHub.
2. In the left-hand navigation, under **Code and automation**, click **Pages**.
3. Under **Build and deployment**:
   - Set **Source** to **GitHub Actions**.
4. Push a change to the `main` (or `master`) branch. The automated deploy-to-pages action will trigger, build your applet using Node.js 22, and host your static site perfectly!
