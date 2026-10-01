import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Target,
  Activity,
  Bell,
  Lock,
  ArrowRight,
  CheckCircle,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, triggerCelebration } = useHealth();
  const [step, setStep] = useState(1);

  // User selections in onboarding
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Understand lab results & trends',
    'Improve cardiovascular health',
    'Prepare for doctor visits'
  ]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Diagnostic Labs & Blood Tests',
    'Heart Rate & Blood Pressure',
    'Medication Reminders',
    'Sleep & Recovery'
  ]);
  const [syncWearables, setSyncWearables] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  if (!isOnboardingOpen) return null;

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const toggleArea = (a: string) => {
    setSelectedAreas(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const handleFinish = () => {
    triggerCelebration();
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Progress Bar Header */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Step {step} of 6
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= step ? 'w-6 bg-cyan-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Contents */}
        <div className="p-6 sm:p-8 space-y-6 min-h-[360px] flex flex-col justify-between">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/25">
                <Heart className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Welcome to AuraHealth AI
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your intelligent digital health companion combining personal wellness tracking, clinical intelligence, lab report analysis, and doctor consultation preparation.
              </p>
              <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-cyan-900 dark:text-cyan-200 text-xs">
                💡 <em>Designed to empower healthcare decisions alongside qualified clinicians.</em>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  What are your primary health goals?
                </h3>
                <p className="text-xs text-slate-500">
                  Select all that apply to personalize your dashboard and clinical insights.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Understand lab results & trends',
                  'Improve cardiovascular health',
                  'Prepare for doctor visits',
                  'Manage daily medications',
                  'Optimize sleep & recovery',
                  'Maintain balanced nutrition'
                ].map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-950 dark:text-cyan-100 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Areas to track */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Which health areas do you want to track?
                </h3>
                <p className="text-xs text-slate-500">
                  Choose the modules you'd like to feature on your daily snapshot.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Diagnostic Labs & Blood Tests',
                  'Heart Rate & Blood Pressure',
                  'Medication Reminders',
                  'Sleep & Recovery',
                  'Hydration & Water Goal',
                  'Symptom & Trigger Journal',
                  'Nutrition & Food Analyzer',
                  'Weight & Body Composition'
                ].map((area) => {
                  const isSelected = selectedAreas.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => toggleArea(area)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{area}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Health Data Connection */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Connect your health data (Optional)
                </h3>
                <p className="text-xs text-slate-500">
                  AuraHealth can ingest metrics from wearables and lab patient portals.
                </p>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-300">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Wearable & Fitness Trackers
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Apple Health, Google Fit, Oura, or Garmin sync
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncWearables}
                    onChange={(e) => setSyncWearables(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Simulated Demo Patient Stream
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Pre-load realistic 6-month lab history & vitals
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active Demo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Reminders */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Set smart reminders
                </h3>
                <p className="text-xs text-slate-500">
                  Stay on track with notifications calibrated to your daily schedule.
                </p>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Medication & Refill Alerts
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Evening statin reminder & upcoming refills
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={remindersEnabled}
                    onChange={(e) => setRemindersEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                  ⏰ <em>Reminders are gentle and never intrusive. You can adjust frequencies anytime in Profile.</em>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Privacy Controls & Finish */}
          {step === 6 && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Review privacy controls
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You own your health data. Zero telemetry without consent. End-to-end client control and 1-click data deletion.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 mt-0.5"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    I agree to store my health record securely in this companion app. I understand AuraHealth is an educational tool and does not provide formal medical diagnoses.
                  </span>
                </label>
              </div>

              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                “Your health journey starts here.”
              </p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!privacyConsent}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/30 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch My Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
