import fs from 'fs';

// Read the JSON files
const mainQuestions = JSON.parse(fs.readFileSync('./published/questions.json', 'utf-8'));
const importedQuestions = JSON.parse(fs.readFileSync('./published/imported_questions.json', 'utf-8'));
const newQuestions = JSON.parse(fs.readFileSync('./published/new_questions.json', 'utf-8'));
const oncologyQuestions = JSON.parse(fs.readFileSync('./published/oncology_questions.json', 'utf-8'));

// Function to deduplicate questions by title
function deduplicateQuestions(questionsList) {
  const seenTitles = new Set();
  return questionsList.filter(question => {
    const key = `${question.title}-${question.text.substring(0, 50)}`;
    if (seenTitles.has(key)) {
      return false;
    }
    seenTitles.add(key);
    return true;
  });
}

// Get all questions from each file
const allQuestions = [
  ...mainQuestions.questions,
  ...importedQuestions.questions,
  ...newQuestions.questions,
  ...oncologyQuestions
];

// Deduplicate questions
const uniqueQuestions = deduplicateQuestions(allQuestions);

// Sort by specialty/title
uniqueQuestions.sort((a, b) => {
  // First sort by specialty categories
  const specialtyOrder = {
    'Fundamentals': 1,
    'Maternity': 2,
    'Pediatric': 3,
    'Mental Health': 4,
    'Cardiovascular': 5,
    'Medical-Surgical': 6,
    'Pharmacology': 7,
    'Oncology': 8
  };
  
  const titleA = a.title.split(' ')[0];
  const titleB = b.title.split(' ')[0];
  
  const orderA = specialtyOrder[titleA] || 100;
  const orderB = specialtyOrder[titleB] || 100;
  
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  
  // If same specialty, sort by title
  return a.title.localeCompare(b.title);
});

// Reassign IDs to ensure they are sequential
uniqueQuestions.forEach((question, index) => {
  question.id = index + 1;
});

// Create the final combined structure
const combinedQuestions = {
  questions: uniqueQuestions
};

// Write to new file
fs.writeFileSync('./published/all_questions.json', JSON.stringify(combinedQuestions, null, 2));

console.log(`Combined ${uniqueQuestions.length} unique questions into published/all_questions.json`);