import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  FileText,
  Lock,
  Download,
  Trash2,
  Users,
  AlertTriangle,
  Upload,
  CheckCircle,
  Eye,
  FileCheck,
  Calendar,
  Heart,
  Plus,
  Edit3
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { SafetyBanner } from '../common/SafetyBanner';

export const ProfileView: React.FC = () => {
  const {
    patient,
    updatePatient,
    familyProfiles,
    addFamilyProfile,
    activeProfileId,
    switchProfile,
    documents,
    addDocument,
    setIsEmergencyModalOpen,
    setIsCreateUserModalOpen,
    setIsEditProfileModalOpen,
    triggerCelebration
  } = useHealth();

  const [activeSection, setActiveSection] = useState<'record' | 'vault' | 'family' | 'privacy'>('record');
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'Lab Report' | 'Prescription' | 'Imaging/ECG' | 'Doctor Summary' | 'Insurance'>('Lab Report');
  const [newDocProvider, setNewDocProvider] = useState('');

  // Handle data export JSON
  const handleExportData = () => {
    const exportPayload = {
      patientProfile: patient,
      vaultDocumentsCount: documents.length,
      exportedAt: new Date().toISOString(),
      platform: 'AuraHealth AI Companion',
      version: '2.5.0'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AuraHealth_Personal_Export_${patient.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset your local demo session? This will restore standard synthetic records.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const filteredDocs = documents.filter(doc =>
    docCategoryFilter === 'All' ? true : doc.category === docCategoryFilter
  );

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Sub Tabs */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'record', label: 'Personal Health Record', icon: User },
          { id: 'vault', label: 'Document Vault', icon: FileText },
          { id: 'family', label: 'Family Profiles', icon: Users },
          { id: 'privacy', label: 'Privacy & Data Controls', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: PERSONAL HEALTH RECORD */}
      {activeSection === 'record' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-cyan-500 shrink-0">
                <img src={patient.avatarUrl} alt={patient.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{patient.name}</h2>
                <p className="text-xs text-slate-500">
                  {patient.email} • {patient.age} yrs • {patient.gender} • Blood Type {patient.bloodType}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Patient ID: AH-90241
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <button
                onClick={() => setIsEditProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile & Health Details
              </button>

              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs border border-red-200 dark:border-red-900 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> ICE Card
              </button>
            </div>
          </div>

          {/* Clinical Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Critical Allergies & Conditions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Allergies & Chronic Conditions
              </h3>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Allergies</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {patient.allergies.map((a, i) => (
                    <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 font-bold uppercase">Active Conditions</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {patient.chronicConditions.map((c, i) => (
                    <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Surgical History & Family Pedigree */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> Family History & Surgeries
              </h3>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Surgical Procedures</p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                  {patient.pastSurgeries.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 font-bold uppercase">Family Cardiovascular History</p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                  {patient.familyHistory.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Immunization History */}
            <div className="col-span-1 md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Immunization & Vaccine Record
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {patient.immunizations.map((imm, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white">{imm.name}</p>
                    <p className="text-slate-500">{imm.date}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-600">✓ {imm.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DOCUMENT VAULT */}
      {activeSection === 'vault' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Encrypted Health Document Vault
              </h2>
              <p className="text-xs text-slate-500">
                Secure repository for laboratory reports, ECG traces, prescription scans, and discharge summaries
              </p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Lab Report', 'Doctor Summary', 'Imaging/ECG'].map((cat) => (
              <button
                key={cat}
                onClick={() => setDocCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  docCategoryFilter === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{doc.fileSize}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{doc.title}</h4>
                  <p className="text-xs text-slate-500">{doc.date} • {doc.provider}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Client Encrypted
                  </span>
                  <button
                    onClick={() => alert(`Opening ${doc.title}... (Demo PDF document reader loaded)`)}
                    className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                  >
                    View Document →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Modal */}
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Document to Vault
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Document Title</label>
                    <input
                      type="text"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      placeholder="e.g. Echocardiogram Report 2026"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                    <select
                      value={newDocCategory}
                      onChange={(e) => setNewDocCategory(e.target.value as any)}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="Lab Report">Lab Report</option>
                      <option value="Prescription">Prescription</option>
                      <option value="Imaging/ECG">Imaging / ECG</option>
                      <option value="Doctor Summary">Doctor Consultation Summary</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Clinic / Provider</label>
                    <input
                      type="text"
                      value={newDocProvider}
                      onChange={(e) => setNewDocProvider(e.target.value)}
                      placeholder="e.g. Quest Diagnostics, Metro Hospital"
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newDocTitle) return;
                      addDocument({
                        title: newDocTitle,
                        category: newDocCategory,
                        date: new Date().toISOString().split('T')[0],
                        provider: newDocProvider || 'Diagnostic Provider',
                        fileSize: '1.2 MB PDF',
                        summary: 'Uploaded health record indexed into personal vault.'
                      });
                      setIsUploadModalOpen(false);
                      setNewDocTitle('');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold"
                  >
                    Upload Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: FAMILY PROFILES */}
      {activeSection === 'family' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Family Member & User Profiles
              </h2>
              <p className="text-xs text-slate-500">
                Manage health records for dependants and family members with strong cryptographic privacy boundaries.
              </p>
            </div>

            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create New User / Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {familyProfiles.map((fp) => (
              <div
                key={fp.id}
                className={`p-5 rounded-3xl border transition-all ${
                  activeProfileId === fp.id
                    ? 'bg-cyan-50/50 dark:bg-cyan-950/30 border-cyan-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {fp.relationship}
                  </span>
                  {activeProfileId === fp.id && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-600 text-white font-bold">
                      Active Profile
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{fp.name}</h3>
                <p className="text-xs text-slate-500">{fp.age} yrs • Blood Type {fp.bloodType}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <p>Health Score: <strong>{fp.recentHealthScore}/100</strong></p>
                  <p>Active Prescriptions: <strong>{fp.activeMedsCount}</strong></p>
                </div>

                {activeProfileId !== fp.id && (
                  <button
                    onClick={() => switchProfile(fp.id)}
                    className="w-full mt-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition-colors"
                  >
                    Switch to {fp.name.split(' ')[0]} →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: PRIVACY & DATA CONTROLS */}
      {activeSection === 'privacy' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Privacy, Consent & Data Governance
            </h2>
            <p className="text-xs text-slate-500">
              Architected with Privacy-by-Design. No advertising tracking, no non-consensual telemetry, and total user data sovereignty.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Data Portability & Rights
            </h3>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Export Complete Health Archive (JSON)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Download all your lab values, vitals history, symptoms, and medications in a standardized portable format.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Archive</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 gap-3">
                <div>
                  <p className="text-xs font-bold text-red-900 dark:text-red-300">
                    Purge Local Session & Restore Prototype Defaults
                  </p>
                  <p className="text-[11px] text-red-700/80 dark:text-red-400/80">
                    Erases custom entries, newly uploaded lab tests, and resets to standard demo state.
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <SafetyBanner />
    </div>
  );
};
