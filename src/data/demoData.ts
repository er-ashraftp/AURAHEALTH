import {
  PatientProfile,
  LabResult,
  Medication,
  Appointment,
  SymptomEntry,
  MealItem,
  SleepRecord,
  DailyActivityMetrics,
  HealthGoal,
  DocumentItem,
  FamilyProfile,
  AchievementBadge
} from '../types/health';

export const DEMO_NOTICE = "Demo Data — Synthetic medical profile for demonstration purposes. Not a real patient.";

export const INITIAL_PATIENT: PatientProfile = {
  id: 'patient-lamees-01',
  name: 'Lamees Abdul Majeed',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  email: 'lamees.abdulmajeed.demo@aurahealth.ai',
  age: 32,
  gender: 'Female',
  bloodType: 'O Positive',
  heightCm: 168,
  weightKg: 64.2,
  targetWeightKg: 60.0,
  emergencyContact: {
    name: 'Tariq Majeed',
    relationship: 'Family Member',
    phone: '+1 (555) 234-8901',
    alternatePhone: '+1 (555) 902-3341',
  },
  allergies: ['Penicillin (Moderate rash)', 'Shellfish (Mild pruritus)'],
  chronicConditions: ['Borderline Dyslipidemia', 'Mild Seasonal Allergic Rhinitis'],
  pastSurgeries: ['Appendectomy (2018, laparoscopic, uncomplicated)'],
  familyHistory: [
    'Paternal Grandfather: Myocardial Infarction at age 62',
    'Maternal Grandmother: Type 2 Diabetes',
    'Father: Mild Essential Hypertension diagnosed age 54'
  ],
  immunizations: [
    { name: 'Tdap Booster', date: 'Oct 2024', status: 'Up-to-date' },
    { name: 'Influenza Vaccine (Annual)', date: 'Nov 2025', status: 'Up-to-date' },
    { name: 'COVID-19 Updated Booster', date: 'Sep 2025', status: 'Up-to-date' },
    { name: 'Hepatitis B Series', date: 'Completed 2015', status: 'Up-to-date' }
  ]
};

export const FAMILY_PROFILES: FamilyProfile[] = [
  {
    id: 'patient-lamees-01',
    name: 'Lamees Abdul Majeed (Primary)',
    relationship: 'Self',
    age: 32,
    gender: 'Female',
    bloodType: 'O+',
    activeMedsCount: 2,
    recentHealthScore: 92,
    allergiesCount: 2
  },
  {
    id: 'patient-alex-01',
    name: 'Alex Morgan',
    relationship: 'Family Member',
    age: 38,
    gender: 'Male',
    bloodType: 'O+',
    activeMedsCount: 2,
    recentHealthScore: 88,
    allergiesCount: 2
  },
  {
    id: 'patient-sarah-02',
    name: 'Sarah Morgan',
    relationship: 'Family Member',
    age: 36,
    gender: 'Female',
    bloodType: 'A+',
    activeMedsCount: 1,
    recentHealthScore: 92,
    allergiesCount: 1
  },
  {
    id: 'patient-liam-03',
    name: 'Liam Morgan',
    relationship: 'Son',
    age: 8,
    gender: 'Male',
    bloodType: 'O+',
    activeMedsCount: 0,
    recentHealthScore: 96,
    allergiesCount: 0
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-01',
    name: 'Atorvastatin',
    dosage: '10 mg tablet',
    frequency: 'Once daily at bedtime',
    timing: ['09:30 PM'],
    prescriber: 'Dr. Sarah Jenkins, MD (Cardiology)',
    purpose: 'Cardiovascular lipid management & LDL lowering',
    startDate: '2026-06-15',
    remainingPills: 24,
    refillReminder: true,
    notes: 'Take with or without water. Avoid large quantities of grapefruit juice.',
    takenToday: [true]
  },
  {
    id: 'med-02',
    name: 'Vitamin D3 (Cholecalciferol)',
    dosage: '2,000 IU softgel',
    frequency: 'Once daily with breakfast',
    timing: ['08:00 AM'],
    prescriber: 'Dr. Sarah Jenkins, MD',
    purpose: 'Bone metabolism, immune support & optimal serum 25-OH-D',
    startDate: '2026-01-10',
    remainingPills: 45,
    refillReminder: false,
    notes: 'Fat-soluble vitamin; best absorbed with healthy fats (e.g. avocado, eggs).',
    takenToday: [true]
  },
  {
    id: 'med-03',
    name: 'Coenzyme Q10 (Ubiquinol)',
    dosage: '100 mg capsule',
    frequency: 'Once daily with meal',
    timing: ['08:00 AM'],
    prescriber: 'Preventive Nutrition Consultation',
    purpose: 'Cellular mitochondrial support and statin co-factor replenishment',
    startDate: '2026-06-20',
    remainingPills: 18,
    refillReminder: true,
    notes: 'Well tolerated dietary supplement.',
    takenToday: [false]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    doctor: 'Dr. Sarah Jenkins, MD, FACC',
    specialty: 'Cardiovascular Medicine & Preventive Health',
    date: '2026-10-12',
    time: '10:30 AM',
    location: 'Metropolitan Heart & Wellness Pavilion, Suite 420',
    purpose: 'Cardiovascular follow-up & 6-month lipid panel re-evaluation',
    notes: 'Bring fasting glucose and home blood pressure log. Discuss exercise tolerance.',
    reminderEnabled: true,
    status: 'upcoming'
  },
  {
    id: 'apt-02',
    doctor: 'Dr. Marcus Vance, DDS',
    specialty: 'Dental Medicine & Periodontics',
    date: '2026-11-04',
    time: '02:00 PM',
    location: 'Bayside Family Dental Care, Floor 2',
    purpose: 'Bi-annual preventive cleaning and oral health screening',
    notes: 'Routine dental prophylaxis and bitewing radiographs.',
    reminderEnabled: true,
    status: 'upcoming'
  },
  {
    id: 'apt-03',
    doctor: 'Dr. Elena Rostova, MD',
    specialty: 'Dermatology',
    date: '2026-07-18',
    time: '11:15 AM',
    location: 'Advanced Dermatology Center',
    purpose: 'Annual full-body skin and mole cancer screening',
    notes: 'Benign nevi noted; regular SPF 50 sunscreen advised.',
    reminderEnabled: false,
    status: 'completed'
  }
];

