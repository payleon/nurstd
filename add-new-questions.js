/**
 * Script to add new questions to the existing question bank
 * to ensure each category has sufficient variety.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the questions file
const questionsFilePath = path.join(__dirname, 'published', 'all_questions.json');

// New questions to add for each category
const newQuestions = [
  // Fundamentals category
  {
    "title": "Fundamentals of Nursing",
    "type": "mc",
    "text": "A nurse is assessing a client's vital signs. Which parameter is considered the fifth vital sign?",
    "choices": [
      { "id": "A", "text": "Oxygen saturation" },
      { "id": "B", "text": "Pain level" },
      { "id": "C", "text": "Level of consciousness" },
      { "id": "D", "text": "Pupillary response" }
    ],
    "correctAnswer": "B",
    "rationale": "Pain is often referred to as the 'fifth vital sign' to emphasize its importance in patient assessment along with temperature, pulse, respiration, and blood pressure. Pain assessment is critical for comprehensive care and improved outcomes. Oxygen saturation (A), level of consciousness (C), and pupillary response (D) are important assessments but are not considered vital signs.",
    "category": "Fundamentals"
  },
  {
    "title": "Fundamentals of Nursing",
    "type": "mc",
    "text": "A nurse is caring for multiple patients. Which nursing action requires hand hygiene before AND after the procedure?",
    "choices": [
      { "id": "A", "text": "Documenting in a patient chart" },
      { "id": "B", "text": "Administering oral medications" },
      { "id": "C", "text": "Taking a blood pressure" },
      { "id": "D", "text": "All of the above" }
    ],
    "correctAnswer": "D",
    "rationale": "Hand hygiene should be performed before and after ALL patient interactions and procedures, including documentation (A), administering medications (B), and taking vital signs (C). This is a fundamental infection control practice to prevent the spread of pathogens between patients and healthcare providers.",
    "category": "Fundamentals"
  },
  {
    "title": "Fundamentals of Nursing",
    "type": "mc",
    "text": "A nurse is preparing to transfer a patient from bed to a chair. Which assessment is MOST important before initiating the transfer?",
    "choices": [
      { "id": "A", "text": "The patient's vital signs" },
      { "id": "B", "text": "The patient's weight" },
      { "id": "C", "text": "The patient's ability to bear weight and follow instructions" },
      { "id": "D", "text": "The distance between the bed and chair" }
    ],
    "correctAnswer": "C",
    "rationale": "Assessing the patient's ability to bear weight and follow instructions is critical for safety before attempting a transfer. This determines whether the patient can assist with the transfer and what type of assistance is needed. While vital signs (A), weight (B), and distance (D) are considerations, the patient's physical capability and cognitive status are the most important factors for a safe transfer.",
    "category": "Fundamentals"
  },
  
  // Medical-Surgical category
  {
    "title": "Medical-Surgical Nursing",
    "type": "mc",
    "text": "A patient with chronic kidney disease is receiving hemodialysis. Which assessment finding should the nurse report to the provider immediately?",
    "choices": [
      { "id": "A", "text": "Blood pressure of 160/95 mmHg" },
      { "id": "B", "text": "A weight gain of 1.5 kg since the last dialysis session" },
      { "id": "C", "text": "Potassium level of 6.8 mEq/L" },
      { "id": "D", "text": "Mild itching at the arteriovenous fistula site" }
    ],
    "correctAnswer": "C",
    "rationale": "A potassium level of 6.8 mEq/L indicates severe hyperkalemia, which is a life-threatening condition that can lead to cardiac arrhythmias and requires immediate intervention. While elevated blood pressure (A), weight gain (B), and mild itching (D) are concerning, they are not as immediately life-threatening as severe hyperkalemia.",
    "category": "Medical-Surgical"
  },
  {
    "title": "Medical-Surgical Nursing",
    "type": "mc",
    "text": "A nurse is caring for a patient with cirrhosis who develops ascites. Which nursing intervention would be most appropriate for this patient?",
    "choices": [
      { "id": "A", "text": "Encouraging a high-protein, high-sodium diet" },
      { "id": "B", "text": "Restricting fluids and monitoring daily weights" },
      { "id": "C", "text": "Positioning the patient flat in bed to redistribute fluid" },
      { "id": "D", "text": "Administering prescribed antibiotics every 8 hours" }
    ],
    "correctAnswer": "B",
    "rationale": "For patients with ascites due to cirrhosis, fluid restriction and monitoring daily weights are appropriate interventions to manage fluid accumulation. A high-sodium diet (A) would worsen fluid retention. Positioning flat (C) could increase respiratory distress due to pressure on the diaphragm. Antibiotics (D) are not routinely used for ascites unless there is a specific infection.",
    "category": "Medical-Surgical"
  },
  {
    "title": "Medical-Surgical Nursing",
    "type": "mc",
    "text": "A patient has been prescribed furosemide (Lasix) for heart failure. Which electrolyte should the nurse monitor most closely?",
    "choices": [
      { "id": "A", "text": "Sodium" },
      { "id": "B", "text": "Potassium" },
      { "id": "C", "text": "Calcium" },
      { "id": "D", "text": "Magnesium" }
    ],
    "correctAnswer": "B",
    "rationale": "Furosemide (Lasix) is a loop diuretic that causes increased excretion of potassium, which can lead to hypokalemia. Potassium levels must be monitored closely as hypokalemia can cause cardiac arrhythmias, muscle weakness, and other complications. While furosemide also affects sodium (A), calcium (C), and magnesium (D) levels, potassium depletion is the most common and potentially dangerous electrolyte imbalance.",
    "category": "Medical-Surgical"
  },
  
  // Cardiovascular category
  {
    "title": "Cardiovascular",
    "type": "mc",
    "text": "A patient with acute coronary syndrome is experiencing chest pain. Which medication should the nurse administer first?",
    "choices": [
      { "id": "A", "text": "Metoprolol (Lopressor)" },
      { "id": "B", "text": "Nitroglycerin" },
      { "id": "C", "text": "Morphine sulfate" },
      { "id": "D", "text": "Aspirin" }
    ],
    "correctAnswer": "D",
    "rationale": "Aspirin should be administered first in acute coronary syndrome (ACS) to inhibit platelet aggregation and potentially limit the size of the developing thrombus. The American Heart Association recommends immediate administration of aspirin for patients with suspected ACS. Nitroglycerin (B) relieves pain but doesn't affect outcomes as significantly. Metoprolol (A) and morphine (C) are important but secondary to aspirin.",
    "category": "Cardiovascular"
  },
  {
    "title": "Cardiovascular",
    "type": "mc",
    "text": "A patient with heart failure has been prescribed an ACE inhibitor. Which assessment finding indicates a potential adverse effect of this medication?",
    "choices": [
      { "id": "A", "text": "A productive cough" },
      { "id": "B", "text": "A persistent dry cough" },
      { "id": "C", "text": "Increased urine output" },
      { "id": "D", "text": "Decreased heart rate" }
    ],
    "correctAnswer": "B",
    "rationale": "A persistent dry cough is a common side effect of ACE inhibitors due to the accumulation of bradykinin in the lungs. This side effect may require medication adjustment or change to an ARB. A productive cough (A) suggests an infection rather than a medication side effect. Increased urine output (C) and decreased heart rate (D) are expected therapeutic effects, not adverse effects.",
    "category": "Cardiovascular"
  },
  {
    "title": "Cardiovascular",
    "type": "mc",
    "text": "A nurse is caring for a patient with a diagnosis of unstable angina. Which ECG change would the nurse expect to see during an anginal episode?",
    "choices": [
      { "id": "A", "text": "ST-segment elevation" },
      { "id": "B", "text": "ST-segment depression" },
      { "id": "C", "text": "Presence of Q waves" },
      { "id": "D", "text": "Prolonged PR interval" }
    ],
    "correctAnswer": "B",
    "rationale": "ST-segment depression is the classic ECG finding during an episode of unstable angina, indicating subendocardial ischemia. ST-segment elevation (A) typically indicates myocardial infarction with full-thickness damage. Q waves (C) represent tissue death after MI. Prolonged PR interval (D) is associated with conduction delays, not ischemia.",
    "category": "Cardiovascular"
  },
  
  // Maternity category
  {
    "title": "Maternity Nursing",
    "type": "mc",
    "text": "A nurse is caring for a woman in the first stage of labor. Which finding indicates progression to the active phase?",
    "choices": [
      { "id": "A", "text": "Cervical dilation of 6 cm" },
      { "id": "B", "text": "Effacement of 30%" },
      { "id": "C", "text": "Fetal station at -3" },
      { "id": "D", "text": "Contractions occurring every 15 minutes" }
    ],
    "correctAnswer": "A",
    "rationale": "According to current labor guidelines, the active phase of labor begins at 6 cm dilation. 30% effacement (B) is insufficient for active labor. Station -3 (C) indicates the fetal head is still high in the pelvis. Contractions every 15 minutes (D) are too far apart for active labor, which typically has contractions every 2-3 minutes.",
    "category": "Maternity"
  },
  {
    "title": "Maternity Nursing",
    "type": "mc",
    "text": "A pregnant woman at 34 weeks gestation presents with sudden onset of severe right upper quadrant pain, headache, and visual disturbances. Her blood pressure is 168/110 mmHg. What is the most likely diagnosis?",
    "choices": [
      { "id": "A", "text": "Gestational diabetes" },
      { "id": "B", "text": "Preeclampsia with severe features" },
      { "id": "C", "text": "Placenta previa" },
      { "id": "D", "text": "HELLP syndrome" }
    ],
    "correctAnswer": "B",
    "rationale": "The symptoms of severe right upper quadrant pain (liver involvement), headache, visual disturbances, and severely elevated blood pressure (≥160/110 mmHg) are diagnostic criteria for preeclampsia with severe features. Gestational diabetes (A) presents with glucose intolerance. Placenta previa (C) presents with painless vaginal bleeding. While HELLP syndrome (D) is a complication of preeclampsia, the symptoms described more directly point to preeclampsia with severe features.",
    "category": "Maternity"
  },
  {
    "title": "Maternity Nursing",
    "type": "mc",
    "text": "A nurse is assessing a 1-hour-old newborn. Which finding would require immediate intervention?",
    "choices": [
      { "id": "A", "text": "Acrocyanosis" },
      { "id": "B", "text": "Heart rate of 110 beats per minute" },
      { "id": "C", "text": "Respiratory rate of 68 breaths per minute" },
      { "id": "D", "text": "Central cyanosis" }
    ],
    "correctAnswer": "D",
    "rationale": "Central cyanosis (blue discoloration of the trunk, lips, and mucous membranes) indicates significant hypoxemia and requires immediate intervention. Acrocyanosis (A) is a normal finding in newborns, characterized by bluish extremities with normal core coloration. A heart rate of 110 bpm (B) is within normal range (100-160 bpm). A respiratory rate of 68 breaths per minute (C) is slightly elevated but can be normal in the first hours of life (normal range 40-60).",
    "category": "Maternity"
  },
  
  // Pediatric category
  {
    "title": "Pediatric Nursing",
    "type": "mc",
    "text": "A 4-year-old child is admitted with suspected epiglottitis. Which intervention is the highest priority?",
    "choices": [
      { "id": "A", "text": "Administering IV antibiotics" },
      { "id": "B", "text": "Avoiding agitating the child and inspecting the throat" },
      { "id": "C", "text": "Preparing for immediate intubation" },
      { "id": "D", "text": "Placing the child in a mist tent" }
    ],
    "correctAnswer": "B",
    "rationale": "In suspected epiglottitis, a potentially life-threatening condition, the highest priority is to avoid agitating the child and NOT to inspect the throat, as this could precipitate complete airway obstruction. A controlled environment should be maintained and an airway team should be present before any examination. While intubation (C) may be necessary, it should be done in a controlled setting. Antibiotics (A) and a mist tent (D) are important but secondary to airway management.",
    "category": "Pediatric"
  },
  {
    "title": "Pediatric Nursing",
    "type": "mc",
    "text": "A nurse is administering immunizations to a 6-month-old infant. The parent asks why multiple vaccines are given at once. The nurse's best response is:",
    "choices": [
      { "id": "A", "text": "'It saves time and reduces the number of office visits needed.'" },
      { "id": "B", "text": "'The immune system can respond to millions of antigens at once, so multiple vaccines are safe.'" },
      { "id": "C", "text": "'If we delay vaccines, your child could contract serious diseases during the waiting period.'" },
      { "id": "D", "text": "'All of the above are accurate explanations.'" }
    ],
    "correctAnswer": "D",
    "rationale": "All three statements are accurate explanations for administering multiple vaccines at once. The immune system can effectively respond to multiple antigens simultaneously (B). Combining vaccines reduces the number of visits needed (A), and delaying vaccines leaves children vulnerable to preventable diseases (C). Providing comprehensive education helps address parental concerns about vaccination schedules.",
    "category": "Pediatric"
  },
  {
    "title": "Pediatric Nursing",
    "type": "mc",
    "text": "A 3-year-old child is admitted with suspected intussusception. Which assessment finding is most characteristic of this condition?",
    "choices": [
      { "id": "A", "text": "Projectile vomiting after feeding" },
      { "id": "B", "text": "Currant jelly-like stools" },
      { "id": "C", "text": "Clay-colored stools" },
      { "id": "D", "text": "Severe diarrhea with mucus" }
    ],
    "correctAnswer": "B",
    "rationale": "Currant jelly-like stools (dark red, mucoid stools) are the classic sign of intussusception due to intestinal bleeding and mucus production where one segment of bowel telescopes into another. Projectile vomiting (A) is more characteristic of pyloric stenosis. Clay-colored stools (C) suggest biliary obstruction. Severe diarrhea with mucus (D) is more typical of infectious gastroenteritis.",
    "category": "Pediatric"
  },
  
  // Mental Health category
  {
    "title": "Mental Health Nursing",
    "type": "mc",
    "text": "A patient diagnosed with major depressive disorder has been prescribed sertraline (Zoloft). The nurse should inform the patient that:",
    "choices": [
      { "id": "A", "text": "The medication will start working immediately to improve mood" },
      { "id": "B", "text": "The full therapeutic effect may take 2-4 weeks" },
      { "id": "C", "text": "The medication should be discontinued once symptoms improve" },
      { "id": "D", "text": "Alcohol consumption will enhance the medication's effectiveness" }
    ],
    "correctAnswer": "B",
    "rationale": "SSRIs like sertraline (Zoloft) typically take 2-4 weeks to reach full therapeutic effect, although some side effects and initial changes may occur sooner. It's important for patients to continue taking the medication even if they don't feel immediate improvement. SSRIs do not work immediately (A), should not be discontinued when symptoms improve without provider guidance (C), and alcohol should be avoided as it can worsen depression and interact with the medication (D).",
    "category": "Mental Health"
  },
  {
    "title": "Mental Health Nursing",
    "type": "mc",
    "text": "A nurse is assessing a patient who states, 'The CIA has implanted a chip in my brain to monitor my thoughts.' This statement most likely indicates:",
    "choices": [
      { "id": "A", "text": "Illusion" },
      { "id": "B", "text": "Delusion" },
      { "id": "C", "text": "Hallucination" },
      { "id": "D", "text": "Flight of ideas" }
    ],
    "correctAnswer": "B",
    "rationale": "This statement represents a delusion, which is a fixed, false belief that cannot be corrected by reasoning and is not consistent with the person's cultural background. Specifically, this is a persecutory delusion involving beliefs about being monitored or targeted. An illusion (A) is a misperception of a real external stimulus. A hallucination (C) involves perception without external stimuli. Flight of ideas (D) refers to rapid shifting between topics in conversation.",
    "category": "Mental Health"
  },
  {
    "title": "Mental Health Nursing",
    "type": "mc",
    "text": "A patient with bipolar disorder is prescribed lithium carbonate. Which laboratory value is most important for the nurse to monitor?",
    "choices": [
      { "id": "A", "text": "Hemoglobin A1C" },
      { "id": "B", "text": "Serum lithium level" },
      { "id": "C", "text": "Total cholesterol" },
      { "id": "D", "text": "Prothrombin time" }
    ],
    "correctAnswer": "B",
    "rationale": "Serum lithium levels must be closely monitored due to lithium's narrow therapeutic index. Toxic levels can develop quickly and cause serious adverse effects including tremors, ataxia, confusion, seizures, coma, and death. The therapeutic range is 0.6-1.2 mEq/L, with toxicity often occurring above 1.5 mEq/L. Hemoglobin A1C (A), total cholesterol (C), and prothrombin time (D) are not directly relevant to lithium therapy.",
    "category": "Mental Health"
  },
  
  // Pharmacology category
  {
    "title": "Pharmacology",
    "type": "mc",
    "text": "A nurse is administering warfarin to a patient. Which food should the nurse instruct the patient to consume in consistent amounts to maintain stable anticoagulation?",
    "choices": [
      { "id": "A", "text": "Foods high in vitamin K such as green leafy vegetables" },
      { "id": "B", "text": "Foods high in calcium such as dairy products" },
      { "id": "C", "text": "Foods high in protein such as meat and fish" },
      { "id": "D", "text": "Foods high in carbohydrates such as bread and pasta" }
    ],
    "correctAnswer": "A",
    "rationale": "Foods high in vitamin K (green leafy vegetables like spinach, kale, and collard greens) affect warfarin's anticoagulant activity because vitamin K is required for clotting factor synthesis. Patients shouldn't avoid these foods but should maintain consistent intake to allow for proper medication dosage adjustment. Calcium (B), protein (C), and carbohydrates (D) don't significantly affect warfarin activity.",
    "category": "Pharmacology"
  },
  {
    "title": "Pharmacology",
    "type": "mc",
    "text": "A nurse is administering insulin to a patient with diabetes. Which type of insulin has the most rapid onset of action?",
    "choices": [
      { "id": "A", "text": "NPH insulin" },
      { "id": "B", "text": "Regular insulin" },
      { "id": "C", "text": "Insulin glargine (Lantus)" },
      { "id": "D", "text": "Insulin aspart (NovoLog)" }
    ],
    "correctAnswer": "D",
    "rationale": "Insulin aspart (NovoLog) is a rapid-acting insulin analog with onset of action within 10-20 minutes, peak action in 1-3 hours, and duration of 3-5 hours. NPH insulin (A) is intermediate-acting. Regular insulin (B) is short-acting but slower than analogs like aspart. Insulin glargine (C) is a long-acting insulin designed to provide steady levels without peaks.",
    "category": "Pharmacology"
  },
  {
    "title": "Pharmacology",
    "type": "mc",
    "text": "A patient is receiving gentamicin, an aminoglycoside antibiotic. Which adverse effect should the nurse monitor for most closely?",
    "choices": [
      { "id": "A", "text": "Hepatotoxicity" },
      { "id": "B", "text": "Nephrotoxicity" },
      { "id": "C", "text": "Thrombocytopenia" },
      { "id": "D", "text": "Pulmonary fibrosis" }
    ],
    "correctAnswer": "B",
    "rationale": "Nephrotoxicity (kidney damage) is a major dose-limiting adverse effect of aminoglycoside antibiotics like gentamicin. Close monitoring of renal function, including BUN, creatinine, and urine output, is essential. Ototoxicity (hearing loss) is also a concern but wasn't an option. Aminoglycosides are not strongly associated with hepatotoxicity (A), thrombocytopenia (C), or pulmonary fibrosis (D).",
    "category": "Pharmacology"
  },
  
  // Leadership category
  {
    "title": "Leadership & Management",
    "type": "mc",
    "text": "A charge nurse is assigning staff for the upcoming shift. Which principle should guide the assignment decisions?",
    "choices": [
      { "id": "A", "text": "Giving the most experienced staff the most complex patients" },
      { "id": "B", "text": "Assigning based on staff preferences to increase job satisfaction" },
      { "id": "C", "text": "Matching patient needs with staff competencies and experience" },
      { "id": "D", "text": "Rotating difficult patient assignments equally among all staff" }
    ],
    "correctAnswer": "C",
    "rationale": "The primary consideration in making assignments should be matching patient needs with staff competencies and experience to ensure safe, quality care. While experienced staff may handle complex patients better (A), this isn't always the optimal approach. Staff preferences (B) and equal rotation of difficult assignments (D) are secondary considerations that may affect staff satisfaction but shouldn't override patient safety and appropriate skill matching.",
    "category": "Leadership"
  },
  {
    "title": "Leadership & Management",
    "type": "mc",
    "text": "A nurse observes a colleague making a medication error but not reporting it. What is the nurse's best initial action?",
    "choices": [
      { "id": "A", "text": "Report the colleague directly to the state board of nursing" },
      { "id": "B", "text": "Discuss the situation privately with the colleague and encourage self-reporting" },
      { "id": "C", "text": "Inform the colleague's friends on the unit to encourage peer pressure" },
      { "id": "D", "text": "Document the error in the patient's chart without consulting the colleague" }
    ],
    "correctAnswer": "B",
    "rationale": "The best initial action is to discuss the situation privately with the colleague and encourage self-reporting. This approach promotes a culture of safety, preserves the therapeutic relationship, and gives the colleague an opportunity to take responsibility. If the colleague refuses to report, the observing nurse would then need to report the error through appropriate channels. Reporting directly to the board of nursing (A) is premature. Involving other staff members (C) is unprofessional. Documenting without consultation (D) bypasses important communication.",
    "category": "Leadership"
  }
];

try {
  // Read the existing questions file
  const questionsData = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));
  
  // Find the highest existing question ID
  let maxId = 0;
  questionsData.questions.forEach(q => {
    if (q.id > maxId) maxId = q.id;
  });
  
  // Assign new IDs to the new questions
  const newQuestionsWithIds = newQuestions.map((q, index) => ({
    ...q,
    id: maxId + index + 1
  }));
  
  // Add new questions to the existing questions
  const updatedQuestions = [
    ...questionsData.questions,
    ...newQuestionsWithIds
  ];
  
  // Save the updated questions back to the file
  fs.writeFileSync(
    questionsFilePath,
    JSON.stringify({ questions: updatedQuestions }, null, 2),
    'utf8'
  );
  
  console.log(`Added ${newQuestions.length} new questions.`);
  
  // Count and display the distribution of categories
  const categoryCounts = {};
  updatedQuestions.forEach(q => {
    const category = q.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  console.log('\nUpdated category distribution:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} questions`);
    });
} catch (error) {
  console.error('Error updating questions:', error);
}
