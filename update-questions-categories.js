/**
 * Script to update all questions in all_questions.json with proper category fields
 * based on their titles.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the mapping from titles to categories
const titleToCategoryMap = {
  'Fundamentals': 'Fundamentals',
  'Medication': 'Fundamentals',
  'Infection Control': 'Fundamentals',
  'Nursing Care': 'Fundamentals',
  'Holistic': 'Fundamentals',
  'Community Health': 'Fundamentals',
  'Leadership & Management': 'Leadership',
  'Cardiovascular': 'Cardiovascular',
  'Cardiac': 'Cardiovascular',
  'Angina': 'Cardiovascular',
  'Hypertension': 'Cardiovascular',
  'Blood Transfusion': 'Cardiovascular',
  'Medical-Surgical': 'Medical-Surgical',
  'Neurological': 'Medical-Surgical',
  'Intracranial': 'Medical-Surgical',
  'Thyroid': 'Medical-Surgical',
  'Immune': 'Medical-Surgical',
  'Musculoskeletal': 'Medical-Surgical',
  'Wound': 'Medical-Surgical',
  'COPD': 'Medical-Surgical',
  'Respiratory': 'Medical-Surgical',
  'Oxygen': 'Medical-Surgical',
  'Fluid Volume': 'Medical-Surgical',
  'Dehydration': 'Medical-Surgical',
  'Catheter': 'Medical-Surgical',
  'Tube': 'Medical-Surgical',
  'Nasogastric': 'Medical-Surgical',
  'NG Tube': 'Medical-Surgical',
  'Pain': 'Medical-Surgical',
  'Anxiety': 'Mental Health',
  'Mental Health': 'Mental Health',
  'Seizure': 'Neurological',
  'Maternity': 'Maternity',
  'Postpartum': 'Maternity',
  'Pediatric': 'Pediatric',
  'Pharmacology': 'Pharmacology'
};

// Load the questions file
const questionsFilePath = path.join(__dirname, 'published', 'all_questions.json');

const determineCategory = (title) => {
  // Convert title to lowercase for case-insensitive matching
  const lowerTitle = title.toLowerCase();
  
  // Try to find a matching category
  for (const [keyword, category] of Object.entries(titleToCategoryMap)) {
    if (lowerTitle.includes(keyword.toLowerCase())) {
      return category;
    }
  }
  
  // Default to the title itself if no match is found
  return 'Fundamentals'; // Default category
};

try {
  // Read the file
  const questionsData = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));
  
  // Update each question to include a category based on its title
  const updatedQuestions = questionsData.questions.map(question => {
    if (!question.category) {
      question.category = determineCategory(question.title);
    }
    return question;
  });
  
  // Save the updated questions back to the file
  fs.writeFileSync(
    questionsFilePath,
    JSON.stringify({ questions: updatedQuestions }, null, 2),
    'utf8'
  );
  
  console.log(`Updated ${updatedQuestions.length} questions with categories.`);
  
  // Count and display the distribution of categories
  const categoryCounts = {};
  updatedQuestions.forEach(q => {
    const category = q.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  console.log('\nCategory distribution:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} questions`);
    });
} catch (error) {
  console.error('Error updating questions:', error);
}
