import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Heart,
  Pill,
  Calendar,
  AlertCircle,
  Apple,
  Moon,
  TrendingUp,
  TrendingDown,
  Upload,
  Sparkles,
  CheckCircle,
  Clock,
  Plus,
  ChevronRight,
  Filter,
  Eye,
  FileCheck,
  Scale,
  Droplets,
  Search,
  ShieldCheck,
  Camera,
  Loader2,
  Smartphone
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { geminiService, ExtractedReportData } from '../../services/geminiService';
import { HealthSubTab, LabResult, Medication, SymptomEntry } from '../../types/health';
import { SafetyBanner } from '../common/SafetyBanner';

export const HealthView: React.FC = () => {
  const {
    healthSubTab,
    setHealthSubTab,
    labResults,
    addLabResults,
    medications,
    toggleMedicationTaken,
    addMedication,
    appointments,
    addAppointment,
    symptoms,
    addSymptom,
    todayActivity,
    addWater,
    updateSteps,
    meals,
    addMeal,
    patient,
    openAssistantWithPrompt,
    setIsFitnessSyncModalOpen
  } = useHealth();

  // Lab Timeline Selected Metric & Timeframe
  const [selectedMetric, setSelectedMetric] = useState<string>('LDL Cholesterol');
  const [timelineRange, setTimelineRange] = useState<'7D' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  // Report Analyzer States
  const [isAnalyzingReport, setIsAnalyzingReport] = useState(false);
  const [extractedReport, setExtractedReport] = useState<ExtractedReportData | null>(null);
  const [selectedDemoSample, setSelectedDemoSample] = useState<string>('lipid-panel');

  // New item modal states
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Once daily');
  const [newMedPurpose, setNewMedPurpose] = useState('');

  const [isAddSymptomModalOpen, setIsAddSymptomModalOpen] = useState(false);
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomSeverity, setNewSymptomSeverity] = useState(3);
  const [newSymptomDuration, setNewSymptomDuration] = useState('1 hour');
  const [newSymptomTriggers, setNewSymptomTriggers] = useState('');

  // AI Meal Planner State
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<any>(null);
  const [mealDietGoal, setMealDietGoal] = useState('Cardiovascular Health & LDL Lowering');

  // Extract lab metrics list for the timeline
  const uniqueLabNames = Array.from(new Set(labResults.map(l => l.testName)));

  // Selected metric historical data points
  const metricHistory = labResults
    .filter(l => l.testName.toLowerCase() === selectedMetric.toLowerCase())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Function to simulate or execute multimodal upload analysis
  const handleAnalyzeSample = async (sampleType: string) => {
    setIsAnalyzingReport(true);
    setExtractedReport(null);

    try {
      let promptDoc = '';
      if (sampleType === 'lipid-panel') {
        promptDoc = `Quest Diagnostics Laboratory Report - Lamees Abdul Majeed (32 F) - Date: September 15, 2026.
Specimen: Serum Fasting (12 hrs).
Total Cholesterol: 218 mg/dL (Ref: < 200 mg/dL, Borderline High)
Triglycerides: 142 mg/dL (Ref: < 150 mg/dL, Normal)
HDL Cholesterol: 54 mg/dL (Ref: > 40 mg/dL, Optimal)
LDL Cholesterol (Calculated): 138 mg/dL (Ref: < 100 mg/dL, Borderline Elevated)
Fasting Blood Glucose: 94 mg/dL (Ref: 70 - 99 mg/dL, Normal)
HbA1c: 5.6% (Ref: < 5.7%, Normal)
eGFR: 94 mL/min/1.73m2 (Ref: > 60, Normal Renal Clearance)`;
      } else {
        promptDoc = `LabCorp Diagnostic Blood Panel - Date: September 2026. Complete Blood Count (CBC) with Differential.
Hemoglobin: 15.2 g/dL (Normal 13.8 - 17.2)
Hematocrit: 45% (Normal 40 - 52)
Platelet count: 245 x10^3/uL (Normal 150 - 450)
Serum Creatinine: 0.95 mg/dL (Normal 0.7 - 1.3)
AST / ALT (Liver Enzymes): 22 / 24 U/L (Normal < 40)`;
      }

      const result = await geminiService.analyzeMedicalReport(undefined, undefined, promptDoc);
      setExtractedReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingReport(false);
    }
  };

  const handleAddExtractsToTimeline = () => {
    if (!extractedReport) return;
    const newLabs: LabResult[] = extractedReport.tests.map((t, idx) => ({
      id: `lab-ext-${Date.now()}-${idx}`,
      date: '2026-09-28',
      testName: t.name,
      value: t.value,
      numericValue: typeof t.value === 'number' ? t.value : parseFloat(t.value) || undefined,
      unit: t.unit,
      referenceRange: t.referenceRange,
      status: t.status,
      category: t.name.toLowerCase().includes('cholesterol') || t.name.toLowerCase().includes('triglyceride') ? 'lipid' : 'metabolic',
      clinicalNote: t.clinicalNote,
      trendNotice: t.trendNotice
    }));

    addLabResults(newLabs);
    alert('Extracted lab parameters have been saved into your personal Lab Results Timeline!');
  };

  const handleCreateMealPlan = async () => {
    setIsGeneratingMealPlan(true);
    try {
      const plan = await geminiService.generateMealPlan(
        mealDietGoal,
        'Mediterranean style, rich in omega-3 and soluble fiber',
        2000,
        patient.allergies.join(', ')
      );
      setGeneratedMealPlan(plan);
    } finally {
      setIsGeneratingMealPlan(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Sub Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'labs', label: 'Lab Analytics & Timeline', icon: Activity },
          { id: 'analyzer', label: 'Report Analyzer (AI)', icon: Sparkles },
          { id: 'heart', label: 'Cardiovascular', icon: Heart },
          { id: 'meds', label: 'Medications', icon: Pill },
          { id: 'symptoms', label: 'Symptom Journal', icon: AlertCircle },
          { id: 'nutrition', label: 'Nutrition & Meals', icon: Apple },
          { id: 'sleep', label: 'Sleep & Recovery', icon: Moon },
          { id: 'fitness', label: 'Fitness & Goals', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = healthSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setHealthSubTab(tab.id as HealthSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: LAB RESULTS TIMELINE */}
      {healthSubTab === 'labs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Historical Diagnostic Lab Analytics
              </h2>
              <p className="text-xs text-slate-500">
                Track long-term trajectory across blood biomarkers and organ filtration tests
              </p>
            </div>

            <button
              onClick={() => setHealthSubTab('analyzer')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Lab Report</span>
            </button>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {['Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides', 'HbA1c', 'eGFR (Kidney Function)'].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedMetric === metric
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>

          {/* Interactive Chart & Trend Visualization */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Active Parameter
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {selectedMetric}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Latest: {metricHistory[metricHistory.length - 1]?.value} {metricHistory[metricHistory.length - 1]?.unit}
                  </span>
                </div>
              </div>

              {/* Time Range Filter Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
                {(['7D', '1M', '3M', '6M', '1Y', 'ALL'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimelineRange(r)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      timelineRange === r
                        ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive Trend Graph */}
            <div className="h-60 w-full relative pt-4">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal Reference Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />

                {/* Trend Polyline */}
                {metricHistory.length > 1 && (
                  <>
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={metricHistory.map((m, i) => {
                        const x = (i / (metricHistory.length - 1)) * 520 + 40;
                        const num = typeof m.value === 'number' ? m.value : parseFloat(m.value) || 100;
                        const y = 180 - Math.min(150, Math.max(20, (num / 250) * 160));
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {metricHistory.map((m, i) => {
                      const x = (i / (metricHistory.length - 1)) * 520 + 40;
                      const num = typeof m.value === 'number' ? m.value : parseFloat(m.value) || 100;
                      const y = 180 - Math.min(150, Math.max(20, (num / 250) * 160));
                      return (
                        <g key={m.id}>
                          <circle cx={x} cy={y} r="5.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
                          <text x={x} y={y - 12} textAnchor="middle" className="text-[11px] font-bold fill-slate-700 dark:fill-slate-200 font-mono">
                            {m.value} {m.unit}
                          </text>
                          <text x={x} y="195" textAnchor="middle" className="text-[10px] fill-slate-400">
                            {m.date}
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            </div>

            {/* Clinical Context & AI Explanation Bar */}
            <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-cyan-950 dark:text-cyan-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Clinical Trajectory: Improving
                </span>
                <p className="text-cyan-900/80 dark:text-cyan-300/80">
                  {selectedMetric} has shown a steady downward trajectory since starting lifestyle alterations and therapy in June.
                </p>
              </div>
              <button
                onClick={() => openAssistantWithPrompt(`Explain my historical trend for ${selectedMetric} over the past year and what questions I should ask my doctor.`)}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shrink-0 transition-colors"
              >
                Explain with AI →
              </button>
            </div>
          </div>

          {/* Historical Labs Data Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Diagnostic Parameters
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Test Parameter</th>
                    <th className="pb-3">Result</th>
                    <th className="pb-3">Reference Range</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {labResults.slice(0, 8).map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {test.testName}
                      </td>
                      <td className="py-3 font-bold font-mono text-slate-800 dark:text-slate-200">
                        {test.value} <span className="text-[10px] font-normal text-slate-400">{test.unit}</span>
                      </td>
                      <td className="py-3 text-slate-500 font-mono">
                        {test.referenceRange}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          test.status === 'Optimal' || test.status === 'Normal'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {test.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {test.date}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => openAssistantWithPrompt(`Explain what my ${test.testName} of ${test.value} ${test.unit} (reference ${test.referenceRange}) means in simple language.`)}
                          className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                        >
                          Ask AI
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MULTIMODAL MEDICAL REPORT ANALYZER */}
      {healthSubTab === 'analyzer' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Multimodal Medical Report Analyzer
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300">
                  Powered by Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload blood panels, pathology summaries, ECG traces, or prescriptions for instant structured clinical extraction.
              </p>
            </div>
          </div>

          {/* Interactive Document Dropzone / Sample Selector */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-cyan-400/60 dark:border-cyan-700/60 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-7 h-7 animate-bounce" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Drag and drop your medical report, or choose a demo document
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Supports PDF, JPEG, PNG lab results, Quest / LabCorp pathology sheets, and clinical discharge summaries.
              </p>
            </div>

            {/* Quick Demo Preload Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedDemoSample('lipid-panel');
                  handleAnalyzeSample('lipid-panel');
                }}
                disabled={isAnalyzingReport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs"
              >
                <FileCheck className="w-4 h-4 text-cyan-600" />
                <span>Preload Sample 1: Cardio-Lipid & Metabolic Panel</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDemoSample('cbc-panel');
                  handleAnalyzeSample('cbc-panel');
                }}
                disabled={isAnalyzingReport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs"
              >
                <FileCheck className="w-4 h-4 text-purple-600" />
                <span>Preload Sample 2: CBC & Renal Clearance</span>
              </button>
            </div>

            {isAnalyzingReport && (
              <div className="flex items-center justify-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold pt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini is extracting biomarkers, reference intervals, and clinical notes...</span>
              </div>
            )}
          </div>

          {/* Analysis Results Display */}
          {extractedReport && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Executive Summary Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-teal-950 text-white shadow-xl border border-teal-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Clinical Summary of Uploaded Report
                  </span>
                  <button
                    onClick={handleAddExtractsToTimeline}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Save to My Health Timeline
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {extractedReport.summary}
                </p>

                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-bold text-teal-300">Key Diagnostic Findings:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {extractedReport.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Extracted Tests Table */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Extracted Lab Biomarkers ({extractedReport.tests.length} Parameters)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Test</th>
                        <th className="pb-3">Result</th>
                        <th className="pb-3">Reference</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Clinical Explanation</th>
                        <th className="pb-3 text-right">Inquiry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {extractedReport.tests.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">
                            {t.name}
                          </td>
                          <td className="py-3 font-bold font-mono text-slate-800 dark:text-slate-200">
                            {t.value} {t.unit}
                          </td>
                          <td className="py-3 text-slate-500 font-mono">
                            {t.referenceRange}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.status === 'Optimal' || t.status === 'Normal'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-300 max-w-xs">
                            {t.clinicalNote || 'Standard circulating serum parameter.'}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => openAssistantWithPrompt(`Explain why ${t.name} was ${t.value} ${t.unit} and what lifestyle factors influence this.`)}
                              className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
                            >
                              Explain →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Questions to Ask Doctor Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600" /> Questions Recommended for Your Healthcare Provider
                </h4>
                <div className="space-y-2">
                  {extractedReport.questionsForDoctor.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: CARDIOVASCULAR HEALTH */}
      {healthSubTab === 'heart' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Cardiovascular & Hemodynamic Health
            </h2>
            <p className="text-xs text-slate-500">
              Correlating blood pressure, resting heart rate, and serum lipid fractions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Blood Pressure</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {todayActivity.systolicBP}/{todayActivity.diastolicBP} <span className="text-xs font-normal text-slate-400">mmHg</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                Within pre-hypertensive desirable bounds
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Resting Heart Rate</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {todayActivity.restingHeartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                -3 bpm reduction over 90-day activity protocol
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">LDL / HDL Ratio</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                2.55 <span className="text-xs font-normal text-slate-400">ratio</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                Desirable ratio is &lt; 3.0
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Cardiovascular Risk Reduction Strategy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your clinical record, consistent moderate aerobic exercise (30+ minutes 5 days a week) alongside Atorvastatin 10mg has lowered your circulating LDL from 146 to 138 mg/dL while increasing your protective HDL from 48 to 54 mg/dL.
            </p>
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => openAssistantWithPrompt("What lifestyle choices and dietary fibers best accelerate cardiovascular arterial health?")}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-colors"
              >
                Discuss Heart Plan with AI →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: MEDICATIONS */}
      {healthSubTab === 'meds' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Prescription & Supplement Management
              </h2>
              <p className="text-xs text-slate-500">
                Adherence tracking, dose schedules, and pharmacist consultation prompts
              </p>
            </div>

            <button
              onClick={() => setIsAddMedModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {med.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">{med.dosage} • {med.frequency}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                      {med.timing[0]}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p><strong>Purpose:</strong> {med.purpose}</p>
                    <p><strong>Prescribed by:</strong> {med.prescriber}</p>
                    {med.notes && <p className="text-[11px] text-slate-500 italic mt-1">"{med.notes}"</p>}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {med.remainingPills} doses remaining
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAssistantWithPrompt(`What should I ask my pharmacist or doctor about ${med.name} (${med.dosage})?`)}
                      className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold text-[11px]"
                    >
                      Ask AI
                    </button>
                    <button
                      onClick={() => toggleMedicationTaken(med.id, 0)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        med.takenToday[0]
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                    >
                      {med.takenToday[0] ? '✓ Taken' : 'Take Dose'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Medication Modal */}
          {isAddMedModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add New Medication
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Medication Name</label>
                    <input
                      type="text"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      placeholder="e.g. Lisinopril, Metformin"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Dose</label>
                    <input
                      type="text"
                      value={newMedDose}
                      onChange={(e) => setNewMedDose(e.target.value)}
                      placeholder="e.g. 10 mg tablet"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Frequency</label>
                    <input
                      type="text"
                      value={newMedFreq}
                      onChange={(e) => setNewMedFreq(e.target.value)}
                      placeholder="e.g. Once daily in morning"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Indication / Reason</label>
                    <input
                      type="text"
                      value={newMedPurpose}
                      onChange={(e) => setNewMedPurpose(e.target.value)}
                      placeholder="e.g. Blood pressure regulation"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddMedModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newMedName) return;
                      addMedication({
                        name: newMedName,
                        dosage: newMedDose || 'Standard dose',
                        frequency: newMedFreq,
                        timing: ['09:00 AM'],
                        prescriber: 'Prescribing Physician',
                        purpose: newMedPurpose || 'Therapeutic maintenance',
                        startDate: new Date().toISOString().split('T')[0],
                        remainingPills: 30,
                        refillReminder: true
                      });
                      setIsAddMedModalOpen(false);
                      setNewMedName('');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold"
                  >
                    Save Medication
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 5: SYMPTOM JOURNAL */}
      {healthSubTab === 'symptoms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Symptom & Trigger Journal
              </h2>
              <p className="text-xs text-slate-500">
                Record discomfort episodes and let AI correlate potential triggers for doctor discussion
              </p>
            </div>

            <button
              onClick={() => setIsAddSymptomModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Symptom</span>
            </button>
          </div>

          <div className="space-y-3">
            {symptoms.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.symptom}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.severity <= 3 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      Severity: {s.severity}/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {s.date} at {s.time} • Duration: {s.duration} • Location: {s.location}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Possible Triggers:</strong> {s.possibleTriggers}
                  </p>
                  {s.notes && (
                    <p className="text-[11px] text-slate-500 italic">"{s.notes}"</p>
                  )}
                </div>

                <button
                  onClick={() => openAssistantWithPrompt(`I logged "${s.symptom}" (severity ${s.severity}/10, duration ${s.duration}, triggers: ${s.possibleTriggers}). What patterns should I monitor and what questions should I ask my doctor?`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition-colors shrink-0"
                >
                  Analyze Pattern →
                </button>
              </div>
            ))}
          </div>

          {/* Add Symptom Modal */}
          {isAddSymptomModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Log New Symptom
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Symptom Description</label>
                    <input
                      type="text"
                      value={newSymptomName}
                      onChange={(e) => setNewSymptomName(e.target.value)}
                      placeholder="e.g. Mild headache, shoulder stiffness, fatigue"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Severity (1 mild - 10 severe): <span className="font-bold text-cyan-600">{newSymptomSeverity}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newSymptomSeverity}
                      onChange={(e) => setNewSymptomSeverity(parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Duration</label>
                    <input
                      type="text"
                      value={newSymptomDuration}
                      onChange={(e) => setNewSymptomDuration(e.target.value)}
                      placeholder="e.g. 45 minutes"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Possible Triggers</label>
                    <input
                      type="text"
                      value={newSymptomTriggers}
                      onChange={(e) => setNewSymptomTriggers(e.target.value)}
                      placeholder="e.g. Poor sleep, screen time, skipped meal"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddSymptomModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newSymptomName) return;
                      addSymptom({
                        date: new Date().toISOString().split('T')[0],
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        symptom: newSymptomName,
                        severity: newSymptomSeverity,
                        duration: newSymptomDuration,
                        location: 'General',
                        possibleTriggers: newSymptomTriggers || 'Not specified'
                      });
                      setIsAddSymptomModalOpen(false);
                      setNewSymptomName('');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 6: NUTRITION & AI MEAL PLANNER */}
      {healthSubTab === 'nutrition' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Nutrition Intelligence & AI Meal Planner
              </h2>
              <p className="text-xs text-slate-500">
                Log meals, analyze food photos with Gemini, and generate heart-healthy Mediterranean meal plans
              </p>
            </div>

            <button
              onClick={handleCreateMealPlan}
              disabled={isGeneratingMealPlan}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingMealPlan ? 'Planning...' : 'Generate AI Meal Plan'}</span>
            </button>
          </div>

          {/* Today's Meals Log */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {meals.map((meal) => (
              <div key={meal.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {meal.type} • {meal.time}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {meal.calories} kcal
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {meal.name}
                </h4>
                <div className="flex gap-2 text-[11px] text-slate-500">
                  <span>Protein: {meal.proteinGrams}g</span>
                  <span>Carbs: {meal.carbsGrams}g</span>
                  <span>Fat: {meal.fatGrams}g</span>
                </div>
                {meal.highlights && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {meal.highlights.map((h, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Generated Meal Plan Display */}
          {generatedMealPlan && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Apple className="w-4 h-4 text-emerald-600" /> {generatedMealPlan.planName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daily Totals: {generatedMealPlan.dailyTotals?.calories} kcal • {generatedMealPlan.dailyTotals?.protein} protein
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Evidence-based
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {generatedMealPlan.meals?.map((m: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-700 dark:text-cyan-300">{m.type}: {m.title}</span>
                      <span className="text-slate-400">{m.calories} kcal</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{m.description}</p>
                    <p className="text-[11px] text-emerald-600">Key Nutrients: {m.keyNutrients?.join(', ')}</p>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {generatedMealPlan.safetyNotice}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 7: SLEEP & RECOVERY */}
      {healthSubTab === 'sleep' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sleep Architecture & Circadian Recovery
            </h2>
            <p className="text-xs text-slate-500">
              Tracking duration, sleep stages, REM cycles, and nighttime autonomic recovery
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Sleep Score</span>
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                87 <span className="text-xs font-normal text-slate-400">/ 100</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Optimal Restoration</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Duration</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                7h 22m
              </p>
              <p className="text-xs text-slate-500 mt-1">Bed: 10:45 PM • Wake: 6:07 AM</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Deep Sleep</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                21% <span className="text-xs font-normal text-slate-400">(1h 33m)</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Physical cellular repair</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">REM Sleep</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                24% <span className="text-xs font-normal text-slate-400">(1h 46m)</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Cognitive consolidation</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" /> Circadian Rhythm AI Observation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your sleep duration was consistent across Tuesday through Friday, but showed a 45-minute bedtime delay on Saturday night. Keeping a steady bedtime within a 30-minute window helps synchronize your peripheral biological clocks and supports healthy morning cortisol curves.
            </p>
            <button
              onClick={() => openAssistantWithPrompt("How does sleep consistency impact my morning blood pressure and cholesterol synthesis?")}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Ask AI about sleep & metabolism →
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 8: FITNESS & GOALS */}
      {healthSubTab === 'fitness' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Fitness Tracking & Movement Goals
              </h2>
              <p className="text-xs text-slate-500">
                Track steps, distance, active minutes, and weekly cardiovascular targets
              </p>
            </div>
            <button
              onClick={() => setIsFitnessSyncModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pair Phone / Wearable</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Today's Steps</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {todayActivity.steps.toLocaleString()}
              </p>
              <p className="text-xs text-cyan-600 font-semibold mt-1">98% of 8,000 goal</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Distance</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {todayActivity.distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Outdoor walking & strides</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Energy</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {todayActivity.caloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Metabolically active</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Weekly Cardio</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                168 <span className="text-xs font-normal text-slate-400">mins</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Exceeds 150m AHA target</p>
            </div>
          </div>
        </div>
      )}

      {/* Safety Banner */}
      <SafetyBanner compact />
    </div>
  );
};
