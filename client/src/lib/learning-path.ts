import { StudyArea } from "@/hooks/useStudyProgress";

// Learning path types
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Learning resource types
export type ResourceType = 'video' | 'article' | 'practice' | 'quiz' | 'flashcard' | 'interactive';

// Time commitment types
export type TimeCommitment = 'minimal' | 'moderate' | 'intensive';

// Learning path node - represents a unit of learning
export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  area: string;
  estimatedTime: number; // in minutes
  resourceType: ResourceType;
  difficulty: DifficultyLevel;
  completed: boolean;
  prerequisites: string[]; // IDs of nodes that should be completed first
  url?: string; // Optional URL to external resource
}

// Learning path section groups related nodes
export interface LearningPathSection {
  id: string;
  title: string;
  description: string;
  area: string;
  nodes: LearningPathNode[];
  completed: boolean;
}

// Defines a complete learning path
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  sections: LearningPathSection[];
  timeCommitment: TimeCommitment;
  learningStyle: LearningStyle;
  difficulty: DifficultyLevel;
  estimatedCompletionWeeks: number;
  progress: number; // 0-100
}

// Structure for user preferences
export interface LearningPreferences {
  learningStyle: LearningStyle;
  timeCommitment: TimeCommitment;
  difficulty: DifficultyLevel;
  focusAreas: string[];
  excludedAreas?: string[];
  daysUntilExam?: number;
}

// Resource database - contains various learning resources
const LEARNING_RESOURCES = {
  'fundamentals': [
    {
      id: 'fund-1',
      title: 'Nursing Process Overview',
      description: 'Introduction to the five steps of the nursing process: assessment, diagnosis, planning, implementation, and evaluation.',
      estimatedTime: 45,
      resourceType: 'video',
      difficulty: 'beginner',
      url: '/resources/nursing-process'
    },
    {
      id: 'fund-2',
      title: 'Nursing Documentation Principles',
      description: 'Learn proper documentation techniques and legal considerations for nursing records.',
      estimatedTime: 60,
      resourceType: 'article',
      difficulty: 'beginner',
      url: '/resources/documentation'
    },
    {
      id: 'fund-3',
      title: 'Basic Nursing Assessment Quiz',
      description: 'Test your knowledge of fundamental nursing assessment techniques.',
      estimatedTime: 30,
      resourceType: 'quiz',
      difficulty: 'beginner',
      url: '/quizzes/basic-assessment'
    },
    {
      id: 'fund-4',
      title: 'Advanced Physical Assessment',
      description: 'Detailed guide to conducting comprehensive physical assessments across body systems.',
      estimatedTime: 90,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: '/resources/advanced-assessment'
    }
  ],
  'pharmacology': [
    {
      id: 'pharm-1',
      title: 'Medication Administration Safety',
      description: 'Critical safety protocols for administering medications, including the six rights of medication administration.',
      estimatedTime: 60,
      resourceType: 'video',
      difficulty: 'beginner',
      url: '/resources/med-safety'
    },
    {
      id: 'pharm-2',
      title: 'Common Medication Classifications',
      description: 'Overview of major drug classifications including expected actions, side effects, and nursing implications.',
      estimatedTime: 75,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: '/resources/med-classifications'
    },
    {
      id: 'pharm-3',
      title: 'Medication Calculation Practice',
      description: 'Interactive practice sessions for mastering medication dosage calculations.',
      estimatedTime: 45,
      resourceType: 'interactive',
      difficulty: 'intermediate',
      url: '/practice/med-calculations'
    },
    {
      id: 'pharm-4',
      title: 'High-Alert Medications',
      description: 'In-depth review of high-alert medications, their risks, and safety precautions.',
      estimatedTime: 60,
      resourceType: 'video',
      difficulty: 'advanced',
      url: '/resources/high-alert-meds'
    }
  ],
  'med-surg': [
    {
      id: 'medsurg-1',
      title: 'Respiratory System Disorders',
      description: 'Comprehensive review of common respiratory disorders, assessments, and nursing interventions.',
      estimatedTime: 90,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: '/resources/respiratory'
    },
    {
      id: 'medsurg-2',
      title: 'Cardiovascular Case Studies',
      description: 'Practice with realistic patient scenarios focusing on cardiovascular conditions.',
      estimatedTime: 60,
      resourceType: 'practice',
      difficulty: 'intermediate',
      url: '/practice/cardiac-cases'
    },
    {
      id: 'medsurg-3',
      title: 'Endocrine System Flashcards',
      description: 'Review key endocrine disorders and interventions through interactive flashcards.',
      estimatedTime: 45,
      resourceType: 'flashcard',
      difficulty: 'intermediate',
      url: '/flashcards/endocrine'
    }
  ],
  'pediatrics': [
    {
      id: 'peds-1',
      title: 'Pediatric Assessment Differences',
      description: 'Key differences in assessment techniques for pediatric patients compared to adults.',
      estimatedTime: 60,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: '/resources/peds-assessment'
    },
    {
      id: 'peds-2',
      title: 'Common Childhood Illnesses',
      description: 'Overview of frequently encountered pediatric conditions and appropriate nursing interventions.',
      estimatedTime: 75,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: '/resources/childhood-illnesses'
    }
  ],
  'obstetrics': [
    {
      id: 'ob-1',
      title: 'Normal Pregnancy and Delivery',
      description: 'Review of physiological changes during pregnancy and the normal labor and delivery process.',
      estimatedTime: 90,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: '/resources/normal-pregnancy'
    },
    {
      id: 'ob-2',
      title: 'High-Risk Pregnancy Scenarios',
      description: 'Interactive case studies of high-risk pregnancy situations and appropriate nursing responses.',
      estimatedTime: 60,
      resourceType: 'practice',
      difficulty: 'advanced',
      url: '/practice/high-risk-ob'
    }
  ],
  'psychiatric': [
    {
      id: 'psych-1',
      title: 'Therapeutic Communication',
      description: 'Techniques and principles for effective therapeutic communication in mental health settings.',
      estimatedTime: 60,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: '/resources/therapeutic-comm'
    },
    {
      id: 'psych-2',
      title: 'Major Mental Health Disorders',
      description: 'Comprehensive overview of common psychiatric disorders, symptoms, and nursing interventions.',
      estimatedTime: 90,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: '/resources/mental-disorders'
    }
  ],
  'prioritization': [
    {
      id: 'priority-1',
      title: 'Nursing Prioritization Principles',
      description: 'Learn key frameworks for prioritizing patient care, including Maslow\'s Hierarchy and ABC approach.',
      estimatedTime: 45,
      resourceType: 'video',
      difficulty: 'intermediate',
      url: '/resources/prioritization'
    },
    {
      id: 'priority-2',
      title: 'Delegation Decision-Making',
      description: 'Principles and practice scenarios for appropriate delegation in nursing.',
      estimatedTime: 60,
      resourceType: 'practice',
      difficulty: 'intermediate',
      url: '/practice/delegation'
    },
    {
      id: 'priority-3',
      title: 'Advanced Triage Scenarios',
      description: 'Complex patient scenarios requiring critical thinking and rapid prioritization.',
      estimatedTime: 75,
      resourceType: 'interactive',
      difficulty: 'advanced',
      url: '/practice/triage-scenarios'
    }
  ],
  'leadership': [
    {
      id: 'lead-1',
      title: 'Nursing Management Principles',
      description: 'Introduction to key concepts in nursing leadership and management.',
      estimatedTime: 60,
      resourceType: 'article',
      difficulty: 'intermediate',
      url: '/resources/nursing-management'
    }
  ]
};