export const INITIAL_LAB_RESULTS: LabResult[] = [
  // Recent September 2026 tests
  {
    id: 'lab-01',
    date: '2026-09-15',
    testName: 'Total Cholesterol',
    value: 218,
    numericValue: 218,
    unit: 'mg/dL',
    referenceRange: '< 200',
    status: 'Elevated',
    category: 'lipid',
    clinicalNote: 'Total circulating sterol molecules in bloodstream.',
    trendNotice: 'Down from 224 mg/dL 6 months ago (Improving)'
  },
  {
    id: 'lab-02',
    date: '2026-09-15',
    testName: 'LDL Cholesterol',
    value: 138,
    numericValue: 138,
    unit: 'mg/dL',
    referenceRange: '< 100',
    status: 'Elevated',
    category: 'lipid',
    clinicalNote: 'Low-density lipoprotein ("bad" cholesterol).',
    trendNotice: 'Decreased from 146 mg/dL in March 2026 (Improving)'
  },
  {
    id: 'lab-03',
    date: '2026-09-15',
    testName: 'HDL Cholesterol',
    value: 54,
    numericValue: 54,
    unit: 'mg/dL',
    referenceRange: '> 40',
    status: 'Optimal',
    category: 'lipid',
    clinicalNote: 'High-density lipoprotein ("protective" cholesterol).',
    trendNotice: 'Up from 48 mg/dL in March 2026 (Improving)'
  },
  {
    id: 'lab-04',
    date: '2026-09-15',
    testName: 'Triglycerides',
    value: 142,
    numericValue: 142,
    unit: 'mg/dL',
    referenceRange: '< 150',
    status: 'Normal',
    category: 'lipid',
    clinicalNote: 'Fatty acid esters derived from dietary fats and carbs.',
    trendNotice: 'Down from 158 mg/dL (Now within desirable limits)'
  },
  {
    id: 'lab-05',
    date: '2026-09-15',
    testName: 'Fasting Blood Glucose',
    value: 94,
    numericValue: 94,
    unit: 'mg/dL',
    referenceRange: '70 - 99',
    status: 'Normal',
    category: 'metabolic',
    clinicalNote: 'Serum glucose concentration after 10-hour fast.',
    trendNotice: 'Stable across all recorded checkups'
  },
  {
    id: 'lab-06',
    date: '2026-09-15',
    testName: 'Hemoglobin A1c (HbA1c)',
    value: 5.6,
    numericValue: 5.6,
    unit: '%',
    referenceRange: '< 5.7',
    status: 'Normal',
    category: 'metabolic',
    clinicalNote: 'Glycated hemoglobin reflecting ~90-day mean glucose.',
    trendNotice: 'Improved from 5.7% (borderline) to 5.6% (normal)'
  },
  {
    id: 'lab-07',
    date: '2026-09-15',
    testName: 'eGFR (Kidney Function)',
    value: 94,
    numericValue: 94,
    unit: 'mL/min/1.73m²',
    referenceRange: '> 60',
    status: 'Optimal',
    category: 'renal',
    clinicalNote: 'Glomerular filtration rate verifying healthy kidney clearance.',
    trendNotice: 'Consistent high filtration capacity'
  },
  {
    id: 'lab-08',
    date: '2026-09-15',
    testName: 'Hemoglobin',
    value: 15.2,
    numericValue: 15.2,
    unit: 'g/dL',
    referenceRange: '13.8 - 17.2',
    status: 'Normal',
    category: 'hematology',
    clinicalNote: 'Oxygen-binding protein inside red blood cells.',
    trendNotice: 'Optimal red cell mass'
  },
  {
    id: 'lab-09',
    date: '2026-09-15',
    testName: 'Serum 25-OH Vitamin D',
    value: 48,
    numericValue: 48,
    unit: 'ng/mL',
    referenceRange: '30 - 100',
    status: 'Optimal',
    category: 'vitamin',
    clinicalNote: 'Circulating storage form of Vitamin D.',
    trendNotice: 'Rose from 29 ng/mL (insufficient) after supplementation'
  },
  // March 2026 historical test values
  {
    id: 'lab-m01',
    date: '2026-03-10',
    testName: 'Total Cholesterol',
    value: 224,
    numericValue: 224,
    unit: 'mg/dL',
    referenceRange: '< 200',
    status: 'Elevated',
    category: 'lipid'
  },
  {
    id: 'lab-m02',
    date: '2026-03-10',
    testName: 'LDL Cholesterol',
    value: 146,
    numericValue: 146,
    unit: 'mg/dL',
    referenceRange: '< 100',
    status: 'Elevated',
    category: 'lipid'
  },
  {
    id: 'lab-m03',
    date: '2026-03-10',
    testName: 'HDL Cholesterol',
    value: 48,
    numericValue: 48,
    unit: 'mg/dL',
    referenceRange: '> 40',
    status: 'Normal',
    category: 'lipid'
  },
  {
    id: 'lab-m04',
    date: '2026-03-10',
    testName: 'Triglycerides',
    value: 158,
    numericValue: 158,
    unit: 'mg/dL',
    referenceRange: '< 150',
    status: 'Elevated',
    category: 'lipid'
  },
  {
    id: 'lab-m05',
    date: '2026-03-10',
    testName: 'HbA1c',
    value: 5.7,
    numericValue: 5.7,
    unit: '%',
    referenceRange: '< 5.7',
    status: 'Elevated',
    category: 'metabolic'
  },
  // September 2025 (1 year ago) historical test values
  {
    id: 'lab-y01',
    date: '2025-09-20',
    testName: 'Total Cholesterol',
    value: 232,
    numericValue: 232,
    unit: 'mg/dL',
    referenceRange: '< 200',
    status: 'Elevated',
    category: 'lipid'
  },
  {
    id: 'lab-y02',
    date: '2025-09-20',
    testName: 'LDL Cholesterol',
    value: 154,
    numericValue: 154,
    unit: 'mg/dL',
    referenceRange: '< 100',
    status: 'Elevated',
    category: 'lipid'
  },
  {
    id: 'lab-y03',
    date: '2025-09-20',
    testName: 'HDL Cholesterol',
    value: 46,
    numericValue: 46,
    unit: 'mg/dL',
    referenceRange: '> 40',
    status: 'Normal',
    category: 'lipid'
  },
  {
    id: 'lab-y04',
    date: '2025-09-20',
    testName: 'Triglycerides',
    value: 168,
    numericValue: 168,
    unit: 'mg/dL',
    referenceRange: '< 150',
    status: 'Elevated',
    category: 'lipid'
  }
];

