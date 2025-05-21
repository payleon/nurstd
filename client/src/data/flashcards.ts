export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReviewDate?: Date;
  repetitionLevel: number; // 0-5, indicates how well the card is known
  tags: string[];
}

// Spaced repetition intervals in days
// These determine how long to wait before showing a card again based on the confidence level
export const SPACED_REPETITION_INTERVALS = [
  0,      // level 0: repeat today (user didn't know it)
  1,      // level 1: repeat tomorrow
  3,      // level 2: repeat in 3 days
  7,      // level 3: repeat in a week
  14,     // level 4: repeat in 2 weeks
  30,     // level 5: repeat in a month
];

// This function calculates the next review date
export function calculateNextReviewDate(repetitionLevel: number): Date {
  const now = new Date();
  const intervalDays = SPACED_REPETITION_INTERVALS[repetitionLevel];
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + intervalDays);
  return nextDate;
}

// Sample nursing flashcards
export const NURSING_FLASHCARDS: Flashcard[] = [
  {
    id: "1",
    question: "What is the normal range for arterial blood pH?",
    answer: "7.35-7.45",
    category: "Med-Surg",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["ABGs", "Acid-Base Balance", "Critical Care"]
  },
  {
    id: "2",
    question: "What is the most common cause of respiratory alkalosis?",
    answer: "Hyperventilation",
    category: "Med-Surg",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["ABGs", "Respiratory", "Acid-Base Balance"]
  },
  {
    id: "3",
    question: "What are the 5 P's of acute arterial ischemia?",
    answer: "Pain, Pallor, Pulselessness, Paresthesia, Paralysis/Poikilothermia",
    category: "Med-Surg",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Vascular", "Emergency", "Assessment"]
  },
  {
    id: "4",
    question: "What is the antidote for benzodiazepine overdose?",
    answer: "Flumazenil",
    category: "Pharmacology",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Antidotes", "Emergency", "Medications"]
  },
  {
    id: "5",
    question: "What is the normal range for serum potassium?",
    answer: "3.5-5.0 mEq/L",
    category: "Med-Surg",
    difficulty: "easy",
    repetitionLevel: 0,
    tags: ["Electrolytes", "Lab Values", "Fundamentals"]
  },
  {
    id: "6",
    question: "What are early signs of digoxin toxicity?",
    answer: "Nausea, vomiting, visual disturbances (yellow-green halos), cardiac arrhythmias",
    category: "Pharmacology",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Cardiac", "Medications", "Toxicity"]
  },
  {
    id: "7",
    question: "What assessment finding is characteristic of right heart failure?",
    answer: "Peripheral edema, jugular venous distention, and hepatomegaly",
    category: "Cardiac",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Heart Failure", "Assessment", "Cardiac"]
  },
  {
    id: "8",
    question: "What positions should be avoided after a lumbar puncture?",
    answer: "Trendelenburg position and positions that increase intracranial pressure",
    category: "Neurology",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Procedures", "Patient Care", "Neurology"]
  },
  {
    id: "9",
    question: "What is the primary type of shock seen in patients with sepsis?",
    answer: "Distributive shock",
    category: "Med-Surg",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Shock", "Sepsis", "Critical Care"]
  },
  {
    id: "10",
    question: "What are the therapeutic serum levels for lithium?",
    answer: "0.6-1.2 mEq/L",
    category: "Psychiatric",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Medications", "Psychiatric", "Lab Values"]
  },
  {
    id: "11",
    question: "What nursing intervention is priority for a client experiencing anaphylaxis?",
    answer: "Administer epinephrine and maintain airway",
    category: "Emergency",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Emergency", "Prioritization", "Pharmacology"]
  },
  {
    id: "12",
    question: "What are the stages of labor?",
    answer: "First stage: Dilation and effacement (latent, active, transition phases)\nSecond stage: Expulsion of fetus\nThird stage: Delivery of placenta\nFourth stage: Recovery (1-4 hours postpartum)",
    category: "Maternity",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Labor", "Delivery", "Maternity"]
  },
  {
    id: "13",
    question: "What is the expected urine output for an adult?",
    answer: "0.5-1 mL/kg/hour or approximately 30-50 mL/hour",
    category: "Med-Surg",
    difficulty: "easy",
    repetitionLevel: 0,
    tags: ["Renal", "Assessment", "Fundamentals"]
  },
  {
    id: "14",
    question: "What nursing interventions are appropriate for a client with increased intracranial pressure (ICP)?",
    answer: "Elevate head of bed 30-45 degrees, maintain head and neck in neutral alignment, avoid Valsalva maneuver, monitor neurological status frequently",
    category: "Neurology",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Neurology", "Critical Care", "Patient Care"]
  },
  {
    id: "15",
    question: "What are the classic symptoms of Cushing syndrome?",
    answer: "Moon face, buffalo hump, truncal obesity, purple striae, hypertension, hyperglycemia",
    category: "Endocrine",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Endocrine", "Assessment", "Pathophysiology"]
  },
  {
    id: "16",
    question: "Which immunizations should be avoided during pregnancy?",
    answer: "Live attenuated vaccines such as MMR, varicella, and intranasal influenza",
    category: "Maternity",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Maternity", "Immunizations", "Pregnancy"]
  },
  {
    id: "17",
    question: "What is the primary difference between Alzheimer's disease and vascular dementia?",
    answer: "Alzheimer's disease has a gradual onset and steady progression, while vascular dementia has a stepwise deterioration with periods of stability between declines",
    category: "Neurology",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Neurology", "Geriatrics", "Assessment"]
  },
  {
    id: "18",
    question: "What are the classic symptoms of deep vein thrombosis (DVT)?",
    answer: "Unilateral leg pain, swelling, warmth, and redness",
    category: "Med-Surg",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Vascular", "Assessment", "Complications"]
  },
  {
    id: "19",
    question: "What abnormal breath sounds would you expect to hear in a client with pulmonary edema?",
    answer: "Crackles (rales), especially in the dependent lung fields",
    category: "Respiratory",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Respiratory", "Assessment", "Heart Failure"]
  },
  {
    id: "20",
    question: "What are the components of the Glasgow Coma Scale (GCS)?",
    answer: "Eye opening (1-4), Verbal response (1-5), Motor response (1-6)",
    category: "Neurology",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Neurology", "Assessment", "Critical Care"]
  },
  {
    id: "21",
    question: "What is the normal range for central venous pressure (CVP)?",
    answer: "2-6 mmHg or 5-12 cmH₂O",
    category: "Critical Care",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Hemodynamics", "Critical Care", "Assessment"]
  },
  {
    id: "22",
    question: "What are the priorities of care for a client with DKA?",
    answer: "Fluid resuscitation, insulin administration, electrolyte replacement (especially potassium), and identifying and treating the underlying cause",
    category: "Endocrine",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Endocrine", "Emergency", "Critical Care"]
  },
  {
    id: "23",
    question: "What are the expected findings in a normal full-term newborn?",
    answer: "Vital signs: HR 120-160, RR 30-60, Temp 97.7-99.5°F\nMottled skin, acrocyanosis, vernix caseosa, lanugo\nGrasp, rooting, sucking, and Moro reflexes present",
    category: "Pediatrics",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Newborn", "Assessment", "Pediatrics"]
  },
  {
    id: "24",
    question: "What is the difference between atelectasis and pneumothorax?",
    answer: "Atelectasis is collapsed or airless lung tissue due to obstruction or compression, while pneumothorax is air in the pleural space causing lung collapse",
    category: "Respiratory",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Respiratory", "Pathophysiology", "Assessment"]
  },
  {
    id: "25",
    question: "What are the stages of chronic kidney disease and the corresponding GFR ranges?",
    answer: "Stage 1: ≥90 mL/min (normal function with kidney damage)\nStage 2: 60-89 mL/min (mild decline)\nStage 3a: 45-59 mL/min (mild to moderate decline)\nStage 3b: 30-44 mL/min (moderate to severe decline)\nStage 4: 15-29 mL/min (severe decline)\nStage 5: <15 mL/min (kidney failure)",
    category: "Renal",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Renal", "Pathophysiology", "Lab Values"]
  },
  {
    id: "26",
    question: "What are the most common adverse effects of chemotherapy?",
    answer: "Myelosuppression (decreased WBCs, platelets, RBCs), nausea and vomiting, mucositis, alopecia, fatigue",
    category: "Oncology",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Oncology", "Medications", "Side Effects"]
  },
  {
    id: "27",
    question: "What infection control precautions should be used for a client with active tuberculosis?",
    answer: "Airborne precautions: Negative pressure room, N95 respirator or PAPR for healthcare workers, patient wears mask when transported",
    category: "Med-Surg",
    difficulty: "medium",
    repetitionLevel: 0,
    tags: ["Infection Control", "Respiratory", "Precautions"]
  },
  {
    id: "28",
    question: "What are the components of Therapeutic Communication?",
    answer: "Active listening, open-ended questions, reflection, clarification, summarization, empathy, and validation",
    category: "Fundamentals",
    difficulty: "easy",
    repetitionLevel: 0,
    tags: ["Communication", "Fundamentals", "Psychiatric"]
  },
  {
    id: "29",
    question: "What are the signs and symptoms of increased intracranial pressure (ICP)?",
    answer: "Early: Headache, nausea/vomiting, visual changes, changes in vital signs\nLate: Cushing's triad (increased systolic BP, widened pulse pressure, bradycardia), decreased level of consciousness, pupillary changes, posturing",
    category: "Neurology",
    difficulty: "hard",
    repetitionLevel: 0,
    tags: ["Neurology", "Assessment", "Critical Care"]
  },
  {
    id: "30",
    question: "What safety measures should be implemented for a client at risk for falls?",
    answer: "Bed in lowest position, call light within reach, non-slip footwear, clear pathways, frequent rounds, assist with ambulation, fall risk identification, bed alarms if appropriate",
    category: "Fundamentals",
    difficulty: "easy",
    repetitionLevel: 0,
    tags: ["Safety", "Fundamentals", "Patient Care"]
  }
];