/**
 * Generates a personalized learning path based on user preferences and study area strengths/weaknesses
 */
export function generateLearningPath(
  preferences: LearningPreferences,
  studyAreas: Record<string, StudyArea>
): LearningPath {
  // Identify weak areas that need focus
  const weakAreas = Object.entries(studyAreas)
    .filter(([_, area]) => area.confidenceLevel === 1)
    .map(([name]) => name);

  // Identify moderate areas
  const moderateAreas = Object.entries(studyAreas)
    .filter(([_, area]) => area.confidenceLevel === 2)
    .map(([name]) => name);

  // Determine which areas to include in the path
  let focusAreas = [...preferences.focusAreas];
  
  // Always include weak areas, but limit total areas based on time commitment
  weakAreas.forEach(area => {
    if (!focusAreas.includes(area)) {
      focusAreas.push(area);
    }
  });
  
  // If user has minimal time, limit to just weak areas + 1-2 chosen focus areas
  if (preferences.timeCommitment === 'minimal') {
    focusAreas = [
      ...weakAreas,
      ...preferences.focusAreas.filter(area => !weakAreas.includes(area)).slice(0, 2)
    ];
  }

  // Remove any explicitly excluded areas
  if (preferences.excludedAreas && preferences.excludedAreas.length > 0) {
    focusAreas = focusAreas.filter(area => !preferences.excludedAreas?.includes(area));
  }

  // Generate sections for each focus area
  const sections: LearningPathSection[] = [];
  
  for (const area of focusAreas) {
    if (LEARNING_RESOURCES[area]) {
      // Filter resources based on difficulty preference
      let resources = LEARNING_RESOURCES[area].filter(resource => {
        if (preferences.difficulty === 'beginner') {
          return resource.difficulty === 'beginner';
        } else if (preferences.difficulty === 'intermediate') {
          return resource.difficulty === 'beginner' || resource.difficulty === 'intermediate';
        } else {
          return true; // Include all difficulties for advanced learners
        }
      });

      // Prioritize resource types based on learning style
      resources = sortResourcesByLearningStyle(resources, preferences.learningStyle);

      // For minimal time commitment, limit resources per area
      if (preferences.timeCommitment === 'minimal') {
        resources = resources.slice(0, 2);
      } else if (preferences.timeCommitment === 'moderate') {
        resources = resources.slice(0, 3);
      }

      // Create nodes from resources
      const nodes: LearningPathNode[] = resources.map((resource, index) => ({
        ...resource,
        area,
        completed: false,
        prerequisites: index > 0 ? [resources[index - 1].id] : []
      }));

      if (nodes.length > 0) {
        sections.push({
          id: `section-${area}`,
          title: `${capitalizeFirstLetter(area)} Nursing`,
          description: getAreaDescription(area),
          area,
          nodes,
          completed: false
        });
      }
    }
  }

  // Calculate estimated completion time based on content and time commitment
  const totalMinutes = sections.reduce(
    (sum, section) => sum + section.nodes.reduce((nodeSum, node) => nodeSum + node.estimatedTime, 0),
    0
  );
  
  // Convert minutes to weeks based on time commitment
  let estimatedCompletionWeeks = calculateEstimatedWeeks(totalMinutes, preferences.timeCommitment);
  
  // If user specified days until exam, adjust path to fit within that timeframe
  if (preferences.daysUntilExam) {
    const weeksUntilExam = Math.ceil(preferences.daysUntilExam / 7);
    if (estimatedCompletionWeeks > weeksUntilExam) {
      estimatedCompletionWeeks = weeksUntilExam;
    }
  }

  return {
    id: `path-${Date.now()}`,
    title: generatePathTitle(preferences, weakAreas),
    description: generatePathDescription(preferences, weakAreas, moderateAreas),
    createdAt: new Date(),
    sections,
    timeCommitment: preferences.timeCommitment,
    learningStyle: preferences.learningStyle,
    difficulty: preferences.difficulty,
    estimatedCompletionWeeks,
    progress: 0
  };
}