export const HISTORICAL_TIMELINE = [
  {
    id: 'tl-01',
    year: '2026',
    date: 'September 15, 2026',
    title: 'Comprehensive Diagnostic Blood & Lipid Panel',
    type: 'Lab Test',
    badgeColor: 'blue',
    summary: 'LDL improved to 138 mg/dL (-8 mg/dL). Normal metabolic and renal parameters.',
    actionLabel: 'View Detailed Lab Report'
  },
  {
    id: 'tl-02',
    year: '2026',
    date: 'July 18, 2026',
    title: 'Annual Full-Body Skin Cancer Screening',
    type: 'Doctor Visit',
    badgeColor: 'purple',
    summary: 'Dr. Elena Rostova completed dermoscopy. All assessed nevi benign.',
    actionLabel: 'View Clinical Notes'
  },
  {
    id: 'tl-03',
    year: '2026',
    date: 'June 15, 2026',
    title: 'Initiated Low-Dose Statin Therapy (Atorvastatin 10mg)',
    type: 'Medication',
    badgeColor: 'emerald',
    summary: 'Commenced preventive lipid lowering protocol following cardiovascular consultation.',
    actionLabel: 'Medication Details'
  },
  {
    id: 'tl-04',
    year: '2026',
    date: 'March 10, 2026',
    title: 'Baseline Bi-Annual Blood Screening',
    type: 'Lab Test',
    badgeColor: 'blue',
    summary: 'LDL recorded at 146 mg/dL, HbA1c 5.7%. Lifestyle modifications initiated.',
    actionLabel: 'View Historical Values'
  },
  {
    id: 'tl-05',
    year: '2025',
    date: 'November 12, 2025',
    title: 'Seasonal Influenza Immunization',
    type: 'Vaccination',
    badgeColor: 'amber',
    summary: 'Quadrivalent flu vaccine administered at City Health Center.',
    actionLabel: 'Immunization Record'
  },
  {
    id: 'tl-06',
    year: '2025',
    date: 'September 20, 2025',
    title: 'Annual Comprehensive Physical Examination',
    type: 'Doctor Visit',
    badgeColor: 'purple',
    summary: 'Routine health checkup with Dr. Sarah Jenkins. Recommended lipid surveillance.',
    actionLabel: 'Summary Record'
  }
];

