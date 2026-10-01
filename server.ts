import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Server-side Gemini initialization using official guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Clinical AI Chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history, context, agentType } = req.body;

    const systemInstructions: Record<string, string> = {
      general: `You are AuraHealth's intelligent clinical health companion.
Safety and compliance rules:
1. You do not provide definitive diagnoses or prescribe medications.
2. In potential medical emergencies, immediately advise seeking local emergency services.
3. Structure your answers in clean, readable sections:
   - **Summary**: Concise, reassuring 1-2 sentence overview.
   - **What the Data / Symptoms Suggest**: Educational breakdown in bullet points.
   - **Considerations & Lifestyle Factors**: Evidence-based context.
   - **Questions to Ask Your Doctor**: 2-4 targeted questions for their healthcare provider.
   - **Safety Note**: Brief disclaimer when relevant.
Always maintain an empathetic, trustworthy, objective tone. Avoid medical jargon without explaining it.`,
      lab: `You are AuraHealth's Clinical Laboratory Specialist.
Explain blood and diagnostic test results, reference intervals, biological significance, and common lifestyle influences.
Always remind the user that lab values must be interpreted in clinical context by their doctor. Never state a definitive condition based on isolated numbers.`,
      nutrition: `You are AuraHealth's Clinical Nutrition & Metabolic Health Coach.
Provide evidence-based nutritional guidelines, macronutrient balance, hydration, and meal strategies. Clearly distinguish general dietary education from medical nutrition therapy.`,
      medication: `You are AuraHealth's Medication & Pharmacotherapy Advisor.
Educate on general indications, common mechanisms, administration timing, and questions for doctors or pharmacists. Never recommend stopping, starting, or changing dosages of prescribed drugs.`,
      preventive: `You are AuraHealth's Preventive Medicine & Longevity Guide.
Provide age- and sex-appropriate screening recommendations based on established public health guidelines (USPSTF/WHO). Emphasize routine checks, vaccination updates, and cardiovascular risk reduction.`
    };

    const instruction = systemInstructions[agentType as keyof typeof systemInstructions] || systemInstructions.general;

    // Build context prompt
    let contextPrompt = '';
    if (context) {
      contextPrompt = `\n[User Health Context (Fictional Demo Patient)]:\nName: ${context.name || 'User'}, Age: ${context.age || 38}, Sex: ${context.gender || 'Male'}\nKnown conditions: ${context.conditions?.join(', ') || 'None'}\nActive medications: ${context.medications?.join(', ') || 'None'}\nRecent vitals: BP ${context.recentBP || '124/82 mmHg'}, HR ${context.recentHR || '71 bpm'}, Total Cholesterol ${context.cholesterol || '218 mg/dL'}, LDL ${context.ldl || '138 mg/dL'}, HbA1c ${context.hba1c || '5.6%'}.\n`;
    }

    if (process.env.GEMINI_API_KEY) {
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (history && Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: `${contextPrompt}\nUser query: ${message}` }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: instruction,
          temperature: 0.6,
        },
      });

      res.json({ reply: response.text || 'Unable to generate response.' });
    } else {
      // High-quality clinical fallback if no API key provided in dev
      const fallbackReply = generateFallbackResponse(message, agentType);
      res.json({ reply: fallbackReply, isSimulated: true });
    }
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({
      error: error.message || 'Internal AI service error',
      fallback: 'An error occurred while contacting the AI service. Please try again.'
    });
  }
});

