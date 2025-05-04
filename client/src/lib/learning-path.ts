import { v4 as uuidv4 } from 'uuid';
import { StudyArea } from '@/hooks/useStudyProgress';

// Define types for learning path
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type TimeCommitment = 'minimal' | 'moderate' | 'intensive';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearningPreferences {
  learningStyle: LearningStyle;
  timeCommitment: TimeCommitment;
  difficulty: DifficultyLevel;
  focusAreas: string[];
  excludedAreas?: string[];
  daysUntilExam?: number;
}

export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  resourceType: string; // video, article, practice, quiz, etc.
  difficulty: string; // beginner, intermediate, advanced
  url?: string;
  completed: boolean;
}

export interface LearningPathSection {
  id: string;
  title: string;
  description: string;
  area: string;
  nodes: LearningPathNode[];
  completed: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  learningStyle: LearningStyle;
  timeCommitment: TimeCommitment;
  difficulty: DifficultyLevel;
  estimatedCompletionWeeks: number;
  progress: number;
  sections: LearningPathSection[];
}

// Constants for path generation
const HOURS_PER_WEEK: Record<TimeCommitment, number> = {
  minimal: 4,
  moderate: 7,
  intensive: 12
};

const DIFFICULTY_BOOST: Record<DifficultyLevel, number> = {
  beginner: 0.8,
  intermediate: 1.0,
  advanced: 1.3
};