export const INITIAL_SYMPTOMS: SymptomEntry[] = [
  {
    id: 'sym-01',
    date: '2026-09-26',
    time: '04:15 PM',
    symptom: 'Tension-type Headache',
    severity: 3,
    duration: '45 mins',
    location: 'Bilateral forehead / temples',
    possibleTriggers: '6 consecutive hours on laptop screens without break, dehydration',
    notes: 'Drank 500ml water, dimmed monitor brightness, took a 15-minute walk outside. Resolved spontaneously.'
  },
  {
    id: 'sym-02',
    date: '2026-09-22',
    time: '07:30 AM',
    symptom: 'Cervical / Right Shoulder Muscular Stiffness',
    severity: 2,
    duration: '2 hours',
    location: 'Right trapezius and neck',
    possibleTriggers: 'Suboptimal sleeping pillow alignment',
    notes: 'Gentle stretching and warm morning shower relieved discomfort.'
  },
  {
    id: 'sym-03',
    date: '2026-09-14',
    time: '03:45 PM',
    symptom: 'Mid-afternoon Fatigue',
    severity: 4,
    duration: '1.5 hours',
    location: 'Generalized',
    possibleTriggers: 'High glycemic lunch (large pasta bowl) and short sleep previous night',
    notes: 'Noted correlation with carbohydrate-heavy meal.'
  }
];

export const INITIAL_MEALS: MealItem[] = [
  {
    id: 'meal-01',
    type: 'Breakfast',
    name: 'Greek Yogurt Bowl with Blueberries, Chia & Walnuts',
    calories: 360,
    proteinGrams: 26,
    carbsGrams: 32,
    fatGrams: 14,
    time: '08:15 AM',
    highlights: ['Omega-3', 'Probiotics', 'Antioxidants']
  },
  {
    id: 'meal-02',
    type: 'Lunch',
    name: 'Grilled Salmon Salad with Quinoa, Avocado & Olive Oil',
    calories: 580,
    proteinGrams: 42,
    carbsGrams: 38,
    fatGrams: 22,
    time: '12:45 PM',
    highlights: ['Lean EPA/DHA', 'Fiber', 'Monounsaturated Fats']
  },
  {
    id: 'meal-03',
    type: 'Snack',
    name: 'Sliced Honeycrisp Apple & 12 Raw Almonds',
    calories: 190,
    proteinGrams: 5,
    carbsGrams: 24,
    fatGrams: 9,
    time: '04:00 PM',
    highlights: ['Pectin Fiber', 'Vitamin E']
  }
];

