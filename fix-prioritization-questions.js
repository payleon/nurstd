/**
 * Script to fix the structure of prioritization questions in the question bank
 * to match the required schema (convert options to items)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsFilePath = path.join(__dirname, 'published', 'all_questions.json');

function fixPrioritizationQuestions() {
  try {
    // Read the questions file
    const questionsData = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));
    const questions = questionsData.questions;
    
    console.log(`Total questions before fix: ${questions.length}`);
    
    // Count question types before the fix
    const initialTypeCounts = {};
    questions.forEach(q => {
      initialTypeCounts[q.type] = (initialTypeCounts[q.type] || 0) + 1;
    });
    
    console.log("\nInitial question type distribution:");
    Object.entries(initialTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`${type}: ${count} questions`);
      });
    
    // Fix prioritization questions
    let fixedCount = 0;
    questions.forEach(question => {
      if (question.type === "ordered-response") {
        if (question.options && !question.items) {
          // Convert options to items
          question.items = question.options.map(option => ({
            id: option.id,
            text: option.text
          }));
          
          // Remove the options property
          delete question.options;
          
          fixedCount++;
        }
      }
    });
    
    console.log(`\nFixed ${fixedCount} prioritization questions`);
    
    // Save the updated questions back to the file
    fs.writeFileSync(
      questionsFilePath,
      JSON.stringify({ questions: questions }, null, 2),
      'utf8'
    );
    
    console.log('Successfully updated all prioritization questions to match the schema.');
  } catch (error) {
    console.error('Error fixing prioritization questions:', error);
  }
}

// Run the function
fixPrioritizationQuestions();