// Resource repository - organized by nursing area
const RESOURCE_REPOSITORY: {
  [key: string]: Array<Omit<LearningPathNode, 'id' | 'completed'>>
} = {
  fundamentals: [
    {
      title: 'Fundamental Nursing Concepts Overview',
      description: 'A comprehensive overview of the foundational concepts in nursing practice',
      estimatedTime: 45,
      resourceType: 'video',
      difficulty: 'beginner',
      url: 'https://www.example.com/nursing-concepts'
    },
    {
      title: 'Essential Nursing Skills',
      description: 'Learn the essential clinical skills every nurse needs to master',
      estimatedTime: 60,
      resourceType: 'interactive',
      difficulty: 'beginner',
      url: 'https://www.example.com/essential-skills'
    },
    {
      title: 'Evidence-Based Nursing Practice',
      description: 'Understanding how to apply research findings to nursing care',
      estimatedTime: 45,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/evidence-based-practice'
    },
    {
      title: 'Nursing Process & Critical Thinking',
      description: 'Master the 5-step nursing process and develop critical thinking skills',
      estimatedTime: 60,
      resourceType: 'interactive',
      difficulty: 'intermediate',
      url: 'https://www.example.com/nursing-process'
    },
    {
      title: 'Documentation & Information Management',
      description: 'Learn proper documentation techniques and information management',
      estimatedTime: 30,
      resourceType: 'article',
      difficulty: 'beginner',
      url: 'https://www.example.com/documentation'
    },
    {
      title: 'Fundamentals NCLEX Practice Quiz',
      description: 'Test your knowledge of nursing fundamentals with practice questions',
      estimatedTime: 30,
      resourceType: 'quiz',
      difficulty: 'intermediate'
    },
    {
      title: 'Advanced Nursing Concepts Flashcards',
      description: 'Review advanced nursing concepts using spaced repetition',
      estimatedTime: 20,
      resourceType: 'flashcard',
      difficulty: 'advanced'
    }
  ],
  pharmacology: [
    {
      title: 'Pharmacology Basics for NCLEX',
      description: 'Learn the essential medication classes, mechanisms, and nursing considerations',
      estimatedTime: 60,
      resourceType: 'video',
      difficulty: 'beginner',
      url: 'https://www.example.com/pharmacology-basics'
    },
    {
      title: 'Medication Calculation Practice',
      description: 'Practice common medication calculations and dosage problems',
      estimatedTime: 45,
      resourceType: 'practice',
      difficulty: 'intermediate',
      url: 'https://www.example.com/med-calc'
    },
    {
      title: 'High-Alert Medications Review',
      description: 'In-depth review of high-alert medications and safety protocols',
      estimatedTime: 50,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/high-alert-meds'
    },
    {
      title: 'Pharmacokinetics & Pharmacodynamics',
      description: 'Understanding how drugs move through and affect the body',
      estimatedTime: 55,
      resourceType: 'video',
      difficulty: 'advanced',
      url: 'https://www.example.com/pk-pd'
    },
    {
      title: 'Drug Interactions & Adverse Effects',
      description: 'Learn to identify and manage common drug interactions and adverse effects',
      estimatedTime: 40,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/drug-interactions'
    },
    {
      title: 'Pharmacology Practice Questions',
      description: 'Test your knowledge with NCLEX-style pharmacology questions',
      estimatedTime: 35,
      resourceType: 'quiz',
      difficulty: 'intermediate'
    },
    {
      title: 'Medication Classification Flashcards',
      description: 'Master medication classifications with spaced repetition',
      estimatedTime: 25,
      resourceType: 'flashcard',
      difficulty: 'intermediate'
    }
  ],
  'med-surg': [
    {
      title: 'Medical-Surgical Nursing Overview',
      description: 'Comprehensive overview of medical-surgical nursing concepts',
      estimatedTime: 60,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: 'https://www.example.com/med-surg-overview'
    },
    {
      title: 'Respiratory System Disorders',
      description: 'Assessment, diagnosis, and management of common respiratory conditions',
      estimatedTime: 45,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/respiratory'
    },
    {
      title: 'Cardiovascular Assessment & Care',
      description: 'Learn proper assessment techniques and care plans for cardiac patients',
      estimatedTime: 55,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: 'https://www.example.com/cardiovascular'
    },
    {
      title: 'Endocrine Disorders Case Studies',
      description: 'Work through realistic case studies for patients with endocrine disorders',
      estimatedTime: 50,
      resourceType: 'interactive',
      difficulty: 'advanced',
      url: 'https://www.example.com/endocrine-cases'
    },
    {
      title: 'Gastrointestinal & Hepatic Disorders',
      description: 'Review GI and hepatic disorders commonly tested on NCLEX',
      estimatedTime: 45,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/gi-hepatic'
    },
    {
      title: 'Medical-Surgical NCLEX Practice Quiz',
      description: 'Test your knowledge with med-surg NCLEX-style questions',
      estimatedTime: 40,
      resourceType: 'quiz',
      difficulty: 'advanced'
    },
    {
      title: 'Med-Surg Pathophysiology Flashcards',
      description: 'Review key pathophysiology concepts for medical-surgical nursing',
      estimatedTime: 30,
      resourceType: 'flashcard',
      difficulty: 'advanced'
    }
  ],
  pediatrics: [
    {
      title: 'Pediatric Nursing Essentials',
      description: 'Covers growth and development, assessment, and common pediatric concepts',
      estimatedTime: 50,
      resourceType: 'video',
      difficulty: 'beginner',
      url: 'https://www.example.com/peds-essentials'
    },
    {
      title: 'Pediatric Assessment Techniques',
      description: 'Learn age-specific assessment techniques for pediatric patients',
      estimatedTime: 40,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: 'https://www.example.com/peds-assessment'
    },
    {
      title: 'Common Pediatric Disorders',
      description: 'Review of common disorders and nursing care for pediatric patients',
      estimatedTime: 45,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/peds-disorders'
    },
    {
      title: 'Pediatric Medication Administration',
      description: 'Safe medication administration practices for pediatric patients',
      estimatedTime: 35,
      resourceType: 'interactive',
      difficulty: 'intermediate',
      url: 'https://www.example.com/peds-meds'
    },
    {
      title: 'Family-Centered Pediatric Care',
      description: 'Implementing family-centered care approaches in pediatric nursing',
      estimatedTime: 30,
      resourceType: 'article',
      difficulty: 'beginner',
      url: 'https://www.example.com/family-centered'
    },
    {
      title: 'Pediatric NCLEX Practice Questions',
      description: 'Test your knowledge with pediatric NCLEX-style questions',
      estimatedTime: 35,
      resourceType: 'quiz',
      difficulty: 'intermediate'
    },
    {
      title: 'Pediatric Growth & Development Flashcards',
      description: 'Review age-specific milestones and considerations',
      estimatedTime: 25,
      resourceType: 'flashcard',
      difficulty: 'beginner'
    }
  ],
  obstetrics: [
    {
      title: 'Maternity Nursing Foundations',
      description: 'Essential concepts in maternal and newborn nursing care',
      estimatedTime: 55,
      resourceType: 'video',
      difficulty: 'beginner',
      url: 'https://www.example.com/maternity-foundations'
    },
    {
      title: 'Antepartum, Intrapartum & Postpartum Care',
      description: 'Comprehensive review of nursing care throughout pregnancy and delivery',
      estimatedTime: 60,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/pregnancy-care'
    },
    {
      title: 'High-Risk Pregnancy & Complications',
      description: 'Identify and manage common complications in pregnancy',
      estimatedTime: 50,
      resourceType: 'video',
      difficulty: 'advanced',
      url: 'https://www.example.com/high-risk-pregnancy'
    },
    {
      title: 'Newborn Assessment & Care',
      description: 'Learn proper assessment and care techniques for newborns',
      estimatedTime: 45,
      resourceType: 'interactive',
      difficulty: 'intermediate',
      url: 'https://www.example.com/newborn-care'
    },
    {
      title: 'Maternal-Newborn Medications',
      description: 'Review medications commonly used in obstetric and newborn care',
      estimatedTime: 40,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/ob-medications'
    },
    {
      title: 'OB/Maternity NCLEX Practice Quiz',
      description: 'Test your knowledge with maternity NCLEX-style questions',
      estimatedTime: 35,
      resourceType: 'quiz',
      difficulty: 'intermediate'
    },
    {
      title: 'Labor & Delivery Stages Flashcards',
      description: 'Review the stages of labor and appropriate nursing interventions',
      estimatedTime: 25,
      resourceType: 'flashcard',
      difficulty: 'intermediate'
    }
  ],
  psychiatric: [
    {
      title: 'Psychiatric Nursing Fundamentals',
      description: 'Introduction to concepts in psychiatric and mental health nursing',
      estimatedTime: 50,
      resourceType: 'video',
      difficulty: 'beginner',
      url: 'https://www.example.com/psych-fundamentals'
    },
    {
      title: 'Therapeutic Communication Techniques',
      description: 'Master therapeutic communication skills for psychiatric nursing',
      estimatedTime: 45,
      resourceType: 'interactive',
      difficulty: 'beginner',
      url: 'https://www.example.com/therapeutic-comm'
    },
    {
      title: 'Common Psychiatric Disorders',
      description: 'Review of major psychiatric disorders and nursing interventions',
      estimatedTime: 55,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/psychiatric-disorders'
    },
    {
      title: 'Psychopharmacology for Nurses',
      description: 'Review of psychiatric medications and nursing considerations',
      estimatedTime: 50,
      resourceType: 'video',
      difficulty: 'advanced',
      url: 'https://www.example.com/psychopharmacology'
    },
    {
      title: 'Crisis Intervention & De-escalation',
      description: 'Techniques for crisis management and de-escalation',
      estimatedTime: 40,
      resourceType: 'interactive',
      difficulty: 'intermediate',
      url: 'https://www.example.com/crisis-intervention'
    },
    {
      title: 'Psychiatric NCLEX Practice Questions',
      description: 'Test your knowledge with psychiatric NCLEX-style questions',
      estimatedTime: 35,
      resourceType: 'quiz',
      difficulty: 'intermediate'
    },
    {
      title: 'Mental Health Disorders Flashcards',
      description: 'Review key psychiatric disorders and interventions',
      estimatedTime: 25,
      resourceType: 'flashcard',
      difficulty: 'intermediate'
    }
  ],
  prioritization: [
    {
      title: 'Nursing Prioritization Frameworks',
      description: 'Learn frameworks for prioritizing nursing care and delegating tasks',
      estimatedTime: 45,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: 'https://www.example.com/prioritization'
    },
    {
      title: 'Delegation & Assignment Making',
      description: 'Master the principles of safe and effective delegation',
      estimatedTime: 40,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/delegation'
    },
    {
      title: 'Multiple Patient Prioritization',
      description: 'Practice scenarios involving multiple patients requiring care',
      estimatedTime: 50,
      resourceType: 'interactive',
      difficulty: 'advanced',
      url: 'https://www.example.com/multiple-patients'
    },
    {
      title: 'NCLEX Prioritization Strategies',
      description: 'Strategies for answering prioritization questions on NCLEX',
      estimatedTime: 35,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: 'https://www.example.com/prioritization-strategies'
    },
    {
      title: 'Emergency Care Prioritization',
      description: 'Learn triage and prioritization techniques for emergency situations',
      estimatedTime: 45,
      resourceType: 'article',
      difficulty: 'advanced',
      url: 'https://www.example.com/emergency-prioritization'
    },
    {
      title: 'Prioritization Practice Questions',
      description: 'Test your knowledge with NCLEX-style prioritization questions',
      estimatedTime: 40,
      resourceType: 'quiz',
      difficulty: 'advanced'
    },
    {
      title: 'Delegation Rules Flashcards',
      description: 'Review key delegation principles and rules',
      estimatedTime: 20,
      resourceType: 'flashcard',
      difficulty: 'intermediate'
    }
  ],
  leadership: [
    {
      title: 'Nursing Leadership Fundamentals',
      description: 'Introduction to leadership concepts in nursing practice',
      estimatedTime: 45,
      resourceType: 'video',
      difficulty: 'beginner',
      url: 'https://www.example.com/leadership-fundamentals'
    },
    {
      title: 'Management & Organizational Principles',
      description: 'Nursing management principles and organizational structures',
      estimatedTime: 50,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: 'https://www.example.com/management-principles'
    },
    {
      title: 'Conflict Resolution in Healthcare',
      description: 'Strategies for effectively resolving conflicts in healthcare settings',
      estimatedTime: 40,
      resourceType: 'interactive',
      difficulty: 'intermediate',
      url: 'https://www.example.com/conflict-resolution'
    },
    {
      title: 'Quality Improvement & Patient Safety',
      description: 'Implementing quality improvement initiatives and ensuring patient safety',
      estimatedTime: 55,
      resourceType: 'video',
      difficulty: 'advanced',
      url: 'https://www.example.com/quality-improvement'
    },
    {
      title: 'Healthcare Policy & Legal Issues',
      description: 'Understanding healthcare policy and legal/ethical considerations',
      estimatedTime: 50,
      resourceType: 'article',
      difficulty: 'advanced',
      url: 'https://www.example.com/healthcare-policy'
    },
    {
      title: 'Leadership NCLEX Practice Questions',
      description: 'Test your knowledge with leadership NCLEX-style questions',
      estimatedTime: 35,
      resourceType: 'quiz',
      difficulty: 'intermediate'
    },
    {
      title: 'Leadership & Management Flashcards',
      description: 'Review key leadership concepts and principles',
      estimatedTime: 25,
      resourceType: 'flashcard',
      difficulty: 'intermediate'
    }
  ]
};

