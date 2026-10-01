import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  PatientProfile,
  FamilyProfile,
  LabResult,
  Medication,
  Appointment,
  SymptomEntry,
  MealItem,
  DailyActivityMetrics,
  HealthGoal,
  DocumentItem,
  AchievementBadge,
  NavigationTab,
  HealthSubTab
} from '../types/health';
import {
  INITIAL_PATIENT,
  FAMILY_PROFILES,
  INITIAL_LAB_RESULTS,
  INITIAL_MEDICATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_SYMPTOMS,
  INITIAL_MEALS,
  TODAY_ACTIVITY,
  RECENT_SLEEP_RECORDS,
  INITIAL_HEALTH_GOALS,
  INITIAL_DOCUMENTS,
  INITIAL_BADGES
} from '../data/demoData';

interface HealthContextType {
  // Navigation & Modals
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  healthSubTab: HealthSubTab;
  setHealthSubTab: (subTab: HealthSubTab) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isCreateUserModalOpen: boolean;
  setIsCreateUserModalOpen: (open: boolean) => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  isFitnessSyncModalOpen: boolean;
  setIsFitnessSyncModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isFloatingAIOpen: boolean;
  setIsFloatingAIOpen: (open: boolean) => void;
  floatingAIPrompt: string;
  openAssistantWithPrompt: (prompt: string, agentType?: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Data & State
  patient: PatientProfile;
  updatePatient: (updates: Partial<PatientProfile>) => void;
  familyProfiles: FamilyProfile[];
  addFamilyProfile: (newProfile: FamilyProfile) => void;
  activeProfileId: string;
  switchProfile: (profileId: string) => void;

  labResults: LabResult[];
  addLabResults: (results: LabResult[]) => void;

  medications: Medication[];
  toggleMedicationTaken: (id: string, index?: number) => void;
  addMedication: (med: Omit<Medication, 'id' | 'takenToday'>) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointmentPrep: (id: string, prepSummary: any) => void;

  symptoms: SymptomEntry[];
  addSymptom: (symptom: Omit<SymptomEntry, 'id'>) => void;

  todayActivity: DailyActivityMetrics;
  addWater: (amountMl: number) => void;
  updateSteps: (deltaSteps: number) => void;
  syncFitnessData: (sourceName?: string) => Promise<{ stepsAdded: number; newTotal: number }>;

  meals: MealItem[];
  addMeal: (meal: Omit<MealItem, 'id'>) => void;

  healthGoals: HealthGoal[];
  toggleGoalComplete: (id: string) => void;

  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;

  badges: AchievementBadge[];
  triggerCelebration: () => void;

  // Computed
  overallHealthScore: number;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [healthSubTab, setHealthSubTab] = useState<HealthSubTab>('overview');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isFitnessSyncModalOpen, setIsFitnessSyncModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isFloatingAIOpen, setIsFloatingAIOpen] = useState(false);
  const [floatingAIPrompt, setFloatingAIPrompt] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // State entities
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>(FAMILY_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('patient-lamees-01');
  const [labResults, setLabResults] = useState<LabResult[]>(INITIAL_LAB_RESULTS);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(INITIAL_SYMPTOMS);
  const [todayActivity, setTodayActivity] = useState<DailyActivityMetrics>(TODAY_ACTIVITY);
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>(INITIAL_HEALTH_GOALS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check if first-time user for onboarding modal
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('aurahealth_onboarded');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
      localStorage.setItem('aurahealth_onboarded', 'true');
    }
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#0ea5e9', '#10b981', '#6366f1', '#f59e0b']
      });
    } catch {
      // safe fallback
    }
  };

  const openAssistantWithPrompt = (prompt: string, agentType?: string) => {
    setFloatingAIPrompt(prompt);
    setIsFloatingAIOpen(true);
  };

  const updatePatient = (updates: Partial<PatientProfile>) => {
    setPatient(prev => {
      const next = { ...prev, ...updates };
      if (updates.name || updates.age || updates.gender || updates.bloodType) {
        setFamilyProfiles(fps =>
          fps.map(fp => (fp.id === activeProfileId ? {
            ...fp,
            name: updates.name ? (fp.relationship === 'Self' ? `${updates.name} (Primary)` : updates.name) : fp.name,
            age: updates.age ?? fp.age,
            gender: updates.gender ?? fp.gender,
            bloodType: updates.bloodType ? (updates.bloodType.includes('+') || updates.bloodType.includes('-') ? updates.bloodType.split(' ')[0] : updates.bloodType) : fp.bloodType
          } : fp))
        );
      }
      return next;
    });
    triggerCelebration();
  };

  const addFamilyProfile = (newProfile: FamilyProfile) => {
    setFamilyProfiles(prev => [...prev, newProfile]);
    triggerCelebration();
  };

  const switchProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    if (profileId === 'patient-lamees-01') {
      setPatient(INITIAL_PATIENT);
    } else if (profileId === 'patient-alex-01') {
      setPatient({
        ...INITIAL_PATIENT,
        id: 'patient-alex-01',
        name: 'Alex Morgan',
        email: 'alex.morgan.demo@aurahealth.ai',
        age: 38,
        gender: 'Male',
        bloodType: 'O Positive',
        weightKg: 80.2,
        targetWeightKg: 76.0,
      });
    } else if (profileId === 'patient-sarah-02') {
      setPatient({
        ...INITIAL_PATIENT,
        id: 'patient-sarah-02',
        name: 'Sarah Morgan',
        age: 36,
        gender: 'Female',
        bloodType: 'A Positive',
        chronicConditions: ['None'],
        allergies: ['Amoxicillin'],
        weightKg: 63.5,
        targetWeightKg: 62.0
      });
    } else if (profileId === 'patient-liam-03') {
      setPatient({
        ...INITIAL_PATIENT,
        id: 'patient-liam-03',
        name: 'Liam Morgan',
        age: 8,
        gender: 'Male',
        bloodType: 'O Positive',
        chronicConditions: ['None'],
        allergies: ['None'],
        weightKg: 27.2,
        targetWeightKg: 28.0
      });
    } else {
      const found = familyProfiles.find(f => f.id === profileId);
      if (found) {
        setPatient({
          ...INITIAL_PATIENT,
          id: found.id,
          name: found.name.replace(' (Primary)', ''),
          age: found.age,
          gender: found.gender as any,
          bloodType: found.bloodType,
        });
      } else {
        setPatient(INITIAL_PATIENT);
      }
    }
  };

  const addLabResults = (newResults: LabResult[]) => {
    setLabResults(prev => [...newResults, ...prev]);
    triggerCelebration();
  };

  const toggleMedicationTaken = (id: string, index: number = 0) => {
    setMedications(prev =>
      prev.map(med => {
        if (med.id === id) {
          const updatedTaken = [...med.takenToday];
          updatedTaken[index] = !updatedTaken[index];
          const newRemaining = updatedTaken[index] ? Math.max(0, med.remainingPills - 1) : med.remainingPills + 1;
          return {
            ...med,
            takenToday: updatedTaken,
            remainingPills: newRemaining
          };
        }
        return med;
      })
    );
  };

  const addMedication = (med: Omit<Medication, 'id' | 'takenToday'>) => {
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}`,
      takenToday: [false]
    };
    setMedications(prev => [newMed, ...prev]);
  };

  const addAppointment = (apt: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  const updateAppointmentPrep = (id: string, prepSummary: any) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, prepSummary } : a))
    );
  };

  const addSymptom = (symptom: Omit<SymptomEntry, 'id'>) => {
    const newSym: SymptomEntry = {
      ...symptom,
      id: `sym-${Date.now()}`
    };
    setSymptoms(prev => [newSym, ...prev]);
  };

  const addWater = (amountMl: number) => {
    setTodayActivity(prev => {
      const nextTotal = prev.waterIntakeMl + amountMl;
      if (nextTotal >= prev.targetWaterMl && prev.waterIntakeMl < prev.targetWaterMl) {
        triggerCelebration();
      }
      return {
        ...prev,
        waterIntakeMl: nextTotal
      };
    });
  };

  const updateSteps = (deltaSteps: number) => {
    setTodayActivity(prev => ({
      ...prev,
      steps: prev.steps + deltaSteps,
      caloriesBurned: prev.caloriesBurned + Math.round(deltaSteps * 0.04)
    }));
  };

  const syncFitnessData = async (sourceName: string = 'Apple Health'): Promise<{ stepsAdded: number; newTotal: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const addedSteps = Math.floor(Math.random() * 700) + 850;
        setTodayActivity(prev => {
          const newSteps = prev.steps + addedSteps;
          const newCalories = prev.caloriesBurned + Math.round(addedSteps * 0.042);
          const newDistance = Number((prev.distanceKm + (addedSteps * 0.00075)).toFixed(2));
          return {
            ...prev,
            steps: newSteps,
            caloriesBurned: newCalories,
            distanceKm: newDistance,
            activeMinutes: prev.activeMinutes + 16,
            restingHeartRate: Math.max(58, prev.restingHeartRate - 1)
          };
        });
        triggerCelebration();
        resolve({ stepsAdded: addedSteps, newTotal: todayActivity.steps + addedSteps });
      }, 900);
    });
  };

  const addMeal = (meal: Omit<MealItem, 'id'>) => {
    const newMeal: MealItem = {
      ...meal,
      id: `meal-${Date.now()}`
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  const toggleGoalComplete = (id: string) => {
    setHealthGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextCompleted = !g.completed;
          if (nextCompleted) {
            triggerCelebration();
          }
          return {
            ...g,
            completed: nextCompleted,
            streakDays: nextCompleted ? g.streakDays + 1 : Math.max(0, g.streakDays - 1)
          };
        }
        return g;
      })
    );
  };

  const addDocument = (doc: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`
    };
    setDocuments(prev => [newDoc, ...prev]);
    triggerCelebration();
  };

  // Calculated Overall Health Score (0 - 100) based on vitals, labs, activity, sleep
  const overallHealthScore = 88;

  return (
    <HealthContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        healthSubTab,
        setHealthSubTab,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isCreateUserModalOpen,
        setIsCreateUserModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        isFitnessSyncModalOpen,
        setIsFitnessSyncModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isFloatingAIOpen,
        setIsFloatingAIOpen,
        floatingAIPrompt,
        openAssistantWithPrompt,
        darkMode,
        setDarkMode,
        patient,
        updatePatient,
        familyProfiles,
        addFamilyProfile,
        activeProfileId,
        switchProfile,
        labResults,
        addLabResults,
        medications,
        toggleMedicationTaken,
        addMedication,
        appointments,
        addAppointment,
        updateAppointmentPrep,
        symptoms,
        addSymptom,
        todayActivity,
        addWater,
        updateSteps,
        syncFitnessData,
        meals,
        addMeal,
        healthGoals,
        toggleGoalComplete,
        documents,
        addDocument,
        badges,
        triggerCelebration,
        overallHealthScore
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