/**
 * Sorts resources based on user's preferred learning style
 */
function sortResourcesByLearningStyle(
  resources: any[],
  learningStyle: LearningStyle
): any[] {
  return [...resources].sort((a, b) => {
    // Determine resource type scores based on learning style
    const getStyleScore = (type: ResourceType, style: LearningStyle) => {
      if (style === 'visual') {
        // Visual learners prefer videos and interactive resources
        if (type === 'video') return 4;
        if (type === 'interactive') return 3;
        if (type === 'flashcard') return 2;
        return 1;
      } else if (style === 'auditory') {
        // Auditory learners prefer videos and discussions
        if (type === 'video') return 4;
        if (type === 'interactive') return 3;
        return 1;
      } else if (style === 'reading') {
        // Reading learners prefer articles and written content
        if (type === 'article') return 4;
        if (type === 'flashcard') return 3;
        if (type === 'quiz') return 2;
        return 1;
      } else if (style === 'kinesthetic') {
        // Kinesthetic learners prefer interactive and practice-based learning
        if (type === 'interactive') return 4;
        if (type === 'practice') return 4;
        if (type === 'quiz') return 3;
        return 1;
      }
      return 1;
    };

    const aScore = getStyleScore(a.resourceType, learningStyle);
    const bScore = getStyleScore(b.resourceType, learningStyle);
    
    // Sort by score descending, then by difficulty
    if (aScore !== bScore) return bScore - aScore;
    
    // Within same score, sort by difficulty level (beginner first)
    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
}

/**
 * Generates an appropriate title for the learning path
 */
function generatePathTitle(
  preferences: LearningPreferences,
  weakAreas: string[]
): string {
  if (weakAreas.length > 0) {
    if (weakAreas.length === 1) {
      return `Focused ${capitalizeFirstLetter(weakAreas[0])} Study Path`;
    } else if (weakAreas.length === 2) {
      return `${capitalizeFirstLetter(weakAreas[0])} & ${capitalizeFirstLetter(weakAreas[1])} Study Path`;
    } else {
      return "Comprehensive Improvement Study Path";
    }
  } else if (preferences.focusAreas.length > 0) {
    if (preferences.focusAreas.length === 1) {
      return `${capitalizeFirstLetter(preferences.focusAreas[0])} Mastery Path`;
    } else {
      return "Custom NCLEX Study Path";
    }
  } else {
    return "Personalized NCLEX Preparation Path";
  }
}

/**
 * Generates a description for the learning path
 */
function generatePathDescription(
  preferences: LearningPreferences,
  weakAreas: string[],
  moderateAreas: string[]
): string {
  let description = `This personalized learning path is designed for ${preferences.learningStyle} learners with a ${preferences.timeCommitment} time commitment. `;
  
  if (weakAreas.length > 0) {
    description += `It focuses on strengthening your knowledge in ${weakAreas.map(capitalizeFirstLetter).join(', ')}, `;
  }
  
  if (moderateAreas.length > 0 && weakAreas.length > 0) {
    description += `while also reinforcing ${moderateAreas.map(capitalizeFirstLetter).join(', ')}. `;
  } else if (moderateAreas.length > 0) {
    description += `It helps you further develop your understanding of ${moderateAreas.map(capitalizeFirstLetter).join(', ')}. `;
  }
  
  if (preferences.difficulty === 'beginner') {
    description += "This path focuses on building foundational knowledge with beginner-friendly resources.";
  } else if (preferences.difficulty === 'intermediate') {
    description += "This path balances foundational concepts with more challenging intermediate content.";
  } else {
    description += "This path includes advanced content to thoroughly prepare you for complex NCLEX questions.";
  }
  
  return description;
}

/**
 * Returns a description for a study area
 */
function getAreaDescription(area: string): string {
  const descriptions = {
    'fundamentals': 'Core nursing concepts and skills that form the foundation of nursing practice.',
    'pharmacology': 'Medication administration, drug classifications, and nursing implications of pharmacotherapy.',
    'med-surg': 'Medical-surgical nursing concepts covering various body systems and common disorders.',
    'pediatrics': 'Nursing care specific to infants, children, and adolescents and their unique health needs.',
    'obstetrics': 'Care related to pregnancy, childbirth, postpartum period, and newborn care.',
    'psychiatric': 'Mental health nursing concepts, therapeutic communication, and psychiatric disorders.',
    'prioritization': 'Principles of care prioritization, delegation, and clinical decision-making.',
    'leadership': 'Nursing management, leadership concepts, and healthcare team coordination.'
  };
  
  return descriptions[area] || `Focused study resources for ${capitalizeFirstLetter(area)} nursing topics.`;
}

/**
 * Calculates the estimated weeks to complete based on total minutes and time commitment
 */
function calculateEstimatedWeeks(totalMinutes: number, timeCommitment: TimeCommitment): number {
  // Define minutes per week based on time commitment
  const minutesPerWeek = {
    'minimal': 180, // 3 hours per week
    'moderate': 360, // 6 hours per week
    'intensive': 720 // 12 hours per week
  };
  
  const weeks = Math.ceil(totalMinutes / minutesPerWeek[timeCommitment]);
  return Math.max(1, Math.min(weeks, 16)); // Cap between 1 and 16 weeks
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Updates the progress of a learning path
 */
export function updateLearningPathProgress(
  path: LearningPath,
  nodeId: string,
  completed: boolean
): LearningPath {
  const updatedSections = path.sections.map(section => {
    const updatedNodes = section.nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, completed };
      }
      return node;
    });
    
    const sectionCompleted = updatedNodes.every(node => node.completed);
    
    return {
      ...section,
      nodes: updatedNodes,
      completed: sectionCompleted
    };
  });
  
  // Calculate overall path progress
  const totalNodes = path.sections.reduce((sum, section) => sum + section.nodes.length, 0);
  const completedNodes = updatedSections.reduce(
    (sum, section) => sum + section.nodes.filter(node => node.completed).length,
    0
  );
  
  const progress = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
  
  return {
    ...path,
    sections: updatedSections,
    progress
  };
}

/**
 * Gets the next recommended node to study based on prerequisites and completion status
 */
export function getNextRecommendedNode(path: LearningPath): LearningPathNode | null {
  // First pass: find the first uncompleted node with all prerequisites completed
  for (const section of path.sections) {
    if (section.completed) continue;
    
    for (const node of section.nodes) {
      if (node.completed) continue;
      
      // Check if all prerequisites are completed
      const allPrereqsCompleted = node.prerequisites.every(prereqId => {
        return path.sections.some(s => 
          s.nodes.some(n => n.id === prereqId && n.completed)
        );
      });
      
      if (allPrereqsCompleted) {
        return node;
      }
    }
  }
  
  // Second pass: find the first uncompleted node in an incomplete section
  for (const section of path.sections) {
    if (section.completed) continue;
    
    const firstUncompleted = section.nodes.find(node => !node.completed);
    if (firstUncompleted) {
      return firstUncompleted;
    }
  }
  
  return null;
}