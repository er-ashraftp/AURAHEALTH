import React from 'react';
import { ShieldAlert, AlertTriangle, PhoneCall } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

interface SafetyBannerProps {
  compact?: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ compact = false }) => {
  const { setIsEmergencyModalOpen } = useHealth();

  if (compact) {
    return (
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Clinical Safety Notice:</strong> AI insights are educational and do not constitute formal medical diagnoses or prescriptions.
          </span>
        </div>
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="text-red-600 dark:text-red-400 font-bold hover:underline shrink-0 ml-2"
        >
          Emergency (911)
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-900/50 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-950 dark:text-amber-200">
              Healthcare Companion & Medical Safety Protocol
            </p>
            <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
              AuraHealth AI supports your healthcare journey with evidence-based intelligence, but <strong>does not replace medical professionals</strong>. Always consult your doctor for diagnosis and treatment plans.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-end sm:self-center"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>In Emergency: Call 911 / 112</span>
        </button>
      </div>
    </div>
  );
};
