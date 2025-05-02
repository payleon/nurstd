/**
 * Script to add complex SATA (Select All That Apply) and case study questions to the question bank
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

// Main function to add complex questions
function addComplexSataQuestions() {
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
      sata: 8,        // Select All That Apply
      caseStudy: 8    // Case Studies
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
      
      // Add case study questions
      for (let i = 0; i < questionTypeCounts.caseStudy; i++) {
        const newQuestion = createCaseStudyQuestion(category, [...existingIds, ...newQuestions.map(q => q.id)]);
        newQuestions.push(newQuestion);
        console.log(`  Added case study question: ${newQuestion.title}`);
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
addComplexSataQuestions();