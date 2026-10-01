export type NavigationTab = 'home' | 'health' | 'ai-doctor' | 'insights' | 'profile';

export type HealthSubTab = 
  | 'overview' 
  | 'labs' 
  | 'analyzer' 
  | 'heart' 
  | 'symptoms' 
  | 'meds' 
  | 'appointments' 
  | 'nutrition' 
  | 'sleep' 
  | 'fitness';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodType: string;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  emergencyContact: EmergencyContact;
  allergies: string[];
  chronicConditions: string[];
  pastSurgeries: string[];
  familyHistory: string[];
  immunizations: Array<{ name: string; date: string; status: 'Up-to-date' | 'Due' }>;
}

export interface LabResult {
  id: string;
  date: string;
  testName: string;
  value: number | string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Optimal' | 'Elevated' | 'Low' | 'Critical';
  category: 'lipid' | 'metabolic' | 'hematology' | 'renal' | 'liver' | 'vitamin' | 'cardiac';
  clinicalNote?: string;
  trendNotice?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[]; // e.g. ["08:00 AM", "08:00 PM"]
  prescriber: string;
  purpose: string;
  startDate: string;
  endDate?: string;
  remainingPills: number;
  refillReminder: boolean;
  notes?: string;
  takenToday: boolean[];
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  purpose: string;
  notes?: string;
  reminderEnabled: boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
  prepSummary?: DoctorPrepSummary;
}

export interface DoctorPrepSummary {
  appointmentTitle: string;
  executiveSummary: string;
  keyMetricsToHighlight: Array<{ metric: string; value: string; status: string; note: string }>;
  recentChanges: string[];
  symptomsSummary: string;
  recommendedQuestionsForDoctor: string[];
  preventiveChecklist: string[];
}

export interface SymptomEntry {
  id: string;
  date: string;
  time: string;
  symptom: string;
  severity: number; // 1 - 10
  duration: string;
  location: string;
  possibleTriggers: string;
  notes?: string;
}

export interface MealItem {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  time: string;
  highlights?: string[];
}

export interface SleepRecord {
  date: string;
  durationMinutes: number;
  score: number;
  bedtime: string;
  wakeTime: string;
  deepSleepPercent: number;
  remSleepPercent: number;
  lightSleepPercent: number;
  restingHeartRate: number;
}

export interface DailyActivityMetrics {
  date: string;
  steps: number;
  targetSteps: number;
  caloriesBurned: number;
  targetCalories: number;
  activeMinutes: number;
  targetActiveMinutes: number;
  distanceKm: number;
  waterIntakeMl: number;
  targetWaterMl: number;
  restingHeartRate: number;
  systolicBP: number;
  diastolicBP: number;
  weightKg: number;
}

export interface HealthGoal {
  id: string;
  title: string;
  category: 'fitness' | 'nutrition' | 'sleep' | 'heart' | 'hydration';
  targetValue: number;
  currentValue: number;
  unit: string;
  streakDays: number;
  completed: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Lab Report' | 'Prescription' | 'Imaging/ECG' | 'Doctor Summary' | 'Insurance';
  date: string;
  provider: string;
  fileSize: string;
  summary: string;
  extractedTests?: LabResult[];
}

export interface FamilyProfile {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  bloodType: string;
  activeMedsCount: number;
  recentHealthScore: number;
  allergiesCount: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  progressPercent: number;
}