// Learning style preference mappings
const PREFERRED_RESOURCE_TYPES: {
  [key in LearningStyle]: string[]
} = {
  visual: ['video', 'interactive'],
  auditory: ['video', 'interactive'],
  reading: ['article', 'flashcard'],
  kinesthetic: ['interactive', 'practice', 'quiz']
};

// Section descriptions
const SECTION_DESCRIPTIONS: {
  [key: string]: string
} = {
  fundamentals: 'Master the essential nursing concepts and skills that form the foundation of nursing practice',
  pharmacology: 'Learn medication classes, calculations, and safety principles essential for nursing care',
  'med-surg': 'Study common medical-surgical conditions, assessments, and interventions for adult patients',
  pediatrics: 'Explore growth and development, assessment techniques, and care for pediatric patients',
  obstetrics: 'Review care for pregnant women, labor and delivery, and newborn care',
  psychiatric: 'Learn about mental health disorders, therapeutic communication, and psychiatric interventions',
  prioritization: 'Develop skills in prioritizing care, delegating tasks, and managing multiple patients',
  leadership: 'Build knowledge in nursing leadership, management principles, and healthcare systems'
};

/**
 * Generates a personalized learning path based on user preferences and study progress
 */
export function generateLearningPath(
  preferences: LearningPreferences,
  studyAreas: Record<string, StudyArea>
): LearningPath {
  const { learningStyle, timeCommitment, difficulty, focusAreas, excludedAreas = [], daysUntilExam } = preferences;
  
  // Create sections for each focus area
  const sections: LearningPathSection[] = [];
  
  // Filter and sort focus areas based on confidence levels
  const sortedFocusAreas = [...focusAreas].sort((a, b) => {
    const aConfidence = studyAreas[a]?.confidenceLevel || 2;
    const bConfidence = studyAreas[b]?.confidenceLevel || 2;
    return aConfidence - bConfidence; // Low confidence first
  });
  
  // Calculate total resources needed based on time commitment
  const hoursPerWeek = HOURS_PER_WEEK[timeCommitment];
  const totalMinutesPerWeek = hoursPerWeek * 60;
  
  // Calculate completion weeks based on focus areas and time commitment
  const estimatedCompletionWeeks = Math.max(
    Math.ceil((sortedFocusAreas.length * 3) / (timeCommitment === 'intensive' ? 2 : timeCommitment === 'moderate' ? 1 : 0.7)),
    daysUntilExam ? Math.ceil(daysUntilExam / 7) : 4
  );
  
  // Calculate resources per area
  let resourcesPerArea = Math.floor(RESOURCE_REPOSITORY[sortedFocusAreas[0]].length * 0.7); // 70% of available resources
  if (difficulty === 'beginner') resourcesPerArea = Math.max(3, resourcesPerArea - 1);
  if (difficulty === 'advanced') resourcesPerArea = Math.min(RESOURCE_REPOSITORY[sortedFocusAreas[0]].length, resourcesPerArea + 1);
  
  // Create learning path sections
  for (const area of sortedFocusAreas) {
    if (excludedAreas.includes(area)) continue;
    
    const availableResources = [...RESOURCE_REPOSITORY[area]];
    
    // Filter resources based on difficulty preference
    let filteredResources = availableResources.filter(resource => 
      resource.difficulty === difficulty || 
      (difficulty === 'intermediate' && resource.difficulty === 'beginner') ||
      (difficulty === 'advanced' && resource.difficulty === 'intermediate')
    );
    
    // If not enough resources match difficulty, add some from other difficulty levels
    if (filteredResources.length < resourcesPerArea) {
      const additionalResources = availableResources
        .filter(resource => !filteredResources.includes(resource))
        .slice(0, resourcesPerArea - filteredResources.length);
      
      filteredResources = [...filteredResources, ...additionalResources];
    }
    
    // Prioritize resources that match learning style preference
    filteredResources.sort((a, b) => {
      const aMatchesStyle = PREFERRED_RESOURCE_TYPES[learningStyle].includes(a.resourceType) ? 1 : 0;
      const bMatchesStyle = PREFERRED_RESOURCE_TYPES[learningStyle].includes(b.resourceType) ? 1 : 0;
      return bMatchesStyle - aMatchesStyle;
    });
    
    // Select resources for this area
    const selectedResources = filteredResources.slice(0, resourcesPerArea);
    
    // Create nodes from selected resources
    const nodes: LearningPathNode[] = selectedResources.map(resource => ({
      id: uuidv4(),
      ...resource,
      completed: false
    }));
    
    // Create section
    sections.push({
      id: uuidv4(),
      title: capitalizeFirstLetter(area),
      description: SECTION_DESCRIPTIONS[area],
      area,
      nodes,
      completed: false
    });
  }
  
  // Generate title and description based on preferences
  const difficultyWords: {
    [key in DifficultyLevel]: string[]
  } = {
    beginner: ['Essential', 'Fundamental', 'Core'],
    intermediate: ['Comprehensive', 'Complete', 'Structured'],
    advanced: ['Advanced', 'In-depth', 'Intensive']
  };
  
  const timeWords: {
    [key in TimeCommitment]: string[]
  } = {
    minimal: ['Concise', 'Focused', 'Efficient'],
    moderate: ['Balanced', 'Strategic', 'Effective'],
    intensive: ['Thorough', 'Rigorous', 'Extensive']
  };
  
  const randomDifficultyWord = difficultyWords[difficulty][Math.floor(Math.random() * difficultyWords[difficulty].length)];
  const randomTimeWord = timeWords[timeCommitment][Math.floor(Math.random() * timeWords[timeCommitment].length)];
  
  // Create the learning path
  const learningPath: LearningPath = {
    id: uuidv4(),
    title: `${randomDifficultyWord} ${randomTimeWord} NCLEX Study Path`,
    description: `A personalized learning path focused on ${sortedFocusAreas.map(area => SECTION_DESCRIPTIONS[area].split(' ')[0]).join(', ')} nursing. Optimized for your ${learningStyle} learning style with a ${timeCommitment} time commitment.`,
    createdAt: new Date(),
    learningStyle,
    timeCommitment,
    difficulty,
    estimatedCompletionWeeks,
    progress: 0,
    sections
  };
  
  return learningPath;
}

