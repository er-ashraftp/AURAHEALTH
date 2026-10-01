import React from 'react';
import {
  Heart,
  Activity,
  Moon,
  Apple,
  Droplets,
  Scale,
  Brain,
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Pill,
  Calendar,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Smartphone
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { SafetyBanner } from '../common/SafetyBanner';

export const HomeDashboard: React.FC = () => {
  const {
    patient,
    overallHealthScore,
    todayActivity,
    addWater,
    updateSteps,
    medications,
    toggleMedicationTaken,
    appointments,
    setCurrentTab,
    setHealthSubTab,
    openAssistantWithPrompt,
    setIsFitnessSyncModalOpen
  } = useHealth();

  const activeStatin = medications.find(m => m.name.includes('Atorvastatin'));
  const nextAppointment = appointments.find(a => a.status === 'upcoming');

  const stepPercent = Math.min(100, Math.round((todayActivity.steps / todayActivity.targetSteps) * 100));
  const waterPercent = Math.min(100, Math.round((todayActivity.waterIntakeMl / todayActivity.targetWaterMl) * 100));
  const exercisePercent = Math.min(100, Math.round((todayActivity.activeMinutes / todayActivity.targetActiveMinutes) * 100));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner Notice */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Demo Patient Environment • Realistic Synthetic Records Active
        </span>
        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
          Last Synced: 2 mins ago
        </span>
      </div>

      {/* Greeting & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good morning, {patient.name.split(' ')[0]} 👋
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300">
              Wellness Mode
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your comprehensive clinical snapshot and vitality metrics for today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFitnessSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-semibold shadow-xs transition-colors"
            title="Pair Phone or Fitness Tracker"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Pair Phone</span>
          </button>
          <button
            onClick={() => addWater(250)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span>+250ml Water</span>
          </button>
          <button
            onClick={() => updateSteps(500)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>+500 Steps</span>
          </button>
          <button
            onClick={() => {
              setCurrentTab('health');
              setHealthSubTab('analyzer');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Lab</span>
          </button>
        </div>
      </div>

      {/* Hero Grid: Overall Health Score & Activity Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Overall Health Score Card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-800/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Overall Health Index
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 font-medium">
                Clinical Grade A-
              </span>
            </div>

            <div className="flex items-center gap-6 my-5">
              {/* Circular Score Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * overallHealthScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold tracking-tight">{overallHealthScore}</span>
                  <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Optimal Equilibrium</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Composite score evaluated from your recent blood biomarkers, cardiovascular response, sleep efficiency, and activity patterns.
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +4 pts since July lifestyle adjustments
                </span>
              </div>
            </div>
          </div>

          {/* Sub-score Pillars */}
          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-teal-800/40 text-center">
            <div>
              <p className="text-[10px] text-teal-300">Cardio</p>
              <p className="text-sm font-bold">85%</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-300">Metabolic</p>
              <p className="text-sm font-bold">89%</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-300">Recovery</p>
              <p className="text-sm font-bold">84%</p>
            </div>
            <div>
              <p className="text-[10px] text-teal-300">Lifestyle</p>
              <p className="text-sm font-bold">92%</p>
            </div>
          </div>
        </div>

        {/* Today's Activity & Progress Rings */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Daily Progress
              </h2>
              <p className="text-xs text-slate-500">Real-time biometrics & daily habit fulfillment</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFitnessSyncModalOpen(true)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center gap-1 transition-colors"
                title="Pair Phone or Fitness Device"
              >
                <Smartphone className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>Pair Phone / Sync</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab('health');
                  setHealthSubTab('fitness');
                }}
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline"
              >
                <span>View Fitness Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Steps Ring */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-500"
                    strokeDasharray={`${stepPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400 absolute" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Steps</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {todayActivity.steps.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">Goal: {todayActivity.targetSteps.toLocaleString()}</p>
              </div>
            </div>

            {/* Water Ring */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    strokeDasharray={`${waterPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <Droplets className="w-4 h-4 text-blue-500 absolute" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Hydration</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {(todayActivity.waterIntakeMl / 1000).toFixed(1)} L
                </p>
                <p className="text-[10px] text-slate-500">Goal: {(todayActivity.targetWaterMl / 1000).toFixed(1)} L</p>
              </div>
            </div>

            {/* Exercise Ring */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${exercisePercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <TrendingUp className="w-4 h-4 text-emerald-500 absolute" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Active Time</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {todayActivity.activeMinutes} mins
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold">126% of target</p>
              </div>
            </div>
          </div>

          {/* Secondary Progress Bar Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-500" /> Sleep Duration:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                7 hrs 22 mins (Score 87/100)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Resting Heart Rate:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {todayActivity.restingHeartRate} bpm (Normal Sinus)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Daily Insight Highlight Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 dark:from-cyan-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-cyan-200/80 dark:border-cyan-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500 text-white shadow-md shadow-cyan-500/25 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                AuraHealth Clinical Insight
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700">
                Cardiovascular Correlation
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              “Your aerobic activity has increased by 18% this month, positively correlating with a 3 bpm drop in your resting heart rate.”
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Data shows 38 average active minutes daily. Your latest lipid panel also showed an 8 mg/dL reduction in LDL cholesterol.
            </p>
          </div>
        </div>

        <button
          onClick={() => openAssistantWithPrompt("Can you explain why my 18% increase in activity helped lower my resting heart rate and support my LDL reduction?")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md shadow-cyan-700/20 whitespace-nowrap transition-all self-end md:self-center"
        >
          <span>Ask AI why</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Today's Health Summary 8-Card Interactive Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Today's Health Summary
            </h2>
            <p className="text-xs text-slate-500">Tap any module to view clinical analytics & history</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1: Heart Health */}
          <div
            onClick={() => {
              setCurrentTab('health');
              setHealthSubTab('heart');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Heart Health</span>
              <div className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              {todayActivity.systolicBP}/{todayActivity.diastolicBP}
              <span className="text-xs font-normal text-slate-400 ml-1">mmHg</span>
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Resting HR: {todayActivity.restingHeartRate} bpm
            </p>
          </div>

          {/* Card 2: Activity */}
          <div
            onClick={() => {
              setCurrentTab('health');
              setHealthSubTab('fitness');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Physical Activity</span>
              <div className="p-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-500 group-hover:scale-110 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              {todayActivity.steps.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 ml-1">steps</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {todayActivity.distanceKm} km • {todayActivity.caloriesBurned} kcal
            </p>
          </div>

          {/* Card 3: Sleep */}
          <div
            onClick={() => {
              setCurrentTab('health');
              setHealthSubTab('sleep');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Sleep & Rest</span>
              <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 group-hover:scale-110 transition-transform">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              7h 22m
              <span className="text-xs font-normal text-slate-400 ml-1">last night</span>
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Sleep Score: 87/100 (Optimal)
            </p>
          </div>

          {/* Card 4: Nutrition */}
          <div
            onClick={() => {
              setCurrentTab('health');
              setHealthSubTab('nutrition');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Nutrition</span>
              <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 group-hover:scale-110 transition-transform">
                <Apple className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              1,130
              <span className="text-xs font-normal text-slate-400 ml-1">/ 2,100 kcal</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              73g Protein logged today
            </p>
          </div>

          {/* Card 5: Stress & Mind */}
          <div
            onClick={() => openAssistantWithPrompt("What evidence-based practices reduce physiological stress and autonomic arousal?")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Stress Index</span>
              <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-500 group-hover:scale-110 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              Low
              <span className="text-xs font-normal text-slate-400 ml-1">HRV 58ms</span>
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Autonomic balance stable
            </p>
          </div>

          {/* Card 6: Hydration */}
          <div
            onClick={() => addWater(500)}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Hydration</span>
              <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 group-hover:scale-110 transition-transform">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              {(todayActivity.waterIntakeMl / 1000).toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 2.5 L</span>
            </p>
            <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mt-1">
              + Tap to add 500ml
            </p>
          </div>

          {/* Card 7: Weight & Body */}
          <div
            onClick={() => {
              setCurrentTab('health');
              setHealthSubTab('overview');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Weight & BMI</span>
              <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 group-hover:scale-110 transition-transform">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              {todayActivity.weightKg}
              <span className="text-xs font-normal text-slate-400 ml-1">kg</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              BMI 25.3 • Target: {patient.targetWeightKg} kg
            </p>
          </div>

          {/* Card 8: Diagnostic Labs */}
          <div
            onClick={() => {
              setCurrentTab('health');
              setHealthSubTab('labs');
            }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 cursor-pointer transition-all shadow-xs hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Lab Panel</span>
              <div className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-500 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              Sep 15
              <span className="text-xs font-normal text-slate-400 ml-1">Results</span>
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
              LDL 138 mg/dL (Improving)
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recommendations & Actionable Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Evidence-Based Recommendations */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" /> Today's Recommendations
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300">
              Personalized
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Complete a 20-minute brisk walk
                </p>
                <p className="text-slate-500 mt-0.5">
                  150 more steps needed to hit your 8,000 daily goal. Aerobic strides help maintain HDL sterol efflux capacity.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Drink 400ml more water before dinner
                </p>
                <p className="text-slate-500 mt-0.5">
                  Your current total is 2.1L. Reaching 2.5L assists renal filtration and prevents screen-induced tension headaches.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Take Atorvastatin 10mg at 9:30 PM
                </p>
                <p className="text-slate-500 mt-0.5">
                  Bedtime dosing coincides with peak hepatic cholesterol synthesis for maximum efficacy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medication Routine & Upcoming Consultation */}
        <div className="space-y-4">
          {/* Active Medication Card */}
          {activeStatin && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
                    Scheduled Medication
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeStatin.name} ({activeStatin.dosage})
                  </h4>
                  <p className="text-xs text-slate-500">
                    {activeStatin.timing[0]} • {activeStatin.remainingPills} pills remaining
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleMedicationTaken(activeStatin.id, 0)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeStatin.takenToday[0]
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                }`}
              >
                {activeStatin.takenToday[0] ? '✓ Taken Today' : 'Mark as Taken'}
              </button>
            </div>
          )}

          {/* Upcoming Doctor Visit */}
          {nextAppointment && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-600 tracking-wider">
                      Upcoming Consultation
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {nextAppointment.doctor}
                    </h4>
                    <p className="text-xs text-slate-500">{nextAppointment.specialty}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {nextAppointment.date}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">{nextAppointment.purpose}</span>
                <button
                  onClick={() => {
                    setCurrentTab('insights');
                  }}
                  className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Prepare Summary →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <SafetyBanner />
    </div>
  );
};
