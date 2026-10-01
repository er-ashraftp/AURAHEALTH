import React, { useState, useEffect } from 'react';
import {
  Edit3,
  X,
  Heart,
  Save,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const EditProfileModal: React.FC = () => {
  const {
    isEditProfileModalOpen,
    setIsEditProfileModalOpen,
    patient,
    updatePatient,
    triggerCelebration
  } = useHealth();

  // Local form state pre-filled with patient details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Female');
  const [bloodType, setBloodType] = useState('O Positive');
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(64.2);
  const [targetWeightKg, setTargetWeightKg] = useState(60.0);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [surgeriesText, setSurgeriesText] = useState('');
  const [familyHistoryText, setFamilyHistoryText] = useState('');

  // Sync state whenever modal opens or patient changes
  useEffect(() => {
    if (patient) {
      setName(patient.name || '');
      setEmail(patient.email || '');
      setAge(patient.age || 30);
      setGender(patient.gender || 'Female');
      setBloodType(patient.bloodType || 'O Positive');
      setHeightCm(patient.heightCm || 168);
      setWeightKg(patient.weightKg || 65);
      setTargetWeightKg(patient.targetWeightKg || 60);
      setEmergencyName(patient.emergencyContact?.name || '');
      setEmergencyRelationship(patient.emergencyContact?.relationship || '');
      setEmergencyPhone(patient.emergencyContact?.phone || '');
      setAllergiesText(patient.allergies?.join(', ') || '');
      setConditionsText(patient.chronicConditions?.join(', ') || '');
      setSurgeriesText(patient.pastSurgeries?.join('; ') || '');
      setFamilyHistoryText(patient.familyHistory?.join('; ') || '');
    }
  }, [patient, isEditProfileModalOpen]);

  if (!isEditProfileModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanAllergies = allergiesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const cleanConditions = conditionsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const cleanSurgeries = surgeriesText
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);

    const cleanFamilyHistory = familyHistoryText
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);

    updatePatient({
      name: name.trim() || patient.name,
      email: email.trim() || patient.email,
      age: Number(age) || patient.age,
      gender,
      bloodType,
      heightCm: Number(heightCm) || patient.heightCm,
      weightKg: Number(weightKg) || patient.weightKg,
      targetWeightKg: Number(targetWeightKg) || patient.targetWeightKg,
      emergencyContact: {
        name: emergencyName.trim() || patient.emergencyContact.name,
        relationship: emergencyRelationship.trim() || patient.emergencyContact.relationship,
        phone: emergencyPhone.trim() || patient.emergencyContact.phone
      },
      allergies: cleanAllergies.length ? cleanAllergies : patient.allergies,
      chronicConditions: cleanConditions.length ? cleanConditions : patient.chronicConditions,
      pastSurgeries: cleanSurgeries.length ? cleanSurgeries : patient.pastSurgeries,
      familyHistory: cleanFamilyHistory.length ? cleanFamilyHistory : patient.familyHistory
    });

    triggerCelebration();
    setIsEditProfileModalOpen(false);
  };

  // Calculate live BMI
  const heightInMeters = heightCm / 100;
  const calculatedBMI = heightInMeters > 0 ? (weightKg / (heightInMeters * heightInMeters)).toFixed(1) : '22.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Edit Profile & Add Health Details</h2>
              <p className="text-xs text-cyan-100">
                Update clinical records, biometrics, emergency contact, and allergies for {patient.name}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section 1: Demographics */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-cyan-500" /> Identity & Demographics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
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
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="O Positive">O Positive (O+)</option>
                  <option value="A Positive">A Positive (A+)</option>
                  <option value="B Positive">B Positive (B+)</option>
                  <option value="AB Positive">AB Positive (AB+)</option>
                  <option value="O Negative">O Negative (O-)</option>
                  <option value="A Negative">A Negative (A-)</option>
                  <option value="B Negative">B Negative (B-)</option>
                  <option value="AB Negative">AB Negative (AB-)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Vitals & Body Metrics */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" /> Physical Measurements
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold font-mono">
                Calculated BMI: {calculatedBMI}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Emergency Contact Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Emergency Contact (ICE)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <label className="font-semibold text-slate-700 dark:text-slate-300">Relationship</label>
                <input
                  type="text"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                  placeholder="e.g. Spouse, Brother, Parent"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
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

          {/* Section 4: Allergies & Conditions */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Allergies & Chronic Conditions
            </h3>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Known Allergies (comma separated)
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Penicillin (Moderate rash), Shellfish, Peanuts"
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">Separate each allergy with a comma</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Chronic Medical Conditions (comma separated)
              </label>
              <input
                type="text"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                placeholder="e.g. Borderline Dyslipidemia, Mild Seasonal Rhinitis"
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Past Surgeries / Procedures (semicolon separated)
                </label>
                <textarea
                  rows={2}
                  value={surgeriesText}
                  onChange={(e) => setSurgeriesText(e.target.value)}
                  placeholder="e.g. Appendectomy (2018, laparoscopic)"
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Family Medical History (semicolon separated)
                </label>
                <textarea
                  rows={2}
                  value={familyHistoryText}
                  onChange={(e) => setFamilyHistoryText(e.target.value)}
                  placeholder="e.g. Paternal Grandfather: Myocardial Infarction; Father: Hypertension"
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              Changes update your live dashboard and emergency profile.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Details</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