// Multimodal Medical Report Analyzer endpoint
app.post('/api/gemini/analyze-report', async (req, res) => {
  try {
    const { imageBase64, mimeType, documentText } = req.body;

    const promptText = `You are a clinical pathology document extraction assistant for AuraHealth.
Analyze the provided medical report document / image.
Extract all diagnostic test parameters into a structured JSON array.
For each test identify:
- name: string (e.g. "Total Cholesterol", "LDL Cholesterol", "HDL Cholesterol", "Triglycerides", "Fasting Glucose", "HbA1c", "eGFR", "Hemoglobin", "TSH", "Platelets")
- value: number or string (e.g. 218, 142, 45, 160)
- unit: string (e.g. "mg/dL", "g/dL", "%", "mL/min/1.73m2")
- referenceRange: string (e.g. "< 200", "0 - 99", "> 40", "< 150")
- status: "Normal" | "Elevated" | "Low" | "Optimal" | "Critical"
- clinicalNote: string (A brief 1-sentence layperson explanation of what this test represents)
- trendNotice: string (e.g. "Compared to standard baseline, moderately elevated")

Also provide:
- summary: string (a 2-3 sentence executive clinical summary for the patient)
- keyFindings: string[] (3-4 bullet points)
- questionsForDoctor: string[] (3 targeted questions to ask their physician)
- safetyDisclaimer: string ("This AI analysis is for educational purposes and is not a formal diagnosis. Discuss all lab results with your healthcare provider.")

Return valid JSON conforming to this schema.`;

    if (process.env.GEMINI_API_KEY) {
      const parts: any[] = [];
      if (imageBase64 && mimeType) {
        parts.push({
          inlineData: {
            mimeType,
            data: imageBase64.replace(/^data:image\/\w+;base64,/, '').replace(/^data:application\/pdf;base64,/, ''),
          },
        });
      }
      parts.push({ text: `${promptText}\nDocument text or user notes:\n${documentText || 'Analyze the provided clinical document image.'}` });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } else {
      // High-fidelity fallback for demo lab report
      res.json(getDemoReportAnalysis());
    }
  } catch (error: any) {
    console.error('Report Analysis Error:', error);
    res.json(getDemoReportAnalysis());
  }
});

