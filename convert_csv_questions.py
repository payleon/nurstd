import csv
import json
import ast
import os
from collections import defaultdict

def convert_csv_to_json(csv_file_path):
    print(f"Reading CSV file from: {csv_file_path}")
    
    questions_by_category = defaultdict(list)
    question_id_counter = 1000  # Starting ID for new questions
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
            reader = csv.DictReader(csv_file)
            
            for row in reader:
                if not row['id'] or not row['stem']:
                    continue  # Skip incomplete rows
                
                # For question IDs, use the provided ID or increment our counter
                try:
                    q_id = int(row['id'])
                except (ValueError, TypeError):
                    q_id = question_id_counter
                    question_id_counter += 1
                
                # Parse options from string to list of dicts
                options = []
                try:
                    if row['options']:
                        options = ast.literal_eval(row['options'])
                except (SyntaxError, ValueError):
                    # Handle case where options might not be properly formatted
                    print(f"Warning: Could not parse options for question {q_id}")
                
                # Determine question type
                q_type = row['type'].lower() if row['type'] else 'mc'
                if q_type == 'multiple-choice':
                    q_type = 'mc'
                elif q_type == 'multiple-select':
                    q_type = 'sata'
                
                # Parse correct answer
                correct_answer = row['correct_answer']
                if q_type == 'sata':
                    try:
                        correct_answer = ast.literal_eval(correct_answer)
                    except (SyntaxError, ValueError):
                        correct_answer = []
                        print(f"Warning: Could not parse correct answer for SATA question {q_id}")
                
                # Create question object
                question = {
                    "id": q_id,
                    "title": row['sub_category'] if row['sub_category'] else "Nursing Question",
                    "type": q_type,
                    "text": row['stem'],
                    "choices": options,
                    "correctAnswer": correct_answer,
                    "rationale": row['explanation'],
                    "category": row['category'].lower() if row['category'] else "mixed",
                    "subcategory": row['sub_category'].lower() if row['sub_category'] else "general",
                    "difficulty": row['difficulty'].lower() if row['difficulty'] else "medium"
                }
                
                # Add to appropriate category based on category field and subcategory
                category = row['category'].lower() if row['category'] else "mixed"
                subcategory = row['sub_category'].lower() if row['sub_category'] else ""
                
                # Get the question text for better categorization
                question_text = row['stem'].lower() if row['stem'] else ""
                
                # Categorize questions more specifically by analyzing both metadata and question content
                if any(term in question_text or term in category or term in subcategory for term in 
                      ["cardiac", "cardiovascular", "heart", "ekg", "ecg", "myocardial", "angina", "pacemaker", 
                       "arrhythmia", "dysrhythmia", "atrial", "ventricular", "stroke", "tachycardia", "bradycardia"]):
                    questions_by_category["cardiac"].append(question)
                    
                elif any(term in question_text or term in category or term in subcategory for term in
                        ["maternal", "obstetric", "pregnancy", "labor", "birth", "delivery", "postpartum", 
                         "prenatal", "antepartum", "neonate", "newborn", "fetal", "breast", "lactation"]):
                    questions_by_category["maternal"].append(question)
                    
                elif any(term in question_text or term in category or term in subcategory for term in
                        ["musculoskeletal", "orthopedic", "bone", "fracture", "joint", "cast", "splint", 
                         "traction", "amputation", "arthritis", "osteoporosis", "muscle", "mobility"]):
                    questions_by_category["musculoskeletal"].append(question)
                    
                elif any(term in question_text or term in category or term in subcategory for term in
                        ["emergency", "critical", "trauma", "cpr", "code", "resuscitation", "arrest", 
                         "hemorrhage", "bleeding", "shock", "intracranial", "pressure", "icu", "intensive care"]):
                    # Emergency questions are added to the cardiac emergency exam
                    questions_by_category["cardiac"].append(question)
                    
                elif category == "safe-and-effective-care" or any(term in question_text or term in category or term in subcategory for term in
                          ["fundamental", "basic", "hygiene", "safety", "infection", "standard", "precaution", 
                           "delegation", "documentation", "ethics", "legal", "confidentiality", "patient rights"]):
                    questions_by_category["fundamentals"].append(question)
                    
                else:
                    # Add to mixed for general questions
                    questions_by_category["mixed"].append(question)
                
    except Exception as e:
        print(f"Error processing CSV: {e}")
        return
    
    # Save questions to different JSON files by category
    output_path = "published"
    os.makedirs(output_path, exist_ok=True)
    
    # Map our categories to the exam file names
    category_to_file = {
        "cardiac": "cardiac_emergency_exam.json",  # Use the cardiac_emergency_exam.json file
        "maternal": "maternal_nursing_exam.json",
        "fundamentals": "fundamentals_nursing_exam.json",
        "musculoskeletal": "musculoskeletal_exam.json",
        "mixed": "mixed_nclex_practice.json"
    }
    
    for category, questions in questions_by_category.items():
        if not questions:
            continue
            
        # Get the appropriate file name
        file_name = category_to_file.get(category, f"{category}_exam.json")
        output_file = os.path.join(output_path, file_name)
        
        try:
            # Check if file exists already
            existing_questions = []
            if os.path.exists(output_file):
                with open(output_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    existing_questions = data.get('questions', [])
                    
            # Add new questions to existing ones, checking for duplicate IDs
            existing_ids = set(q['id'] for q in existing_questions)
            unique_new_questions = [q for q in questions if q['id'] not in existing_ids]
            
            # Combine existing and new questions
            all_questions = existing_questions + unique_new_questions
            
            # Write back to file
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"questions": all_questions}, f, indent=2)
            
            print(f"Added {len(unique_new_questions)} questions to {file_name}")
            
        except Exception as e:
            print(f"Error writing to {output_file}: {e}")

if __name__ == "__main__":
    convert_csv_to_json("attached_assets/questions_export.csv")
    print("Conversion complete!")