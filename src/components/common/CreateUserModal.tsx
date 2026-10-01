import React, { useState } from 'react';
import {
  UserPlus,
  X,
  Heart,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const CreateUserModal: React.FC = () => {
  const {
    isCreateUserModalOpen,
    setIsCreateUserModalOpen,
    addFamilyProfile,
    switchProfile,
    updatePatient,
    patient,
    triggerCelebration
  } = useHealth();

  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Family Member');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [bloodType, setBloodType] = useState('O+');
  const [heightCm, setHeightCm] = useState('168');
  const [weightKg, setWeightKg] = useState('65');
  const [targetWeightKg, setTargetWeightKg] = useState('60');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [allergiesText, setAllergiesText] = useState('None');
  const [conditionsText, setConditionsText] = useState('None');
  const [setAsPrimary, setSetAsPrimary] = useState(false);

  if (!isCreateUserModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newId = `patient-usr-${Date.now()}`;
    const cleanAllergies = allergiesText.split(',').map(s => s.trim()).filter(Boolean);
    const cleanConditions = conditionsText.split(',').map(s => s.trim()).filter(Boolean);

    // Add to family profiles list
    addFamilyProfile({
      id: newId,
      name: setAsPrimary ? `${fullName.trim()} (Primary)` : fullName.trim(),
      relationship: setAsPrimary ? 'Self' : relationship,
      age: parseInt(age) || 30,
      gender,
      bloodType,
      activeMedsCount: 0,
      recentHealthScore: 92,
      allergiesCount: cleanAllergies.length
    });

    // Populate active profile state with the full detailed record
    updatePatient({
      id: newId,
      name: fullName.trim(),
      email: `${fullName.trim().toLowerCase().replace(/\s+/g, '.')}.user@aurahealth.ai`,
      age: parseInt(age) || 30,
      gender,
      bloodType: bloodType.includes('+') || bloodType.includes('-') ? `${bloodType} Positive` : bloodType,
      heightCm: parseFloat(heightCm) || 168,
      weightKg: parseFloat(weightKg) || 65,
      targetWeightKg: parseFloat(targetWeightKg) || 60,
      emergencyContact: {
        name: emergencyName || 'Primary Family Contact',
        relationship: 'Emergency Contact',
        phone: emergencyPhone || '+1 (555) 000-0000'
      },
      allergies: cleanAllergies.length ? cleanAllergies : ['None reported'],
      chronicConditions: cleanConditions.length ? cleanConditions : ['None reported'],
      pastSurgeries: ['None recorded'],
      familyHistory: ['Standard baseline screening recommended'],
      immunizations: [
        { name: 'Tdap Booster', date: 'Recent', status: 'Up-to-date' },
        { name: 'Annual Flu Vaccine', date: 'Recent', status: 'Up-to-date' }
      ]
    });

    switchProfile(newId);
    triggerCelebration();
    setIsCreateUserModalOpen(false);

    // Reset fields
    setFullName('');
    setEmergencyName('');
    setEmergencyPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Create New User Profile</h2>
              <p className="text-xs text-cyan-100">
                Register a new individual or family member with isolated clinical records.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateUserModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Basic Information
            </h3>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Lamees Abdul Majeed"
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Role / Relation</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Family Member">Family Member</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Metrics */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Vitals & Body Composition
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Emergency Contact (ICE)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Tariq Majeed"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+1 (555) 234-8901"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Allergies & Conditions */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Clinical Context
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Known Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Pollen, Peanuts"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Chronic Conditions (comma separated)
                </label>
                <input
                  type="text"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  placeholder="e.g. Dyslipidemia, Asthma, None"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Set as Primary toggle */}
          <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Set as Primary Dashboard User</p>
              <p className="text-[11px] text-slate-500">Makes this the default active profile on launch.</p>
            </div>
            <input
              type="checkbox"
              checked={setAsPrimary}
              onChange={(e) => setSetAsPrimary(e.target.checked)}
              className="w-4 h-4 text-cyan-600 rounded"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateUserModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Create & Switch to Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