export const TODAY_ACTIVITY: DailyActivityMetrics = {
  date: '2026-09-28',
  steps: 7850,
  targetSteps: 8000,
  caloriesBurned: 580,
  targetCalories: 600,
  activeMinutes: 38,
  targetActiveMinutes: 30,
  distanceKm: 5.9,
  waterIntakeMl: 2100,
  targetWaterMl: 2500,
  restingHeartRate: 71,
  systolicBP: 124,
  diastolicBP: 82,
  weightKg: 80.2
};

export const RECENT_SLEEP_RECORDS: SleepRecord[] = [
  {
    date: '2026-09-28',
    durationMinutes: 442, // 7h 22m
    score: 87,
    bedtime: '10:45 PM',
    wakeTime: '06:07 AM',
    deepSleepPercent: 21,
    remSleepPercent: 24,
    lightSleepPercent: 55,
    restingHeartRate: 61
  },
  {
    date: '2026-09-27',
    durationMinutes: 425, // 7h 05m
    score: 84,
    bedtime: '11:10 PM',
    wakeTime: '06:15 AM',
    deepSleepPercent: 19,
    remSleepPercent: 22,
    lightSleepPercent: 59,
    restingHeartRate: 63
  },
  {
    date: '2026-09-26',
    durationMinutes: 395, // 6h 35m
    score: 78,
    bedtime: '11:40 PM',
    wakeTime: '06:15 AM',
    deepSleepPercent: 17,
    remSleepPercent: 20,
    lightSleepPercent: 63,
    restingHeartRate: 64
  },
  {
    date: '2026-09-25',
    durationMinutes: 450, // 7h 30m
    score: 89,
    bedtime: '10:30 PM',
    wakeTime: '06:00 AM',
    deepSleepPercent: 23,
    remSleepPercent: 25,
    lightSleepPercent: 52,
    restingHeartRate: 60
  }
];

export const INITIAL_HEALTH_GOALS: HealthGoal[] = [
  {
    id: 'goal-01',
    title: 'Daily Step Target',
    category: 'fitness',
    targetValue: 8000,
    currentValue: 7850,
    unit: 'steps',
    streakDays: 6,
    completed: false
  },
  {
    id: 'goal-02',
    title: 'Optimal Hydration',
    category: 'hydration',
    targetValue: 2500,
    currentValue: 2100,
    unit: 'ml',
    streakDays: 12,
    completed: false
  },
  {
    id: 'goal-03',
    title: 'Weekly Cardio Exercise',
    category: 'fitness',
    targetValue: 150,
    currentValue: 168,
    unit: 'minutes',
    streakDays: 4,
    completed: true
  },
  {
    id: 'goal-04',
    title: 'Resting Blood Pressure Target',
    category: 'heart',
    targetValue: 120,
    currentValue: 124,
    unit: 'mmHg systolic',
    streakDays: 8,
    completed: false
  },
  {
    id: 'goal-05',
    title: 'Consistent 7+ Hours Sleep',
    category: 'sleep',
    targetValue: 420,
    currentValue: 442,
    unit: 'minutes',
    streakDays: 3,
    completed: true
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Comprehensive Diagnostic Metabolic & Lipid Profile',
    category: 'Lab Report',
    date: '2026-09-15',
    provider: 'Quest Diagnostics / LabCorp Inc.',
    fileSize: '1.4 MB PDF',
    summary: 'Full blood chemistry evaluating fasting glucose, HbA1c, renal filtration (eGFR), and lipid panel (Total, LDL, HDL, Triglycerides). Mild borderline LDL elevation.',
  },
  {
    id: 'doc-02',
    title: 'Cardiovascular Preventive Consultation & Plan',
    category: 'Doctor Summary',
    date: '2026-06-15',
    provider: 'Dr. Sarah Jenkins, MD, FACC',
    fileSize: '840 KB PDF',
    summary: 'Clinical consultation notes initiating 10mg Atorvastatin and 30 minutes daily aerobic walking. Calculated 10-year ASCVD risk score at 3.4% (low-to-moderate category).'
  },
  {
    id: 'doc-03',
    title: 'Annual Dermatology Screening Clearance',
    category: 'Doctor Summary',
    date: '2026-07-18',
    provider: 'Advanced Dermatology Center',
    fileSize: '420 KB PDF',
    summary: 'Full dermoscopic skin exam. All examined skin lesions and nevi exhibited symmetric, benign architecture.'
  },
  {
    id: 'doc-04',
    title: 'Standard 12-Lead Electrocardiogram (ECG) Report',
    category: 'Imaging/ECG',
    date: '2025-09-20',
    provider: 'Metropolitan Heart Pavilion',
    fileSize: '2.1 MB PDF',
    summary: 'Normal sinus rhythm at 68 bpm. Normal axis, PR interval (152 ms), QRS duration (88 ms), and QTc (410 ms). No ischemic ST-T abnormalities.'
  }
];

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'badge-01',
    title: 'Hydration Champion',
    description: 'Drank 2.5L+ water for 10 consecutive days',
    iconName: 'Droplets',
    unlockedAt: '2026-09-25',
    progressPercent: 100
  },
  {
    id: 'badge-02',
    title: 'Cardio Vitality',
    description: 'Surpassed 150 active minutes in a single week',
    iconName: 'Flame',
    unlockedAt: '2026-09-27',
    progressPercent: 100
  },
  {
    id: 'badge-03',
    title: 'Lab Explorer',
    description: 'Uploaded and analyzed your first diagnostic report with Gemini AI',
    iconName: 'FileCheck',
    unlockedAt: '2026-09-15',
    progressPercent: 100
  },
  {
    id: 'badge-04',
    title: 'Sleep Architect',
    description: 'Maintained 85+ sleep score for 5 days in a row',
    iconName: 'Moon',
    progressPercent: 60
  },
  {
    id: 'badge-05',
    title: 'Master of Consistency',
    description: 'Took all scheduled medications on time for 30 days',
    iconName: 'Award',
    progressPercent: 80
  }
];

