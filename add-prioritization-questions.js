/**
 * Script to add prioritization (ordered response) questions to the question bank
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
    },
    {
      title: `${category} - Clinical Procedure`,
      text: `A nurse is performing ${category === 'Cardiovascular' ? 'a 12-lead ECG' : 
        category === 'Respiratory' ? 'endotracheal suctioning' :
        category === 'Maternity' ? 'fetal monitoring setup' :
        category === 'Pediatric' ? 'an intravenous insertion on a child' :
        category === 'Mental Health' ? 'a suicide risk assessment' :
        'a complex clinical procedure'}. Arrange the steps in the correct order.`,
      options: [
        { id: "A", text: "Explain the procedure to the patient." },
        { id: "B", text: "Gather necessary equipment and supplies." },
        { id: "C", text: "Perform hand hygiene and don appropriate PPE." },
        { id: "D", text: "Verify patient identity using two identifiers." },
        { id: "E", text: "Document the procedure and patient response." }
      ],
      correctOrder: ["D", "C", "B", "A", "E"],
      rationale: `When performing any clinical procedure, proper sequence is important for both safety and efficiency. First, verify the correct patient (D) to prevent errors. Next, perform hand hygiene and don PPE (C) to prevent infection transmission. Gathering equipment (B) before starting ensures the procedure won't be interrupted. Explaining the procedure (A) immediately before performing it reduces patient anxiety and promotes cooperation. Documentation (E) is completed after the procedure is finished.`
    },
    {
      title: `${category} - Deteriorating Patient`,
      text: `A nurse notices that a patient with ${category === 'Cardiovascular' ? 'heart failure' : 
        category === 'Respiratory' ? 'pneumonia' :
        category === 'Maternity' ? 'preeclampsia' :
        category === 'Pediatric' ? 'diabetic ketoacidosis' :
        category === 'Mental Health' ? 'delirium' :
        'a serious medical condition'} is showing signs of deterioration. Place the following nursing actions in order of priority.`,
      options: [
        { id: "A", text: "Update the patient's family on the change in condition." },
        { id: "B", text: "Perform a focused assessment of vital signs and symptoms." },
        { id: "C", text: "Notify the healthcare provider of the assessment findings." },
        { id: "D", text: "Implement immediate nursing interventions within your scope of practice." },
        { id: "E", text: "Document the event, interventions, and patient response." }
      ],
      correctOrder: ["B", "D", "C", "A", "E"],
      rationale: `When a patient shows signs of deterioration, rapid assessment and intervention are critical. The nurse should first perform a focused assessment (B) to gather data about the patient's condition. Based on these findings, the nurse should implement immediate interventions within their scope of practice (D), such as administering oxygen or positioning the patient. Notifying the provider (C) with complete assessment data follows these immediate actions. Updating the family (A) is important but comes after clinical stabilization measures. Documentation (E) is necessary but should not delay patient care.`
    }
  ];
  
  const template = prioritizationTemplates[Math.floor(Math.random() * prioritizationTemplates.length)];
  
  return {
    id: generateUniqueId(existingIds),
    title: template.title,
    type: "ordered-response",
    text: template.text,
    items: template.options.map(option => ({
      id: option.id,
      text: option.text
    })),
    correctOrder: template.correctOrder,
    rationale: template.rationale,
    category: category
  };
}

// Main function to add prioritization questions
function addPrioritizationQuestions() {
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
    
    // Number of prioritization questions to add per category
    const questionsPerCategory = 5;
    
    let newQuestions = [];
    
    // Generate prioritization questions for each category
    categories.forEach(category => {
      console.log(`Adding prioritization questions for ${category} category...`);
      
      for (let i = 0; i < questionsPerCategory; i++) {
        const newQuestion = createPrioritizationQuestion(category, [...existingIds, ...newQuestions.map(q => q.id)]);
        newQuestions.push(newQuestion);
        console.log(`  Added prioritization question: ${newQuestion.title}`);
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
    
    console.log(`\nAdded a total of ${newQuestions.length} new prioritization questions.`);
    console.log("\nUpdated question type distribution:");
    Object.entries(updatedTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        const added = count - (initialTypeCounts[type] || 0);
        console.log(`${type}: ${count} questions (${added > 0 ? '+' + added : added} new)`);
      });
    
    console.log('\nPrioritization questions added successfully.');
  } catch (error) {
    console.error('Error adding prioritization questions:', error);
  }
}

// Run the main function
addPrioritizationQuestions();