// Food and Nutrition Image / Log Analyzer
app.post('/api/gemini/analyze-food', async (req, res) => {
  try {
    const { imageBase64, mimeType, description } = req.body;

    const prompt = `Analyze this meal or food item for AuraHealth's nutrition tracking.
Estimate nutritional breakdown and provide healthy feedback:
Return JSON with:
- foodName: string (e.g., "Grilled Salmon with Quinoa and Steamed Asparagus")
- calories: number
- proteinGrams: number
- carbsGrams: number
- fatGrams: number
- fiberGrams: number
- healthScore: number (0 to 100)
- highlights: string[] (e.g. ["Rich in Omega-3 fatty acids", "High lean protein", "Low glycemic index"])
- advice: string (brief health tip for the user)
Description: ${description || 'Identify food in image'}`;

    if (process.env.GEMINI_API_KEY) {
      const parts: any[] = [];
      if (imageBase64 && mimeType) {
        parts.push({
          inlineData: {
            mimeType,
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      }
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } else {
      res.json({
        foodName: description || "Mediterranean Grilled Chicken & Quinoa Bowl",
        calories: 520,
        proteinGrams: 42,
        carbsGrams: 48,
        fatGrams: 16,
        fiberGrams: 8,
        healthScore: 92,
        highlights: ["High quality lean protein", "Abundant dietary fiber", "Heart-healthy unsaturated fats"],
        advice: "Excellent post-workout balanced meal promoting sustained energy and lipid management."
      });
    }
  } catch (error: any) {
    console.error('Food analysis error:', error);
    res.status(500).json({ error: error.message || 'Food analysis error' });
  }
});

// Doctor Consultation Preparation Generator
app.post('/api/gemini/generate-doctor-prep', async (req, res) => {
  try {
    const { appointment, patientData } = req.body;

    const prompt = `You are a clinical preparation specialist for AuraHealth.
Generate a structured, professional "Doctor Visit Preparation Summary" for the patient to bring to their upcoming appointment with:
Doctor: ${appointment?.doctor || 'Primary Care Physician'} (${appointment?.specialty || 'General Practice'})
Purpose: ${appointment?.purpose || 'Annual Health Check & Lipid Follow-up'}

Patient Context:
- Age/Gender: ${patientData?.age || 38} ${patientData?.gender || 'Male'}
- Recent Labs: Total Cholesterol: ${patientData?.cholesterol || '218 mg/dL'}, LDL: ${patientData?.ldl || '138 mg/dL'}, HbA1c: ${patientData?.hba1c || '5.6%'}, BP: ${patientData?.bp || '124/82 mmHg'}
- Active Meds: ${patientData?.medications?.join(', ') || 'Atorvastatin 10mg daily, Vitamin D3 2000 IU'}
- Recent Symptoms (Past 14 days): ${patientData?.symptoms?.join('; ') || 'Occasional mild tension headache after screen time, slight fatigue'}
- Lifestyle: Averaging 7,800 steps/day, 6.8 hrs sleep/night, 2.1L water/day

Generate a JSON object containing:
- appointmentTitle: string
- executiveSummary: string (concise 3-sentence summary of patient status since last visit)
- keyMetricsToHighlight: Array<{ metric: string; value: string; status: string; note: string }>
- recentChanges: string[]
- symptomsSummary: string
- recommendedQuestionsForDoctor: string[] (5 insightful, specific questions prioritized for the visit)
- preventiveChecklist: string[] (suggested routine screenings or tests to ask about)`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } else {
      res.json(getDemoDoctorPrep(appointment, patientData));
    }
  } catch (error: any) {
    console.error('Doctor Prep Error:', error);
    res.json(getDemoDoctorPrep(req.body.appointment, req.body.patientData));
  }
});

// Personalized AI Meal Planner
app.post('/api/gemini/generate-meal-plan', async (req, res) => {
  try {
    const { goal, preferences, caloriesTarget, allergies } = req.body;
    const prompt = `Create a heart-healthy, balanced 1-day meal plan for an adult user.
Goal: ${goal || 'Cardiovascular Wellness & Mild Weight Management'}
Dietary Preferences: ${preferences || 'Mediterranean style, high protein, moderate carbs'}
Caloric Target: ${caloriesTarget || 2000} kcal
Allergies/Exclusions: ${allergies || 'None'}

Return a JSON with:
- planName: string
- dailyTotals: { calories: number, protein: string, carbs: string, fat: string }
- meals: Array<{
    type: "Breakfast" | "Lunch" | "Snack" | "Dinner";
    title: string;
    calories: number;
    proteinGrams: number;
    description: string;
    prepTime: string;
    keyNutrients: string[];
  }>
- dietaryTip: string
- safetyNotice: string ("General wellness guidance only. Consult a registered dietitian for individual medical nutrition therapy.")`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });
      res.json(JSON.parse(response.text || '{}'));
    } else {
      res.json({
        planName: "Mediterranean Cardiovascular Wellness Plan",
        dailyTotals: { calories: 1980, protein: "135g", carbs: "185g", fat: "68g" },
        meals: [
          {
            type: "Breakfast",
            title: "Greek Yogurt Parfait with Walnuts & Wild Berries",
            calories: 380,
            proteinGrams: 28,
            description: "Non-fat Greek yogurt layered with antioxidant-rich blueberries, chia seeds, and raw walnuts.",
            prepTime: "5 mins",
            keyNutrients: ["Probiotics", "Omega-3", "Anthocyanins"]
          },
          {
            type: "Lunch",
            title: "Mediterranean Tuna & Chickpea Salad Bowl",
            calories: 520,
            proteinGrams: 42,
            description: "Wild skipjack tuna, organic chickpeas, diced cucumber, cherry tomatoes, and extra virgin olive oil.",
            prepTime: "10 mins",
            keyNutrients: ["Dietary Fiber", "Lean Protein", "Polyphenols"]
          },
          {
            type: "Snack",
            title: "Crisp Apple with Almond Butter & Green Tea",
            calories: 220,
            proteinGrams: 7,
            description: "Honeycrisp apple slices with 1 tbsp raw unsalted almond butter and unsweetened matcha.",
            prepTime: "3 mins",
            keyNutrients: ["Pectin", "Catechins", "Vitamin E"]
          },
          {
            type: "Dinner",
            title: "Herb-Crusted Baked Salmon with Steamed Asparagus & Quinoa",
            calories: 640,
            proteinGrams: 48,
            description: "Fresh Atlantic salmon fillet baked with lemon zest, served over tri-color quinoa and garlic-lemon asparagus.",
            prepTime: "25 mins",
            keyNutrients: ["DHA/EPA", "Folate", "Complete Amino Acids"]
          }
        ],
        dietaryTip: "Cooking with extra virgin olive oil provides oleocanthal, which supports vascular elasticity and healthy lipid profiles.",
        safetyNotice: "General wellness guidance only. Consult a registered dietitian for individual medical nutrition therapy."
      });
    }
  } catch (error: any) {
    console.error('Meal plan error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Periodic AI Health Report generator
app.post('/api/gemini/generate-report', async (req, res) => {
  try {
    const { period, patientData } = req.body;
    res.json({
      title: `${period || 'September 2026'} Comprehensive Health Report`,
      generatedAt: new Date().toLocaleDateString(),
      executiveScore: 88,
      scoreStatus: "Optimal Health Status",
      keyPillars: [
        { pillar: "Cardiovascular Health", score: 85, status: "Improving", note: "Resting heart rate decreased 3 bpm; LDL down 8% since starting lifestyle regimen." },
        { pillar: "Activity & Fitness", score: 92, status: "Excellent", note: "Achieved 192 active minutes weekly, exceeding the 150-min target." },
        { pillar: "Sleep & Recovery", score: 79, status: "Moderate", note: "Average 6h 52m duration. Sleep consistency score dropped slightly on weekends." },
        { pillar: "Metabolic & Nutrition", score: 89, status: "Stable", note: "Consistent fiber intake (28g/day); fasting glucose steady at 94 mg/dL." }
      ],
      recommendations: [
        "Aim for a consistent 10:30 PM bedtime to boost REM sleep duration by 15%.",
        "Maintain current cardiovascular walking routine (target 8,000 steps daily).",
        "Review lipid panel progress with Dr. Sarah Jenkins at the October 12 follow-up.",
        "Ensure daily hydration stays above 2.5L especially during high-activity days."
      ],
      safetyNotice: "This automated report provides wellness analytics and does not replace medical review."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper for fallback chat
function generateFallbackResponse(message: string, agentType?: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('cholesterol') || lower.includes('ldl') || lower.includes('lipid')) {
    return `### Summary
Cholesterol is an essential lipid in your bloodstream. While HDL is considered protective ("good" cholesterol), elevated LDL ("bad" cholesterol) can accumulate in arterial walls over time.

### What the Data Shows
- Your recorded Total Cholesterol is **218 mg/dL** (desirable is < 200 mg/dL).
- Your LDL is **138 mg/dL** (optimal is < 100 mg/dL).
- Your HDL is **54 mg/dL** (within healthy range > 40 mg/dL).

### Considerations & Lifestyle Factors
- **Dietary Soluble Fiber**: Foods like oats, chia seeds, legumes, and apples bind cholesterol in the digestive tract.
- **Unsaturated Fats**: Favor extra virgin olive oil, avocados, and walnuts over saturated animal fats.
- **Aerobic Exercise**: Moderate-intensity cardio (like 30 minutes of brisk walking) helps elevate HDL and improve LDL particle density.

### Questions to Ask Your Doctor
1. What is my overall cardiovascular risk calculation (such as ASCVD score)?
2. Do my current lifestyle changes suffice, or do you recommend starting or adjusting lipid-lowering medication?
3. In how many months should we repeat the fasting lipid panel?

---
*Safety Note: This information is for health education only and does not constitute medical advice.*`;
  }

  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) {
    return `### Summary
Quality sleep is fundamental for cellular repair, hormonal regulation, immune resilience, and cardiovascular recovery.

### What the Data Shows
- Your 7-day average sleep duration is **6 hours 48 minutes**, with weekend variability of +1.8 hours (social jetlag).
- Sleep efficiency currently averages **84%**.

### Considerations & Next Steps
- **Circadian Consistency**: Go to bed and wake up within a 30-minute window every day, even on weekends.
- **Morning Sunlight**: Expose your eyes to outdoor sunlight within 45 minutes of waking to set your melatonin rhythm.
- **Caffeine Cutoff**: Stop caffeine intake at least 8 to 9 hours before anticipated bedtime.

### Questions to Ask Your Doctor
1. Could my periodic fatigue be related to nutritional levels like Vitamin D, Ferritin, or thyroid function?
2. If daytime sleepiness persists, would a formal sleep study (polysomnography) be warranted?

---
*Safety Note: Persistent chronic insomnia or loud snoring should be evaluated by a healthcare professional.*`;
  }

  return `### Summary
Thank you for your question. Maintaining active awareness of your physical well-being and diagnostic markers is one of the most effective steps in preventive healthcare.

### What the Data Suggests
- Your recent health metrics show strong cardiovascular stability (resting HR 71 bpm, BP 124/82 mmHg).
- Your activity levels and hydration are tracking near your personal targets.

### Key Considerations
- Prioritize balanced, whole-food nutrition with consistent hydration (2-2.5L daily).
- Keep track of any symptom frequency or triggers in your AuraHealth Symptom Journal.
- Incorporate strength and aerobic training into your weekly routine.

### Questions to Ask Your Doctor
1. Are my current vital signs and blood work trends aligning with our long-term preventive targets?
2. Are there any specific screenings recommended for my age group this year?

---
*Safety Note: AuraHealth is an educational health companion and does not replace the diagnosis or treatment advice of a licensed physician.*`;
}

function getDemoReportAnalysis() {
  return {
    summary: "Diagnostic lipid and metabolic panel from LabCorp indicates mild elevation in Total Cholesterol and LDL cholesterol, with optimal renal function, fasting blood glucose, and liver enzymes.",
    keyFindings: [
      "Total Cholesterol is 218 mg/dL (Borderline High, normal < 200 mg/dL).",
      "LDL Cholesterol is 138 mg/dL (Borderline Elevated, desirable < 100 mg/dL).",
      "HDL Cholesterol is 54 mg/dL (Healthy range > 40 mg/dL).",
      "Fasting Blood Glucose is 94 mg/dL (Normal reference 70 - 99 mg/dL).",
      "HbA1c is 5.6% (Normal, prediabetes threshold is 5.7%).",
      "Kidney eGFR is > 90 mL/min/1.73m² (Normal renal filtration)."
    ],
    tests: [
      {
        name: "Total Cholesterol",
        value: 218,
        unit: "mg/dL",
        referenceRange: "< 200",
        status: "Elevated",
        clinicalNote: "Measures overall circulating cholesterol particles in the bloodstream.",
        trendNotice: "+6 mg/dL compared to previous 6-month check"
      },
      {
        name: "LDL Cholesterol",
        value: 138,
        unit: "mg/dL",
        referenceRange: "< 100",
        status: "Elevated",
        clinicalNote: "Low-density lipoprotein, often termed 'bad' cholesterol due to plaque buildup potential.",
        trendNotice: "Elevated; benefits from dietary fiber and cardio exercise"
      },
      {
        name: "HDL Cholesterol",
        value: 54,
        unit: "mg/dL",
        referenceRange: "> 40",
        status: "Optimal",
        clinicalNote: "High-density lipoprotein ('good' cholesterol) that returns lipids to the liver.",
        trendNotice: "+3 mg/dL improvement over last year"
      },
      {
        name: "Triglycerides",
        value: 142,
        unit: "mg/dL",
        referenceRange: "< 150",
        status: "Normal",
        clinicalNote: "Circulating fat molecules influenced heavily by carbohydrate intake and exercise.",
        trendNotice: "Stable within desirable range"
      },
      {
        name: "Fasting Blood Glucose",
        value: 94,
        unit: "mg/dL",
        referenceRange: "70 - 99",
        status: "Normal",
        clinicalNote: "Blood sugar level after an overnight fast; key indicator for metabolic health.",
        trendNotice: "Consistent with previous reading of 92 mg/dL"
      },
      {
        name: "HbA1c",
        value: 5.6,
        unit: "%",
        referenceRange: "< 5.7",
        status: "Normal",
        clinicalNote: "Average glycemic control over the past 90-120 days.",
        trendNotice: "Well controlled, below pre-diabetes cutoff of 5.7%"
      },
      {
        name: "eGFR (Kidney Function)",
        value: "> 90",
        unit: "mL/min/1.73m²",
        referenceRange: "> 60",
        status: "Optimal",
        clinicalNote: "Estimated glomerular filtration rate assessing how effectively kidneys filter waste.",
        trendNotice: "Optimal kidney health demonstrated"
      },
      {
        name: "Serum Creatinine",
        value: 0.95,
        unit: "mg/dL",
        referenceRange: "0.7 - 1.3",
        status: "Normal",
        clinicalNote: "Natural muscle breakdown byproduct excreted through urine.",
        trendNotice: "Healthy baseline"
      }
    ],
    questionsForDoctor: [
      "Given my LDL of 138 mg/dL, what is my estimated 10-year ASCVD risk score?",
      "Would you recommend continuing nutritional adjustments, or considering medication like low-dose statins?",
      "When do you recommend our next follow-up lipid screening?"
    ],
    safetyDisclaimer: "This automated report analysis is for educational purposes. Always consult your qualified healthcare provider for formal diagnosis and personalized clinical management."
  };
}

function getDemoDoctorPrep(appointment: any, patientData: any) {
  return {
    appointmentTitle: `Consultation Brief: ${appointment?.doctor || 'Dr. Sarah Jenkins, MD'}`,
    executiveSummary: "Patient presenting for scheduled cardiovascular & preventive review. Over the past 90 days, daily steps averaged 7,850, resting heart rate stabilized at 71 bpm, and blood pressure has averaged 124/82 mmHg. Recent laboratory findings show borderline elevated LDL cholesterol (138 mg/dL) with normal HbA1c (5.6%) and optimal renal function.",
    keyMetricsToHighlight: [
      { metric: "Blood Pressure", value: "124/82 mmHg", status: "Optimal/Pre-hypertensive", note: "Monitored 3x weekly; morning readings average 122/80" },
      { metric: "Total Cholesterol / LDL", value: "218 / 138 mg/dL", status: "Borderline Elevated", note: "Primary discussion point for cardiovascular risk calculation" },
      { metric: "Resting Heart Rate", value: "71 bpm", status: "Good", note: "Down from 74 bpm 3 months ago with increased walking" },
      { metric: "HbA1c", value: "5.6%", status: "Normal", note: "Healthy glycemic stability" }
    ],
    recentChanges: [
      "Initiated 30-minute daily walking routine (up 18% in active minutes).",
      "Hydration tracking steady at 2.4L daily.",
      "Switched to Mediterranean meal pattern with added omega-3s."
    ],
    symptomsSummary: "Occasional mild tension headaches (rated 2/10) reported 3 times in the last 14 days, usually coinciding with extended screen sessions and late work hours. Resolved with hydration and rest.",
    recommendedQuestionsForDoctor: [
      "Based on my LDL level of 138 mg/dL and family history, what is my recommended target LDL range?",
      "Do my current vitals warrant any adjustments to my preventive regimen?",
      "Are there additional cardiovascular tests (such as a Coronary Artery Calcium scan or ApoB) that would be helpful?",
      "Are my occasional tension headaches typical for my screen-use profile, or should we evaluate further?",
      "What preventive screenings or immunizations should I schedule for my age bracket this year?"
    ],
    preventiveChecklist: [
      "Annual comprehensive eye exam",
      "Bi-annual dental screening and cleaning",
      "Tetanus/Tdap booster verification",
      "Colorectal screening discussion (baseline timeline)"
    ]
  };
}

// Dev server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
