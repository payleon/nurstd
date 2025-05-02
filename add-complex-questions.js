/**
 * Script to add complex question types to the question bank
 * 
 * This script adds advanced question types including:
 * - SATA (Select All That Apply)
 * - Case-based scenarios
 * - Prioritization questions
 * - Exhibit/Chart-based questions
 * - Ordered Response (drag and drop) questions
 * 
 * These complex questions better simulate the actual NCLEX exam format.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the questions file
const questionsFilePath = path.join(__dirname, 'published', 'all_questions.json');

// Generate a unique ID for new questions
function generateUniqueId(existingIds) {
  let newId = Math.floor(Math.random() * 100000) + 10000;
  while (existingIds.includes(newId)) {
    newId = Math.floor(Math.random() * 100000) + 10000;
  }
  return newId;
}

// Create a SATA (Select All That Apply) question
function createSataQuestion(category, existingIds) {
  const sataTemplates = [
    {
      title: `${category} - Select All That Apply`,
      text: `A patient is admitted with ${category === 'Cardiovascular' ? 'acute myocardial infarction' : 
        category === 'Respiratory' ? 'acute respiratory distress syndrome' :
        category === 'Maternity' ? 'preeclampsia' :
        category === 'Pediatric' ? 'severe dehydration' :
        category === 'Mental Health' ? 'acute psychosis' :
        category === 'Pharmacology' ? 'anticoagulant therapy complications' :
        'multiple complex symptoms'}. Select all nursing interventions that are appropriate for this patient.`,
      choices: [
        { id: "A", text: "Monitor vital signs every 2 hours", correct: true },
        { id: "B", text: "Administer pain medication as prescribed", correct: true },
        { id: "C", text: "Restrict all oral intake", correct: false },
        { id: "D", text: "Discharge the patient with home care instructions", correct: false },
        { id: "E", text: "Assess for complications regularly", correct: true },
        { id: "F", text: "Delay notifying the healthcare provider until symptoms worsen", correct: false },
        { id: "G", text: "Document all assessments and interventions", correct: true }
      ],
      rationale: `This question assesses your ability to identify multiple appropriate interventions for a patient with a serious condition. Monitoring vital signs (A), administering prescribed pain medication (B), assessing for complications (E), and documentation (G) are all essential nursing interventions. Restricting all oral intake (C) may not be appropriate without a specific order, discharging the patient (D) is premature, and delaying notification (F) could endanger the patient.`
    },
    {
      title: `${category} - Complex Assessment`,
      text: `A nurse is performing an assessment on a patient with ${category === 'Cardiovascular' ? 'heart failure' : 
        category === 'Respiratory' ? 'chronic obstructive pulmonary disease' :
        category === 'Maternity' ? 'gestational diabetes' :
        category === 'Pediatric' ? 'suspected child abuse' :
        category === 'Mental Health' ? 'major depression with suicidal ideation' :
        category === 'Pharmacology' ? 'multiple drug interactions' :
        'a complex health history'}. Select all assessment findings that would require immediate intervention.`,
      choices: [
        { id: "A", text: "Blood pressure of 180/110 mmHg", correct: true },
        { id: "B", text: "Respiratory rate of 28 breaths per minute", correct: true },
        { id: "C", text: "Temperature of 37.2°C (99.0°F)", correct: false },
        { id: "D", text: "Oxygen saturation of 88%", correct: true },
        { id: "E", text: "Heart rate of 72 beats per minute", correct: false },
        { id: "F", text: "Capillary refill of 4 seconds", correct: true },
        { id: "G", text: "Alert and oriented to person, place, and time", correct: false }
      ],
      rationale: `This question tests your ability to identify critical assessment findings. Hypertension (A), tachypnea (B), hypoxemia (D), and delayed capillary refill (F) all require immediate intervention. A normal temperature (C), normal heart rate (E), and normal mental status (G) do not require immediate intervention, though they should continue to be monitored.`
    },
    {
      title: `${category} - Medication Administration`,
      text: `A nurse is preparing to administer multiple medications to a patient with ${category === 'Cardiovascular' ? 'hypertension and heart failure' : 
        category === 'Respiratory' ? 'asthma and pneumonia' :
        category === 'Maternity' ? 'preterm labor' :
        category === 'Pediatric' ? 'bacterial meningitis' :
        category === 'Mental Health' ? 'bipolar disorder' :
        category === 'Pharmacology' ? 'multiple chronic conditions' :
        'complex medical conditions'}. Select all appropriate nursing actions.`,
      choices: [
        { id: "A", text: "Check for drug allergies before administration", correct: true },
        { id: "B", text: "Verify drug interactions", correct: true },
        { id: "C", text: "Administer medications without checking patient identification", correct: false },
        { id: "D", text: "Assess vital signs before and after administration as appropriate", correct: true },
        { id: "E", text: "Document administration after all medications are given", correct: true },
        { id: "F", text: "Delegate medication administration to unlicensed personnel", correct: false },
        { id: "G", text: "Ensure proper medication storage", correct: true }
      ],
      rationale: `This question evaluates knowledge of safe medication administration practices. Checking allergies (A), verifying interactions (B), assessing vital signs (D), proper documentation (E), and ensuring proper storage (G) are all appropriate nursing actions. Administering medication without checking ID (C) violates a fundamental safety principle, and delegation of medication administration to unlicensed personnel (F) is inappropriate in most settings.`
    }
  ];

  const template = sataTemplates[Math.floor(Math.random() * sataTemplates.length)];
  const correctAnswers = template.choices.filter(choice => choice.correct).map(choice => choice.id);
  
  // Remove the 'correct' property from choices before saving
  const choicesForSaving = template.choices.map(({ id, text }) => ({ id, text }));
  
  return {
    id: generateUniqueId(existingIds),
    title: template.title,
    type: "sata",
    text: template.text,
    choices: choicesForSaving,
    correctAnswer: correctAnswers,
    rationale: template.rationale,
    category: category
  };
}

// Create a prioritization (ordered response) question
function createPrioritizationQuestion(category, existingIds) {
  const prioritizationTemplates = [
    {
      title: `${category} - Nursing Prioritization`,
      text: `A nurse is caring for multiple patients on a busy medical unit. Place the following nursing actions in order of priority.`,
      options: [
        { id: "A", text: `Administer scheduled antibiotics to a patient with ${category === 'Respiratory' ? 'pneumonia' : 'an infection'}.` },
        { id: "B", text: `Assess a patient who ${category === 'Cardiovascular' ? 'is complaining of new-onset chest pain' : 
          category === 'Respiratory' ? 'has increased work of breathing and oxygen saturation of 88%' :
          category === 'Maternity' ? 'is 8 cm dilated and having contractions every 2 minutes' :
          category === 'Pediatric' ? 'is having a seizure' :
          category === 'Mental Health' ? 'is expressing suicidal thoughts' :
          'is showing signs of clinical deterioration'}.` },
        { id: "C", text: "Document nursing interventions from the previous shift." },
        { id: "D", text: `Prepare a patient for ${category === 'Cardiovascular' ? 'an echocardiogram' : 
          category === 'Respiratory' ? 'a bronchoscopy' :
          category === 'Maternity' ? 'a non-stress test' :
          category === 'Pediatric' ? 'an MRI' :
          category === 'Mental Health' ? 'a family therapy session' :
          'a diagnostic procedure'}.` },
        { id: "E", text: "Change the bed linens for a patient who had an incontinent episode." }
      ],
      correctOrder: ["B", "A", "E", "D", "C"],
      rationale: `This question tests your ability to prioritize nursing care using the ABC (Airway, Breathing, Circulation) and Maslow's hierarchy principles. The patient with clinical deterioration (B) requires immediate assessment (life-threatening). Administering antibiotics (A) is time-sensitive for infection control. Addressing the incontinent episode (E) relates to immediate comfort and dignity needs. Preparing for a diagnostic procedure (D) is important but can wait. Documentation (C), while necessary, is the lowest priority when compared to direct patient care needs.`
    },
    {
      title: `${category} - Emergency Response`,
      text: `A nurse responds to an emergency situation for a patient with ${category === 'Cardiovascular' ? 'cardiac arrest' : 
        category === 'Respiratory' ? 'respiratory failure' :
        category === 'Maternity' ? 'postpartum hemorrhage' :
        category === 'Pediatric' ? 'anaphylactic shock' :
        category === 'Mental Health' ? 'acute violent behavior' :
        'a life-threatening condition'}. Arrange the following interventions in the correct sequence.`,
      options: [
        { id: "A", text: "Document the interventions and outcomes." },
        { id: "B", text: "Activate the emergency response system." },
        { id: "C", text: "Assess the patient's condition." },
        { id: "D", text: "Implement appropriate interventions based on assessment findings." },
        { id: "E", text: "Communicate with the healthcare team about the situation." }
      ],
      correctOrder: ["C", "B", "D", "E", "A"],
      rationale: `In an emergency, the nurse should first quickly assess the patient (C) to determine the nature of the emergency. After confirming an emergency exists, activating the emergency response system (B) is crucial to get help. The nurse then begins appropriate interventions (D) based on their assessment. Effective communication with the healthcare team (E) ensures coordinated care. Documentation (A), while important, is completed after the immediate emergency is addressed.`
    },
    {
      title: `${category} - Discharge Planning`,
      text: `A nurse is preparing a patient with ${category === 'Cardiovascular' ? 'heart failure' : 
        category === 'Respiratory' ? 'COPD' :
        category === 'Maternity' ? 'a cesarean delivery' :
        category === 'Pediatric' ? 'newly diagnosed diabetes' :
        category === 'Mental Health' ? 'major depression' :
        'a chronic condition'} for discharge. Arrange the discharge planning steps in the correct sequence.`,
      options: [
        { id: "A", text: "Provide written discharge instructions." },
        { id: "B", text: "Assess the patient's understanding of self-care requirements." },
        { id: "C", text: "Coordinate follow-up appointments and services." },
        { id: "D", text: "Reconcile medications and provide a medication schedule." },
        { id: "E", text: "Evaluate the home environment and support system." }
      ],
      correctOrder: ["E", "B", "D", "C", "A"],
      rationale: `Effective discharge planning follows a logical sequence. First, the nurse evaluates the home environment and support system (E) to identify potential challenges. Next, the nurse assesses the patient's understanding of self-care (B) to determine educational needs. Medication reconciliation (D) ensures the patient leaves with a clear medication plan. Coordinating follow-up (C) ensures continuity of care. Finally, providing written instructions (A) gives the patient a reference after discharge.`
    }
  ];
  
  const template = prioritizationTemplates[Math.floor(Math.random() * prioritizationTemplates.length)];
  
  return {
    id: generateUniqueId(existingIds),
    title: template.title,
    type: "ordered-response",
    text: template.text,
    options: template.options,
    correctOrder: template.correctOrder,
    rationale: template.rationale,
    category: category
  };
}

// Create a case study question
function createCaseStudyQuestion(category, existingIds) {
  const caseStudyTemplates = [
    {
      title: `${category} - Case Scenario`,
      scenario: `A 68-year-old patient with a history of ${category === 'Cardiovascular' ? 'hypertension, coronary artery disease, and heart failure' : 
        category === 'Respiratory' ? 'COPD, smoking, and recurrent pneumonia' :
        category === 'Maternity' ? 'gestational diabetes, pre-eclampsia in a previous pregnancy' :
        category === 'Pediatric' ? 'asthma, frequent ear infections' :
        category === 'Mental Health' ? 'bipolar disorder, previous suicide attempt' :
        category === 'Pharmacology' ? 'polypharmacy, medication non-adherence' :
        'multiple chronic conditions'} is admitted to the hospital. The patient presents with ${
        category === 'Cardiovascular' ? 'chest pain, shortness of breath, and lower extremity edema' : 
        category === 'Respiratory' ? 'increased work of breathing, productive cough, and fever' :
        category === 'Maternity' ? 'elevated blood pressure, headache, and visual disturbances at 34 weeks gestation' :
        category === 'Pediatric' ? 'wheezing, retractions, and decreased oxygen saturation' :
        category === 'Mental Health' ? 'manic behavior, decreased sleep, and grandiose thinking' :
        category === 'Pharmacology' ? 'confusion, dizziness, and recent falls' :
        'concerning symptoms requiring immediate attention'
      }. Vital signs: HR 112, BP 158/94, RR 24, Temp 38.1°C (100.6°F), O2 sat 92% on room air.`,
      question: `Based on this patient's presentation, what should be the nurse's primary concern?`,
      choices: [
        { id: "A", text: `${category === 'Cardiovascular' ? 'Acute exacerbation of heart failure' : 
          category === 'Respiratory' ? 'Respiratory insufficiency' :
          category === 'Maternity' ? 'Development of eclampsia' :
          category === 'Pediatric' ? 'Respiratory distress' :
          category === 'Mental Health' ? 'Risk for harm to self or others' :
          category === 'Pharmacology' ? 'Adverse drug reaction' :
          'Clinical deterioration'}`},
        { id: "B", text: "Nutritional deficit" },
        { id: "C", text: "Social isolation" },
        { id: "D", text: "Knowledge deficit about the condition" }
      ],
      correctAnswer: "A",
      rationale: `This case study tests your ability to identify the priority concern in a complex patient scenario. The patient's presenting symptoms and vital signs strongly suggest ${
        category === 'Cardiovascular' ? 'an acute cardiac issue, specifically heart failure exacerbation (A). The elevated heart rate, hypertension, and respiratory symptoms all support this conclusion.' : 
        category === 'Respiratory' ? 'respiratory insufficiency (A). The increased respiratory rate, fever, and decreased oxygen saturation indicate potential respiratory compromise that requires immediate attention.' :
        category === 'Maternity' ? 'development of eclampsia (A), which is a life-threatening complication of pre-eclampsia. The elevated blood pressure, headache, and visual changes are classic warning signs.' :
        category === 'Pediatric' ? 'respiratory distress (A), which is evidenced by the wheezing, retractions, and decreased oxygen saturation. This requires immediate intervention to prevent further deterioration.' :
        category === 'Mental Health' ? 'a risk for harm (A) due to the manic behavior. The patient history of a previous suicide attempt makes safety the primary concern.' :
        category === 'Pharmacology' ? 'an adverse drug reaction (A), as suggested by the confusion, dizziness, and falls in a patient with a history of polypharmacy.' :
        'clinical deterioration (A), which is evidenced by the abnormal vital signs and symptoms.'
      } While the other concerns (B, C, D) may need to be addressed later, they are not the priority in this acute situation.`
    },
    {
      title: `${category} - Complex Patient Management`,
      scenario: `A registered nurse is assigned to care for a patient who was admitted yesterday with ${
        category === 'Cardiovascular' ? 'acute myocardial infarction and underwent emergency coronary angioplasty with stent placement' : 
        category === 'Respiratory' ? 'acute respiratory failure secondary to pneumonia, requiring non-invasive ventilation' :
        category === 'Maternity' ? 'preterm labor at 32 weeks gestation, receiving tocolytics and steroids' :
        category === 'Pediatric' ? 'diabetic ketoacidosis, receiving insulin therapy and fluid replacement' :
        category === 'Mental Health' ? 'acute psychosis with paranoid delusions, newly started on antipsychotic medication' :
        category === 'Pharmacology' ? 'a suspected adverse drug reaction causing acute kidney injury' :
        'a serious medical condition requiring specialized care'
      }. During morning assessment, the nurse notes ${
        category === 'Cardiovascular' ? 'new-onset chest pain, diaphoresis, and ST-segment elevation on telemetry' : 
        category === 'Respiratory' ? 'increased work of breathing, decreased oxygen saturation, and new crackles on lung auscultation' :
        category === 'Maternity' ? 'regular contractions every 4 minutes, cervical dilation of 4 cm, and fetal heart rate decelerations' :
        category === 'Pediatric' ? 'altered mental status, Kussmaul respirations, and laboratory values showing worsening acidosis' :
        category === 'Mental Health' ? 'increased agitation, refusal to take medications, and threatening behavior toward staff' :
        category === 'Pharmacology' ? 'decreased urine output, elevated creatinine, and confusion' :
        'signs of clinical deterioration requiring immediate attention'
      }.`,
      question: `What is the most appropriate immediate nursing action?`,
      choices: [
        { id: "A", text: "Continue with routine care and reassess in one hour" },
        { id: "B", text: "Document the findings and wait for the next scheduled physician rounds" },
        { id: "C", text: "Notify the healthcare provider immediately of the change in condition" },
        { id: "D", text: "Ask another nurse to verify the assessment findings" }
      ],
      correctAnswer: "C",
      rationale: `This case tests your clinical judgment in recognizing and responding to a deteriorating patient condition. The nurse should immediately notify the healthcare provider (C) about the significant changes in the patient's condition, which indicate ${
        category === 'Cardiovascular' ? 'possible stent thrombosis or re-infarction that requires urgent medical intervention.' : 
        category === 'Respiratory' ? 'worsening respiratory status that may require adjustment in respiratory support or treatment plan.' :
        category === 'Maternity' ? 'progression of preterm labor despite tocolytic therapy and potential fetal distress.' :
        category === 'Pediatric' ? 'inadequate response to treatment for diabetic ketoacidosis and possible worsening of the condition.' :
        category === 'Mental Health' ? 'an escalation in psychiatric symptoms and a safety risk that requires prompt intervention.' :
        category === 'Pharmacology' ? 'worsening kidney function and complications of acute kidney injury.' :
        'a significant change that could indicate a life-threatening complication.'
      } Continuing routine care (A) or waiting for scheduled rounds (B) would inappropriately delay necessary intervention. While having another nurse verify findings (D) might be appropriate in some circumstances, it should not delay notification of the provider given the severity of the changes.`
    }
  ];
  
  const template = caseStudyTemplates[Math.floor(Math.random() * caseStudyTemplates.length)];
  
  return {
    id: generateUniqueId(existingIds),
    title: template.title,
    type: "mc",
    text: `${template.scenario}\n\n${template.question}`,
    choices: template.choices,
    correctAnswer: template.correctAnswer,
    rationale: template.rationale,
    category: category,
    isCaseStudy: true // Add a flag to identify this as a case study question
  };
}

// Create a chart/exhibit-based question
function createExhibitQuestion(category, existingIds) {
  const labResultsTemplate = {
    title: `${category} - Lab Results Interpretation`,
    text: `Review the following laboratory results for a patient with ${
      category === 'Cardiovascular' ? 'suspected heart failure' : 
      category === 'Respiratory' ? 'community-acquired pneumonia' :
      category === 'Maternity' ? 'pregnancy-induced hypertension' :
      category === 'Pediatric' ? 'suspected meningitis' :
      category === 'Mental Health' ? 'lithium therapy for bipolar disorder' :
      category === 'Pharmacology' ? 'suspected digoxin toxicity' :
      'a complex medical condition'
    }:`,
    exhibitType: "lab-results",
    exhibitData: {
      "Complete Blood Count": [
        { test: "WBC", result: category === 'Respiratory' ? "14.5 x 10³/μL" : "7.8 x 10³/μL", range: "4.5-11.0 x 10³/μL" },
        { test: "RBC", result: "4.2 x 10⁶/μL", range: "4.0-5.5 x 10⁶/μL" },
        { test: "Hemoglobin", result: category === 'Cardiovascular' ? "10.2 g/dL" : "13.8 g/dL", range: "12.0-16.0 g/dL" },
        { test: "Hematocrit", result: category === 'Cardiovascular' ? "31%" : "41%", range: "36-48%" },
        { test: "Platelets", result: "245 x 10³/μL", range: "150-400 x 10³/μL" }
      ],
      "Metabolic Panel": [
        { test: "Sodium", result: "138 mEq/L", range: "135-145 mEq/L" },
        { test: "Potassium", result: category === 'Cardiovascular' ? "5.4 mEq/L" : category === 'Pharmacology' ? "5.6 mEq/L" : "4.0 mEq/L", range: "3.5-5.0 mEq/L" },
        { test: "Chloride", result: "101 mEq/L", range: "98-108 mEq/L" },
        { test: "BUN", result: category === 'Cardiovascular' ? "32 mg/dL" : "15 mg/dL", range: "8-20 mg/dL" },
        { test: "Creatinine", result: category === 'Cardiovascular' ? "1.8 mg/dL" : "0.9 mg/dL", range: "0.6-1.2 mg/dL" },
        { test: "Glucose", result: category === 'Pediatric' ? "156 mg/dL" : "102 mg/dL", range: "70-110 mg/dL" }
      ],
      "Additional Tests": [
        { test: category === 'Cardiovascular' ? "BNP" : category === 'Respiratory' ? "ABG - pH" : category === 'Pharmacology' ? "Digoxin Level" : "CRP", 
          result: category === 'Cardiovascular' ? "850 pg/mL" : category === 'Respiratory' ? "7.32" : category === 'Pharmacology' ? "2.8 ng/mL" : "3.2 mg/L", 
          range: category === 'Cardiovascular' ? "<100 pg/mL" : category === 'Respiratory' ? "7.35-7.45" : category === 'Pharmacology' ? "0.8-2.0 ng/mL" : "<3.0 mg/L" },
        { test: category === 'Cardiovascular' ? "Troponin I" : category === 'Respiratory' ? "ABG - PaO2" : category === 'Pharmacology' ? "Lithium Level" : "ESR", 
          result: category === 'Cardiovascular' ? "0.04 ng/mL" : category === 'Respiratory' ? "68 mmHg" : category === 'Pharmacology' ? "1.5 mmol/L" : "22 mm/hr", 
          range: category === 'Cardiovascular' ? "<0.04 ng/mL" : category === 'Respiratory' ? "80-100 mmHg" : category === 'Pharmacology' ? "0.6-1.2 mmol/L" : "0-20 mm/hr" }
      ]
    },
    questions: [
      {
        id: "q1",
        text: `Based on these laboratory results, which finding is most concerning for this patient with ${
          category === 'Cardiovascular' ? 'suspected heart failure' : 
          category === 'Respiratory' ? 'pneumonia' :
          category === 'Maternity' ? 'pregnancy-induced hypertension' :
          category === 'Pediatric' ? 'suspected meningitis' :
          category === 'Mental Health' ? 'bipolar disorder' :
          category === 'Pharmacology' ? 'possible medication toxicity' :
          'this medical condition'
        }?`,
        choices: [
          { id: "A", text: category === 'Cardiovascular' ? "Elevated BNP" : category === 'Respiratory' ? "Low PaO2" : category === 'Pharmacology' ? "Elevated digoxin level" : "Normal sodium level" },
          { id: "B", text: "Normal platelet count" },
          { id: "C", text: "Slightly elevated glucose" },
          { id: "D", text: category === 'Cardiovascular' ? "Normal troponin I" : category === 'Respiratory' ? "Normal hematocrit" : "Normal white blood cell count" }
        ],
        correctAnswer: "A",
        rationale: `The most concerning finding is ${
          category === 'Cardiovascular' ? "the elevated BNP of 850 pg/mL (A). BNP (Brain Natriuretic Peptide) is a key biomarker for heart failure, and a level this high strongly suggests heart failure. While the elevated potassium, BUN, and creatinine are also concerning, the BNP result most directly relates to the suspected diagnosis." : 
          category === 'Respiratory' ? "the low PaO2 of 68 mmHg (A), which indicates hypoxemia. This finding is consistent with pneumonia and suggests impaired gas exchange that requires intervention. The elevated WBC count supports an infectious process, but the oxygen level is the most immediate concern." :
          category === 'Pharmacology' ? "the elevated digoxin level of 2.8 ng/mL (A), which exceeds the therapeutic range (0.8-2.0 ng/mL) and indicates digoxin toxicity. This is particularly concerning given the elevated potassium level of 5.6 mEq/L, which is often seen with digoxin toxicity and increases the risk of cardiac arrhythmias." :
          "the abnormal laboratory value that most directly relates to the patient's condition, requiring immediate nursing attention. The other options represent either normal values or findings of less clinical significance."
        }`
      }
    ],
    rationale: `This exhibit-based question tests your ability to interpret laboratory data in clinical context. Nurses must be able to recognize significant abnormal values and understand their implications for patient care. ${
      category === 'Cardiovascular' ? "For a patient with suspected heart failure, the markedly elevated BNP, along with elevated BUN and creatinine (suggesting possible kidney dysfunction as a result of poor cardiac output), create a clinical picture consistent with heart failure. The mild anemia may also be related to chronic heart failure." : 
      category === 'Respiratory' ? "For a patient with pneumonia, the low PaO2 and elevated WBC count are classic findings. The low pH suggests respiratory acidosis, which commonly accompanies severe pneumonia as CO2 retention occurs due to impaired gas exchange." :
      category === 'Pharmacology' ? "In this case, the elevated digoxin level is a critical finding that requires immediate intervention to prevent potentially life-threatening arrhythmias. The elevated potassium level increases this risk, as hyperkalemia potentiates digoxin toxicity effects on the heart." :
      "The ability to identify the most clinically significant laboratory abnormalities helps prioritize nursing interventions and communicate effectively with the healthcare team."
    }`
  };

  const ECGInterpretationTemplate = {
    title: `${category} - ECG Interpretation`,
    text: `A patient with ${
      category === 'Cardiovascular' ? 'chest pain and shortness of breath' : 
      'concerning cardiac symptoms'
    } has the following ECG findings:`,
    exhibitType: "diagnostic-results",
    exhibitData: {
      "ECG Results": [
        { finding: "Rate", result: category === 'Cardiovascular' ? "112 bpm" : "88 bpm" },
        { finding: "Rhythm", result: category === 'Cardiovascular' ? "Irregular" : "Regular" },
        { finding: "P Waves", result: category === 'Cardiovascular' ? "Not consistently preceding QRS complexes" : "Normal" },
        { finding: "PR Interval", result: category === 'Cardiovascular' ? "Variable" : "0.16 seconds" },
        { finding: "QRS Duration", result: "0.08 seconds" },
        { finding: "QT Interval", result: "0.42 seconds" },
        { finding: "ST Segment", result: category === 'Cardiovascular' ? "2mm elevation in leads II, III, aVF" : "Normal" },
        { finding: "T Waves", result: category === 'Cardiovascular' ? "Inverted in leads II, III, aVF" : "Normal" },
        { finding: "Other", result: category === 'Cardiovascular' ? "Q waves present in leads II, III, aVF" : "No significant findings" }
      ]
    },
    questions: [
      {
        id: "q1",
        text: `Based on these ECG findings, what is the most likely interpretation?`,
        choices: [
          { id: "A", text: "Normal sinus rhythm" },
          { id: "B", text: "Atrial fibrillation" },
          { id: "C", text: category === 'Cardiovascular' ? "Acute inferior wall myocardial infarction" : "Sinus tachycardia" },
          { id: "D", text: "First-degree AV block" }
        ],
        correctAnswer: category === 'Cardiovascular' ? "C" : "A",
        rationale: category === 'Cardiovascular' ? 
          "The ECG findings demonstrate classic signs of an acute inferior wall myocardial infarction (C): ST-segment elevation in leads II, III, and aVF, which correspond to the inferior wall of the heart, along with T-wave inversion and pathological Q waves in the same leads. Additionally, the irregular rhythm without consistent P waves suggests concurrent atrial fibrillation, but the most critical finding is the STEMI pattern indicating acute myocardial injury requiring immediate intervention." : 
          "The ECG findings are consistent with normal sinus rhythm (A). The heart rate is within normal limits, the rhythm is regular, P waves are normal and properly related to QRS complexes, and all intervals and segments are within normal limits. There is no evidence of conduction abnormalities, ischemia, or arrhythmia."
      }
    ],
    rationale: `This exhibit-based question assesses your ability to interpret ECG findings, a critical skill for nurses in many clinical settings. Recognizing patterns consistent with ${
      category === 'Cardiovascular' ? "acute myocardial infarction is essential for rapid triage and treatment. The inferior wall MI pattern (ST elevation in II, III, aVF) represents a life-threatening condition requiring immediate intervention, including possible cardiac catheterization. The concurrent irregular rhythm suggests atrial fibrillation, which is common in acute cardiac events and may complicate management." : 
      "various cardiac conditions allows nurses to communicate effectively with the healthcare team and anticipate appropriate interventions. In this case, correctly identifying normal sinus rhythm prevents unnecessary interventions while demonstrating competence in ECG interpretation."
    }`
  };

  const medicationChartTemplate = {
    title: `${category} - Medication Administration Record`,
    text: `Review the following Medication Administration Record (MAR) for a patient with ${
      category === 'Cardiovascular' ? 'heart failure and hypertension' : 
      category === 'Respiratory' ? 'COPD and pneumonia' :
      category === 'Maternity' ? 'pregnancy-induced hypertension' :
      category === 'Pediatric' ? 'asthma and acute bronchitis' :
      category === 'Mental Health' ? 'schizophrenia' :
      category === 'Pharmacology' ? 'multiple chronic conditions' :
      'chronic medical conditions'
    }:`,
    exhibitType: "medication-chart",
    exhibitData: {
      "Regular Medications": [
        { 
          medication: category === 'Cardiovascular' ? "Lisinopril" : category === 'Respiratory' ? "Albuterol" : category === 'Maternity' ? "Methyldopa" : category === 'Pediatric' ? "Albuterol" : category === 'Mental Health' ? "Risperidone" : "Metformin", 
          dose: category === 'Cardiovascular' ? "20 mg" : category === 'Respiratory' ? "2 puffs" : category === 'Maternity' ? "250 mg" : category === 'Pediatric' ? "2 puffs" : category === 'Mental Health' ? "2 mg" : "1000 mg", 
          route: category === 'Respiratory' || category === 'Pediatric' ? "Inhalation" : "PO", 
          frequency: category === 'Respiratory' || category === 'Pediatric' ? "Q4H PRN" : "BID", 
          lastAdministered: "06/15/2023 0900"
        },
        { 
          medication: category === 'Cardiovascular' ? "Furosemide" : category === 'Respiratory' ? "Prednisone" : category === 'Maternity' ? "Labetalol" : category === 'Pediatric' ? "Amoxicillin" : category === 'Mental Health' ? "Lorazepam" : "Atorvastatin", 
          dose: category === 'Cardiovascular' ? "40 mg" : category === 'Respiratory' ? "40 mg" : category === 'Maternity' ? "200 mg" : category === 'Pediatric' ? "400 mg" : category === 'Mental Health' ? "1 mg" : "40 mg", 
          route: "PO", 
          frequency: category === 'Mental Health' ? "TID PRN" : "BID", 
          lastAdministered: "06/15/2023 0900"
        },
        { 
          medication: category === 'Cardiovascular' ? "Metoprolol" : category === 'Respiratory' ? "Azithromycin" : category === 'Maternity' ? "Prenatal Vitamin" : category === 'Pediatric' ? "Acetaminophen" : category === 'Mental Health' ? "Haloperidol" : "Levothyroxine", 
          dose: category === 'Cardiovascular' ? "50 mg" : category === 'Respiratory' ? "500 mg" : category === 'Maternity' ? "1 tablet" : category === 'Pediatric' ? "160 mg" : category === 'Mental Health' ? "5 mg" : "88 mcg", 
          route: "PO", 
          frequency: category === 'Respiratory' ? "Daily" : category === 'Pediatric' ? "Q4H PRN" : "BID", 
          lastAdministered: "06/15/2023 0900"
        }
      ],
      "PRN Medications": [
        { 
          medication: category === 'Cardiovascular' ? "Nitroglycerin" : category === 'Respiratory' ? "Ipratropium" : category === 'Maternity' ? "Acetaminophen" : category === 'Pediatric' ? "Ibuprofen" : category === 'Mental Health' ? "Diazepam" : "Acetaminophen", 
          dose: category === 'Cardiovascular' ? "0.4 mg" : category === 'Respiratory' ? "2 puffs" : category === 'Maternity' ? "650 mg" : category === 'Pediatric' ? "200 mg" : category === 'Mental Health' ? "5 mg" : "650 mg", 
          route: category === 'Cardiovascular' ? "SL" : category === 'Respiratory' ? "Inhalation" : "PO", 
          frequency: "Q4H PRN", 
          lastAdministered: "06/15/2023 0600"
        },
        { 
          medication: category === 'Cardiovascular' ? "Morphine" : category === 'Respiratory' ? "Guaifenesin" : category === 'Maternity' ? "Ondansetron" : category === 'Pediatric' ? "Diphenhydramine" : category === 'Mental Health' ? "Benztropine" : "Tramadol", 
          dose: category === 'Cardiovascular' ? "2 mg" : category === 'Respiratory' ? "200 mg" : category === 'Maternity' ? "4 mg" : category === 'Pediatric' ? "12.5 mg" : category === 'Mental Health' ? "1 mg" : "50 mg", 
          route: category === 'Cardiovascular' ? "IV" : "PO", 
          frequency: "Q4H PRN", 
          lastAdministered: "06/14/2023 2200"
        }
      ],
      "New Orders": [
        { 
          medication: category === 'Cardiovascular' ? "Digoxin" : category === 'Respiratory' ? "Methylprednisolone" : category === 'Maternity' ? "Magnesium Sulfate" : category === 'Pediatric' ? "Prednisolone" : category === 'Mental Health' ? "Clozapine" : "Pantoprazole", 
          dose: category === 'Cardiovascular' ? "0.25 mg" : category === 'Respiratory' ? "125 mg" : category === 'Maternity' ? "4 g" : category === 'Pediatric' ? "15 mg" : category === 'Mental Health' ? "25 mg" : "40 mg", 
          route: category === 'Cardiovascular' ? "PO" : category === 'Respiratory' ? "IV" : category === 'Maternity' ? "IV" : "PO", 
          frequency: category === 'Cardiovascular' ? "Daily" : category === 'Respiratory' ? "Q6H" : category === 'Maternity' ? "Once, then 1 g/hr" : category === 'Pediatric' ? "BID" : category === 'Mental Health' ? "Daily" : "Daily", 
          orderDate: "06/15/2023 1000"
        }
      ]
    },
    questions: [
      {
        id: "q1",
        text: `Based on this medication record, which medication requires the nurse's immediate attention?`,
        choices: [
          { id: "A", text: category === 'Cardiovascular' ? "Lisinopril" : category === 'Respiratory' ? "Albuterol" : category === 'Maternity' ? "Methyldopa" : category === 'Pediatric' ? "Albuterol" : category === 'Mental Health' ? "Risperidone" : "Metformin" },
          { id: "B", text: category === 'Cardiovascular' ? "Furosemide" : category === 'Respiratory' ? "Prednisone" : category === 'Maternity' ? "Labetalol" : category === 'Pediatric' ? "Amoxicillin" : category === 'Mental Health' ? "Lorazepam" : "Atorvastatin" },
          { id: "C", text: category === 'Cardiovascular' ? "Digoxin" : category === 'Respiratory' ? "Methylprednisolone" : category === 'Maternity' ? "Magnesium Sulfate" : category === 'Pediatric' ? "Prednisolone" : category === 'Mental Health' ? "Clozapine" : "Pantoprazole" },
          { id: "D", text: category === 'Cardiovascular' ? "Metoprolol" : category === 'Respiratory' ? "Azithromycin" : category === 'Maternity' ? "Prenatal Vitamin" : category === 'Pediatric' ? "Acetaminophen" : category === 'Mental Health' ? "Haloperidol" : "Levothyroxine" }
        ],
        correctAnswer: "C",
        rationale: `The newly ordered medication ${
          category === 'Cardiovascular' ? "Digoxin (C) requires immediate attention. Digoxin has a narrow therapeutic index, requires careful monitoring (including checking pulse rate and potentially digoxin levels), and can have dangerous interactions with other medications the patient is taking, such as furosemide which can cause electrolyte disturbances that potentiate digoxin toxicity." : 
          category === 'Respiratory' ? "Methylprednisolone (C) requires immediate attention. This is a high-dose IV steroid that was just ordered, likely for acute respiratory deterioration. Given the patient's existing steroid therapy (oral prednisone), the nurse must ensure proper timing, consider potential cumulative effects, and monitor for adverse reactions to high-dose steroids." :
          category === 'Maternity' ? "Magnesium Sulfate (C) requires immediate attention. This medication is used for severe preeclampsia or eclampsia and requires careful administration and monitoring. The order includes a loading dose followed by a continuous infusion, and magnesium toxicity can lead to respiratory depression and cardiac arrest, necessitating close monitoring of reflexes, respiratory status, and urinary output." :
          category === 'Pediatric' ? "Prednisolone (C) requires immediate attention. This is a newly ordered steroid for a pediatric patient, requiring careful dosing based on weight. Additionally, the nurse should assess for potential drug interactions with the child's existing medications and ensure proper education for administration." :
          category === 'Mental Health' ? "Clozapine (C) requires immediate attention. Clozapine is an atypical antipsychotic with significant risks including agranulocytosis, seizures, and myocarditis. It requires regular blood monitoring and careful titration, especially when initiating therapy." :
          "the newly ordered medication (C) requires immediate attention for proper initial administration, patient education, and monitoring for therapeutic effects and potential adverse reactions."
        }`
      }
    ],
    rationale: `This exhibit-based question tests your ability to analyze a medication administration record (MAR) and identify nursing priorities. When reviewing a MAR, nurses must consider newly ordered medications, potential drug interactions, medications with narrow therapeutic indices, and medications requiring special monitoring. ${
      category === 'Cardiovascular' ? "Digoxin is a medication that requires careful consideration due to its potential for toxicity, especially in patients with heart failure who may have changing renal function and electrolyte status. The nurse must verify appropriate dosing, check for contraindications, and establish baseline assessment parameters for monitoring." : 
      category === 'Respiratory' ? "High-dose IV corticosteroids like methylprednisolone require immediate nursing attention to ensure proper administration, monitoring for adverse effects, and coordination with existing steroid therapy to prevent complications. The timing of administration is also important for optimal therapeutic effect in respiratory conditions." :
      category === 'Maternity' ? "Magnesium sulfate is a high-alert medication used in obstetrics that requires specific protocols for administration, continuous monitoring, and preparedness for managing potential toxicity. The nurse must implement safety measures including assessment of deep tendon reflexes, respiratory rate, and maintaining calcium gluconate at the bedside as an antidote." :
      "Prioritizing attention to newly ordered medications, especially those with specific administration requirements or monitoring needs, is a critical nursing responsibility for patient safety."
    }`
  };

  // Choose a template based on the category
  let template;
  if (category === 'Cardiovascular') {
    // For cardiovascular, use the ECG template half the time
    template = Math.random() > 0.5 ? ECGInterpretationTemplate : (Math.random() > 0.5 ? labResultsTemplate : medicationChartTemplate);
  } else if (category === 'Pharmacology') {
    // For pharmacology, prioritize the medication chart
    template = Math.random() > 0.7 ? labResultsTemplate : medicationChartTemplate;
  } else {
    // For other categories, choose randomly between lab results and medication chart
    template = Math.random() > 0.5 ? labResultsTemplate : medicationChartTemplate;
  }
  
  return {
    id: generateUniqueId(existingIds),
    title: template.title,
    type: "chart-exhibit",
    text: template.text,
    exhibitType: template.exhibitType,
    exhibitData: template.exhibitData,
    questions: template.questions,
    rationale: template.rationale,
    category: category
  };
}

// Create a hotspot question (anatomical marker)
function createHotspotQuestion(category, existingIds) {
  const hotspotTemplates = [
    {
      title: `${category} - Anatomical Identification`,
      text: `Identify the areas on this ${
        category === 'Cardiovascular' ? 'heart diagram' : 
        category === 'Respiratory' ? 'lung illustration' :
        category === 'Maternity' ? 'fetal development diagram' :
        category === 'Pediatric' ? 'pediatric assessment' :
        category === 'Mental Health' ? 'brain anatomy' :
        'anatomical diagram'
      } that are associated with ${
        category === 'Cardiovascular' ? 'myocardial infarction.' : 
        category === 'Respiratory' ? 'pneumonia in the right lower lobe.' :
        category === 'Maternity' ? 'common sites for fetal heart rate monitoring.' :
        category === 'Pediatric' ? 'assessment of respiratory distress.' :
        category === 'Mental Health' ? 'major depression.' :
        'the condition being assessed.'
      }`,
      imageUrl: `/images/${
        category === 'Cardiovascular' ? 'heart-anatomy.jpg' : 
        category === 'Respiratory' ? 'lung-anatomy.jpg' :
        category === 'Maternity' ? 'fetal-positions.jpg' :
        category === 'Pediatric' ? 'pediatric-assessment.jpg' :
        category === 'Mental Health' ? 'brain-anatomy.jpg' :
        'anatomical-diagram.jpg'
      }`,
      areas: [
        { 
          id: "area1", 
          coords: [100, 150, 30], 
          label: category === 'Cardiovascular' ? 'Left ventricle' : 
                 category === 'Respiratory' ? 'Right lower lobe' :
                 category === 'Maternity' ? 'Optimal position for external monitoring' :
                 category === 'Pediatric' ? 'Subcostal retractions' :
                 category === 'Mental Health' ? 'Prefrontal cortex' :
                 'Area 1' 
        },
        { 
          id: "area2", 
          coords: [200, 120, 25], 
          label: category === 'Cardiovascular' ? 'Left anterior descending artery' : 
                 category === 'Respiratory' ? 'Right middle lobe' :
                 category === 'Maternity' ? 'Secondary position for monitoring' :
                 category === 'Pediatric' ? 'Intercostal retractions' :
                 category === 'Mental Health' ? 'Amygdala' :
                 'Area 2' 
        },
        { 
          id: "area3", 
          coords: [150, 200, 35], 
          label: category === 'Cardiovascular' ? 'Right coronary artery' : 
                 category === 'Respiratory' ? 'Left lower lobe' :
                 category === 'Maternity' ? 'Suboptimal monitoring position' :
                 category === 'Pediatric' ? 'Nasal flaring' :
                 category === 'Mental Health' ? 'Hippocampus' :
                 'Area 3' 
        },
        { 
          id: "area4", 
          coords: [90, 90, 20], 
          label: category === 'Cardiovascular' ? 'Right atrium' : 
                 category === 'Respiratory' ? 'Right upper lobe' :
                 category === 'Maternity' ? 'Alternative monitoring position' :
                 category === 'Pediatric' ? 'Accessory muscle use' :
                 category === 'Mental Health' ? 'Thalamus' :
                 'Area 4' 
        }
      ],
      correctAreas: [
        { 
          id: category === 'Cardiovascular' ? 'area1' : 
             category === 'Respiratory' ? 'area1' :
             category === 'Maternity' ? 'area1' :
             category === 'Pediatric' ? 'area2' :
             category === 'Mental Health' ? 'area1' :
             'area1' 
        },
        { 
          id: category === 'Cardiovascular' ? 'area2' : 
             category === 'Respiratory' ? 'area4' :
             category === 'Maternity' ? 'area2' :
             category === 'Pediatric' ? 'area3' :
             category === 'Mental Health' ? 'area2' :
             'area2' 
        }
      ],
      rationale: `This hotspot question tests your ability to identify anatomical structures and relate them to clinical conditions. ${
        category === 'Cardiovascular' ? 'In myocardial infarction, the most common areas affected are the left ventricle (area1) and the region supplied by the left anterior descending artery (area2). The left ventricle is particularly vulnerable due to its high oxygen demand, and the left anterior descending artery supplies a large portion of the left ventricle, making occlusion of this vessel especially dangerous, often called the "widow-maker" lesion.' : 
        category === 'Respiratory' ? 'For right lower lobe pneumonia, you would select the right lower lobe (area1) which is a common site for pneumonia due to gravity-dependent pooling of secretions. The right upper lobe (area4) could also be affected in aspiration pneumonia when the patient is in a recumbent position.' :
        category === 'Maternity' ? 'The optimal position for external fetal monitoring (area1) is where the fetal back is against the maternal abdomen, providing the strongest heart sounds. The secondary position (area2) is used when the primary position doesn\'t yield adequate tracings.' :
        category === 'Pediatric' ? 'In pediatric respiratory distress, intercostal retractions (area2) and nasal flaring (area3) are key assessment findings. These signs indicate increased work of breathing and are critical to identify for timely intervention.' :
        category === 'Mental Health' ? 'Research has shown that the prefrontal cortex (area1) and amygdala (area2) show altered function and structure in major depression. The prefrontal cortex is involved in executive function and emotional regulation, while the amygdala plays a key role in processing emotions, particularly fear and anxiety.' :
        'The correct areas represent the anatomical regions most relevant to the clinical condition described.'
      }`
    }
  ];
  
  const template = hotspotTemplates[Math.floor(Math.random() * hotspotTemplates.length)];
  
  return {
    id: generateUniqueId(existingIds),
    title: template.title,
    type: "hotspot",
    text: template.text,
    imageUrl: template.imageUrl,
    areas: template.areas,
    correctAreas: template.correctAreas,
    rationale: template.rationale,
    category: category
  };
}

// Main function to add complex questions
function addComplexQuestions() {
  try {
    // Read the existing questions file
    const questionsData = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));
    const existingQuestions = questionsData.questions;
    
    // Get existing IDs to avoid duplicates
    const existingIds = existingQuestions.map(q => q.id);
    
    // Define categories to add complex questions for
    const categories = [
      'Fundamentals',
      'Medical-Surgical',
      'Cardiovascular',
      'Respiratory',
      'Maternity',
      'Pediatric',
      'Mental Health',
      'Pharmacology',
      'Leadership'
    ];
    
    // Determine how many of each question type to add per category
    const questionTypeCounts = {
      sata: 5,         // Select All That Apply
      prioritization: 3, // Prioritization/Ordered Response
      caseStudy: 5,    // Case Studies
      exhibit: 3,      // Chart/Exhibit
      hotspot: 2       // Hotspot/Image
    };
    
    let newQuestions = [];
    
    // Generate complex questions for each category
    categories.forEach(category => {
      console.log(`Adding complex questions for ${category} category...`);
      
      // Add SATA questions
      for (let i = 0; i < questionTypeCounts.sata; i++) {
        const newQuestion = createSataQuestion(category, [...existingIds, ...newQuestions.map(q => q.id)]);
        newQuestions.push(newQuestion);
        console.log(`  Added SATA question: ${newQuestion.title}`);
      }
      
      // Add prioritization questions
      for (let i = 0; i < questionTypeCounts.prioritization; i++) {
        const newQuestion = createPrioritizationQuestion(category, [...existingIds, ...newQuestions.map(q => q.id)]);
        newQuestions.push(newQuestion);
        console.log(`  Added prioritization question: ${newQuestion.title}`);
      }
      
      // Add case study questions
      for (let i = 0; i < questionTypeCounts.caseStudy; i++) {
        const newQuestion = createCaseStudyQuestion(category, [...existingIds, ...newQuestions.map(q => q.id)]);
        newQuestions.push(newQuestion);
        console.log(`  Added case study question: ${newQuestion.title}`);
      }
      
      // Add exhibit questions
      for (let i = 0; i < questionTypeCounts.exhibit; i++) {
        const newQuestion = createExhibitQuestion(category, [...existingIds, ...newQuestions.map(q => q.id)]);
        newQuestions.push(newQuestion);
        console.log(`  Added exhibit question: ${newQuestion.title}`);
      }
      
      // Add hotspot questions
      for (let i = 0; i < questionTypeCounts.hotspot; i++) {
        const newQuestion = createHotspotQuestion(category, [...existingIds, ...newQuestions.map(q => q.id)]);
        newQuestions.push(newQuestion);
        console.log(`  Added hotspot question: ${newQuestion.title}`);
      }
    });
    
    // Count questions per type before adding new ones
    const initialTypeCounts = {};
    existingQuestions.forEach(q => {
      initialTypeCounts[q.type] = (initialTypeCounts[q.type] || 0) + 1;
    });
    
    console.log("\nInitial question type distribution:");
    Object.entries(initialTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`${type}: ${count} questions`);
      });
    
    // Add all new questions
    const updatedQuestions = [...existingQuestions, ...newQuestions];
    
    // Save the updated questions back to the file
    fs.writeFileSync(
      questionsFilePath,
      JSON.stringify({ questions: updatedQuestions }, null, 2),
      'utf8'
    );
    
    // Count questions per type after adding new ones
    const updatedTypeCounts = {};
    updatedQuestions.forEach(q => {
      updatedTypeCounts[q.type] = (updatedTypeCounts[q.type] || 0) + 1;
    });
    
    console.log(`\nAdded a total of ${newQuestions.length} new complex questions.`);
    console.log("\nUpdated question type distribution:");
    Object.entries(updatedTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        const added = count - (initialTypeCounts[type] || 0);
        console.log(`${type}: ${count} questions (${added > 0 ? '+' + added : added} new)`);
      });
    
    console.log('\nComplex questions added successfully.');
  } catch (error) {
    console.error('Error adding complex questions:', error);
  }
}

// Run the main function
addComplexQuestions();