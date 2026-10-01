import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  FileText,
  Pill,
  Calendar,
  Activity,
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    labResults,
    medications,
    appointments,
    symptoms,
    documents,
    setCurrentTab,
    setHealthSubTab,
    openAssistantWithPrompt
  } = useHealth();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: Array<{
      id: string;
      category: 'Lab Result' | 'Medication' | 'Appointment' | 'Symptom' | 'Document' | 'AI Topic';
      title: string;
      subtitle: string;
      action: () => void;
      badgeColor: string;
    }> = [];

    // Labs
    labResults.forEach((lab) => {
      if (lab.testName.toLowerCase().includes(q) || lab.category.toLowerCase().includes(q)) {
        results.push({
          id: lab.id,
          category: 'Lab Result',
          title: `${lab.testName}: ${lab.value} ${lab.unit}`,
          subtitle: `Status: ${lab.status} • Reference: ${lab.referenceRange} (${lab.date})`,
          action: () => {
            setCurrentTab('health');
            setHealthSubTab('labs');
            setIsSearchModalOpen(false);
          },
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
        });
      }
    });

    // Meds
    medications.forEach((med) => {
      if (med.name.toLowerCase().includes(q) || med.purpose.toLowerCase().includes(q)) {
        results.push({
          id: med.id,
          category: 'Medication',
          title: `${med.name} (${med.dosage})`,
          subtitle: `${med.frequency} • ${med.purpose}`,
          action: () => {
            setCurrentTab('health');
            setHealthSubTab('meds');
            setIsSearchModalOpen(false);
          },
          badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
        });
      }
    });

    // Appointments
    appointments.forEach((apt) => {
      if (apt.doctor.toLowerCase().includes(q) || apt.specialty.toLowerCase().includes(q) || apt.purpose.toLowerCase().includes(q)) {
        results.push({
          id: apt.id,
          category: 'Appointment',
          title: `${apt.doctor} - ${apt.specialty}`,
          subtitle: `${apt.date} at ${apt.time} • ${apt.purpose}`,
          action: () => {
            setCurrentTab('health');
            setHealthSubTab('appointments');
            setIsSearchModalOpen(false);
          },
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
        });
      }
    });

    // Symptoms
    symptoms.forEach((sym) => {
      if (sym.symptom.toLowerCase().includes(q) || sym.notes?.toLowerCase().includes(q)) {
        results.push({
          id: sym.id,
          category: 'Symptom',
          title: `${sym.symptom} (Severity ${sym.severity}/10)`,
          subtitle: `${sym.date} • ${sym.duration} • Triggers: ${sym.possibleTriggers}`,
          action: () => {
            setCurrentTab('health');
            setHealthSubTab('symptoms');
            setIsSearchModalOpen(false);
          },
          badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        });
      }
    });

    // Documents
    documents.forEach((doc) => {
      if (doc.title.toLowerCase().includes(q) || doc.summary.toLowerCase().includes(q)) {
        results.push({
          id: doc.id,
          category: 'Document',
          title: doc.title,
          subtitle: `${doc.date} • ${doc.provider} (${doc.fileSize})`,
          action: () => {
            setCurrentTab('profile');
            setIsSearchModalOpen(false);
          },
          badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        });
      }
    });

    // Always offer instant AI explanation option
    results.push({
      id: 'ai-prompt-option',
      category: 'AI Topic',
      title: `Ask AuraHealth AI: "${query}"`,
      subtitle: 'Get an evidence-based clinical explanation with personalized context',
      action: () => {
        openAssistantWithPrompt(`Explain this medical topic: "${query}" in simple language with considerations and questions for my doctor.`);
        setIsSearchModalOpen(false);
      },
      badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300'
    });

    return results;
  }, [query, labResults, medications, appointments, symptoms, documents]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lab results, symptoms, medications, appointments..."
            autoFocus
            className="w-full bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            Esc
          </button>
        </div>

        {/* Search Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 space-y-3">
              <p className="text-sm font-medium">Quick Health Searches</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['Cholesterol', 'Atorvastatin', 'Blood Pressure', 'Dr. Sarah Jenkins', 'Headache', 'HbA1c'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No direct records found for "{query}".
            </div>
          ) : (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={item.action}
                className="group p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Press ESC or click outside to dismiss</span>
          <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Semantic search across your personal records
          </span>
        </div>
      </div>
    </div>
  );
};