/**
 * Updates a learning path's progress based on completed nodes
 */
export function updateLearningPathProgress(
  learningPath: LearningPath,
  nodeId: string,
  completed: boolean
): LearningPath {
  // Create a deep copy of the learning path
  const updatedPath: LearningPath = {
    ...learningPath,
    sections: JSON.parse(JSON.stringify(learningPath.sections))
  };
  
  // Find and update the node
  let totalNodes = 0;
  let completedNodes = 0;
  
  updatedPath.sections.forEach(section => {
    totalNodes += section.nodes.length;
    
    const nodeIndex = section.nodes.findIndex(node => node.id === nodeId);
    if (nodeIndex !== -1) {
      section.nodes[nodeIndex].completed = completed;
    }
    
    // Count completed nodes in this section
    const sectionCompletedNodes = section.nodes.filter(node => node.completed).length;
    completedNodes += sectionCompletedNodes;
    
    // Update section completion status
    section.completed = sectionCompletedNodes === section.nodes.length && section.nodes.length > 0;
  });
  
  // Update overall progress
  updatedPath.progress = Math.round((completedNodes / totalNodes) * 100) || 0;
  
  return updatedPath;
}

/**
 * Recommends the next node for the user to complete
 */
export function getNextRecommendedNode(learningPath: LearningPath): LearningPathNode | null {
  // First check for any incomplete nodes in the current section the user is working on
  for (const section of learningPath.sections) {
    const hasIncompleteNodes = section.nodes.some(node => !node.completed);
    const hasCompleteNodes = section.nodes.some(node => node.completed);
    
    if (hasIncompleteNodes && hasCompleteNodes) {
      // User has started but not completed this section - prioritize it
      const incompleteNode = section.nodes.find(node => !node.completed);
      if (incompleteNode) return incompleteNode;
    }
  }
  
  // If no sections are in progress, recommend the first incomplete node from the first incomplete section
  for (const section of learningPath.sections) {
    if (!section.completed) {
      const incompleteNode = section.nodes.find(node => !node.completed);
      if (incompleteNode) return incompleteNode;
    }
  }
  
  // If all nodes are complete, return null
  return null;
}

/**
 * Utility function to capitalize the first letter of a string
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}