export const PREVENTIVE_SCREENINGS = [
  {
    id: 'prev-01',
    title: 'Lipid & Cardiovascular Risk Assessment',
    guideline: 'USPSTF / AHA / ACC',
    targetAge: 'Adults aged 20-79',
    frequency: 'Every 4-6 months during active therapy; annually for surveillance',
    status: 'Up-to-date (Last: Sep 2026)',
    statusBadge: 'completed',
    relevance: 'Essential for tracking response to Atorvastatin and lifestyle modifications.'
  },
  {
    id: 'prev-02',
    title: 'Blood Pressure Evaluation',
    guideline: 'AHA / ACC Guidelines',
    targetAge: 'All adults aged 18+',
    frequency: 'At every routine clinical encounter or monthly home tracking',
    status: 'Active (Current avg: 124/82 mmHg)',
    statusBadge: 'active',
    relevance: 'Early detection of pre-hypertension protects arterial and renal vascular beds.'
  },
  {
    id: 'prev-03',
    title: 'Colorectal Cancer Screening Discussion',
    guideline: 'USPSTF / ACS',
    targetAge: 'Recommended starting at age 45 (or 40 with family history)',
    frequency: 'Discussion with physician; screening starting in 7 years',
    status: 'Upcoming / Future Planning',
    statusBadge: 'scheduled',
    relevance: 'Discuss timing and preferred modality (FIT stool DNA vs Colonoscopy) with PCP.'
  },
  {
    id: 'prev-04',
    title: 'Annual Comprehensive Skin & Mole Exam',
    guideline: 'American Academy of Dermatology',
    targetAge: 'Adults with sun exposure or baseline nevi',
    frequency: 'Annually',
    status: 'Completed (Next due: July 2027)',
    statusBadge: 'completed',
    relevance: 'Detects early cellular dysplasias and melanoma risk.'
  },
  {
    id: 'prev-05',
    title: 'Comprehensive Dilated Eye Examination',
    guideline: 'American Academy of Ophthalmology',
    targetAge: 'Adults aged 20-39 with digital strain / corrective lenses',
    frequency: 'Every 1-2 years',
    status: 'Due Soon (Recommended by Nov 2026)',
    statusBadge: 'due',
    relevance: 'Assesses retinal microvasculature, refractive visual acuity, and intraocular pressure.'
  }
];
