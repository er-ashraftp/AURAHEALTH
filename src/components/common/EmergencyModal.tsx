import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  PhoneCall,
  Heart,
  ShieldAlert,
  Pill,
  Activity,
  User,
  Info,
  ExternalLink
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, patient, medications } = useHealth();
  const [selectedEmergencyNumber, setSelectedEmergencyNumber] = useState('911');

  if (!isEmergencyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-red-500/40 overflow-hidden">
        {/* Top Emergency Red Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm animate-pulse">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Emergency Health Profile</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/30 text-white uppercase tracking-wider">
                  ICE Medical Record
                </span>
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                For first responders, emergency medical personnel, and acute care triage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Urgent Warning Banner */}
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-red-800 dark:text-red-300">
                LIFE-THREATENING EMERGENCY NOTICE
              </p>
              <p className="leading-relaxed">
                If you or the patient are experiencing severe chest pain, shortness of breath, sudden weakness or numbness, slurred speech, or uncontrollable bleeding, <strong>call local emergency services immediately</strong>. Do not rely on AI assessment.
              </p>
            </div>
          </div>

          {/* Quick Call Emergency Services Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-red-100">
                  Direct Dispatch
                </p>
                <p className="text-lg font-extrabold">Call Emergency Services</p>
                <p className="text-xs text-red-100">Select standard regional emergency line</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedEmergencyNumber}
                  onChange={(e) => setSelectedEmergencyNumber(e.target.value)}
                  aria-label="Select Regional Emergency Service Number"
                  className="bg-white/20 text-white font-bold rounded-xl px-3 py-2 text-sm border border-white/30 focus:outline-none"
                >
                  <option value="911" className="text-slate-900">US/Canada (911)</option>
                  <option value="112" className="text-slate-900">Europe / UK / Intl (112)</option>
                  <option value="999" className="text-slate-900">UK Direct (999)</option>
                  <option value="000" className="text-slate-900">Australia (000)</option>
                </select>

                <a
                  href={`tel:${selectedEmergencyNumber}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold hover:bg-red-50 transition-colors shadow-md text-sm"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>Call {selectedEmergencyNumber}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Critical Medical Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Blood Group
              </span>
              <p className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-0.5">
                {patient.bloodType}
              </p>
              <span className="text-[10px] text-slate-500">Universal red cell compatibility verified</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Age / Gender
              </span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {patient.age} yrs • {patient.gender}
              </p>
              <span className="text-[10px] text-slate-500">{patient.heightCm} cm • {patient.weightKg} kg</span>
            </div>

            <div className="col-span-2 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Critical Allergies
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {patient.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200"
                  >
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Emergency Contact Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-600" /> Primary Emergency Contact (ICE)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {patient.emergencyContact.phone}
                </p>
              </div>
              <a
                href={`tel:${patient.emergencyContact.phone}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Spouse
              </a>
            </div>
          </div>

          {/* Active Prescribed Medications */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-purple-600" /> Current Active Medications
            </span>
            <div className="space-y-1.5">
              {medications.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{m.name}</span>
                    <span className="text-slate-400 ml-2">({m.dosage})</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">{m.frequency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Conditions & Past Surgeries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                Existing Conditions
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                {patient.chronicConditions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                Surgical History
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                {patient.pastSurgeries.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Emergency profile available in offline mode
          </span>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
