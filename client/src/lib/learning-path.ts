import { v4 as uuidv4 } from 'uuid';

// Types for learning path
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type TimeCommitment = 'minimal' | 'moderate' | 'intensive';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ResourceType = 'video' | 'article' | 'interactive' | 'quiz' | 'flashcard' | 'practice';

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
  resourceType: ResourceType;
  url?: string;
  estimatedTime: number; // in minutes
  difficulty: DifficultyLevel;
  completed: boolean;
  focusArea: string;
  order: number;
}

export interface LearningPathSection {
  id: string;
  title: string;
  description: string;
  order: number;
  nodes: LearningPathNode[];
  completed: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  learningStyle: LearningStyle;
  timeCommitment: TimeCommitment;
  difficulty: DifficultyLevel;
  focusAreas: string[];
  sections: LearningPathSection[];
  progress: number; // 0-100
}

// Study area type from useStudyProgress
export interface StudyArea {
  confidenceLevel: number; // 1-3
  lastPracticed?: Date;
  questionsAttempted?: number;
  questionsCorrect?: number;
  recommendedFocus?: boolean;
}

// Resource database - organized by learning style and type
const resourceDatabase: Record<string, Record<string, Array<{ title: string; description: string; url?: string; estimatedTime: number; difficulty: DifficultyLevel; }>>> = {
  fundamentals: {
    visual: [
      { 
        title: 'Introduction to Nursing Fundamentals',
        description: 'Visual overview of core nursing concepts and principles',
        url: 'https://www.youtube.com/watch?v=nursing-fundamentals-intro',
        estimatedTime: 15,
        difficulty: 'beginner'
      },
      { 
        title: 'Nursing Assessments Visual Guide',
        description: 'Illustrated guide to conducting thorough patient assessments',
        url: 'https://www.youtube.com/watch?v=nursing-assessment-visual',
        estimatedTime: 25,
        difficulty: 'intermediate'
      }
    ],
    auditory: [
      { 
        title: 'Nursing Fundamentals Podcast Series',
        description: 'Audio lessons covering essential nursing fundamentals',
        url: 'https://nursingpodcast.com/fundamentals-series',
        estimatedTime: 45,
        difficulty: 'beginner'
      }
    ],
    reading: [
      { 
        title: 'Fundamentals of Nursing: Key Concepts',
        description: 'Comprehensive reading on essential nursing concepts',
        url: 'https://nursing-education.org/fundamentals-concepts',
        estimatedTime: 30,
        difficulty: 'beginner'
      }
    ],
    kinesthetic: [
      { 
        title: 'Hands-on Nursing Skills Practice',
        description: 'Interactive exercises for fundamental nursing skills',
        url: 'https://nursing-practice.org/interactive-fundamentals',
        estimatedTime: 60,
        difficulty: 'intermediate'
      }
    ]
  },
  pharmacology: {
    visual: [
      { 
        title: 'Pharmacology Mechanisms Visualized',
        description: 'Visual explanations of drug mechanisms and interactions',
        url: 'https://www.youtube.com/watch?v=pharm-mechanisms',
        estimatedTime: 20,
        difficulty: 'intermediate'
      },
      { 
        title: 'Common Medications Visual Chart',
        description: 'Visual reference guide for commonly prescribed medications',
        url: 'https://nursingpharm.edu/visual-med-chart',
        estimatedTime: 15,
        difficulty: 'beginner'
      }
    ],
    auditory: [
      { 
        title: 'Pharmacology Audio Mnemonics',
        description: 'Memory techniques for drug classifications and effects',
        url: 'https://nursing-audio.com/pharm-mnemonics',
        estimatedTime: 30,
        difficulty: 'intermediate'
      }
    ],
    reading: [
      { 
        title: 'Comprehensive Medication Administration Guide',
        description: 'Detailed guide on safe medication administration practices',
        url: 'https://nursing-education.org/med-admin-guide',
        estimatedTime: 40,
        difficulty: 'intermediate'
      }
    ],
    kinesthetic: [
      { 
        title: 'Medication Calculation Practice',
        description: 'Interactive problems for dosage calculations',
        url: 'https://nursing-calc.org/med-calculations',
        estimatedTime: 35,
        difficulty: 'advanced'
      }
    ]
  },
  'med-surg': {
    visual: [
      { 
        title: 'Medical-Surgical Nursing Visual Cases',
        description: 'Visual case studies of common med-surg scenarios',
        url: 'https://www.youtube.com/watch?v=med-surg-cases',
        estimatedTime: 30,
        difficulty: 'intermediate'
      }
    ],
    auditory: [
      { 
        title: 'Med-Surg Audio Lectures Series',
        description: 'Comprehensive audio lectures on medical-surgical nursing',
        url: 'https://nursing-audio.com/med-surg-series',
        estimatedTime: 60,
        difficulty: 'advanced'
      }
    ],
    reading: [
      { 
        title: 'Medical-Surgical Nursing: Critical Thinking Cases',
        description: 'Text-based case studies requiring critical nursing judgment',
        url: 'https://nursing-education.org/med-surg-cases',
        estimatedTime: 45,
        difficulty: 'advanced'
      }
    ],
    kinesthetic: [
      { 
        title: 'Interactive Med-Surg Simulations',
        description: 'Practice scenarios for medical-surgical nursing interventions',
        url: 'https://nursing-sims.org/med-surg',
        estimatedTime: 50,
        difficulty: 'intermediate'
      }
    ]
  },
  pediatrics: {
    visual: [
      { 
        title: 'Pediatric Assessment Techniques',
        description: 'Visual demonstration of pediatric-specific assessment approaches',
        url: 'https://www.youtube.com/watch?v=pediatric-assessment',
        estimatedTime: 25,
        difficulty: 'intermediate'
      }
    ],
    auditory: [
      { 
        title: 'Pediatric Nursing Audio Review',
        description: 'Comprehensive audio review of pediatric nursing concepts',
        url: 'https://nursing-audio.com/pediatrics-review',
        estimatedTime: 40,
        difficulty: 'intermediate'
      }
    ],
    reading: [
      { 
        title: 'Pediatric Medication Safety Guide',
        description: 'Critical information on safe medication practices for children',
        url: 'https://nursing-education.org/peds-med-safety',
        estimatedTime: 35,
        difficulty: 'intermediate'
      }
    ],
    kinesthetic: [
      { 
        title: 'Pediatric Growth & Development Activities',
        description: 'Interactive practice for pediatric developmental assessments',
        url: 'https://nursing-practice.org/pediatric-development',
        estimatedTime: 30,
        difficulty: 'beginner'
      }
    ]
  },
  obstetrics: {
    visual: [
      { 
        title: 'Fetal Development Visualization',
        description: 'Detailed visual guide to stages of fetal development',
        url: 'https://www.youtube.com/watch?v=fetal-development',
        estimatedTime: 20,
        difficulty: 'beginner'
      }
    ],
    auditory: [
      { 
        title: 'Obstetric Complications Review',
        description: 'Audio review of common OB complications and nursing interventions',
        url: 'https://nursing-audio.com/ob-complications',
        estimatedTime: 35,
        difficulty: 'advanced'
      }
    ],
    reading: [
      { 
        title: 'Maternal-Newborn Nursing Care Planning',
        description: 'Comprehensive guide to nursing care during pregnancy and post-partum',
        url: 'https://nursing-education.org/maternal-care-planning',
        estimatedTime: 40,
        difficulty: 'intermediate'
      }
    ],
    kinesthetic: [
      { 
        title: 'Labor & Delivery Simulation Activities',
        description: 'Interactive scenarios for obstetric nursing care',
        url: 'https://nursing-sims.org/labor-delivery',
        estimatedTime: 45,
        difficulty: 'advanced'
      }
    ]
  },
  psychiatric: {
    visual: [
      { 
        title: 'Mental Health Assessment Techniques',
        description: 'Visual demonstration of psychiatric assessment approaches',
        url: 'https://www.youtube.com/watch?v=mental-health-assessment',
        estimatedTime: 30,
        difficulty: 'intermediate'
      }
    ],
    auditory: [
      { 
        title: 'Psychiatric Nursing Discussions',
        description: 'Audio discussions of key psychiatric nursing topics',
        url: 'https://nursing-audio.com/psychiatric-discussions',
        estimatedTime: 45,
        difficulty: 'intermediate'
      }
    ],
    reading: [
      { 
        title: 'Therapeutic Communication Techniques',
        description: 'Guide to effective therapeutic communication in psychiatric nursing',
        url: 'https://nursing-education.org/therapeutic-communication',
        estimatedTime: 25,
        difficulty: 'beginner'
      }
    ],
    kinesthetic: [
      { 
        title: 'Psychiatric Crisis Intervention Practice',
        description: 'Interactive scenarios for psychiatric crisis management',
        url: 'https://nursing-sims.org/psychiatric-crisis',
        estimatedTime: 40,
        difficulty: 'advanced'
      }
    ]
  },
  prioritization: {
    visual: [
      { 
        title: 'Prioritization Decision Trees',
        description: 'Visual decision trees for nursing prioritization',
        url: 'https://www.youtube.com/watch?v=prioritization-trees',
        estimatedTime: 25,
        difficulty: 'intermediate'
      }
    ],
    auditory: [
      { 
        title: 'Prioritization & Delegation Case Reviews',
        description: 'Audio case studies on prioritization and delegation',
        url: 'https://nursing-audio.com/prioritization-cases',
        estimatedTime: 35,
        difficulty: 'advanced'
      }
    ],
    reading: [
      { 
        title: 'Mastering Nursing Prioritization',
        description: 'Comprehensive text on prioritization strategies for nurses',
        url: 'https://nursing-education.org/mastering-prioritization',
        estimatedTime: 30,
        difficulty: 'intermediate'
      }
    ],
    kinesthetic: [
      { 
        title: 'Interactive Triage Practice Scenarios',
        description: 'Practice making prioritization decisions in varied clinical scenarios',
        url: 'https://nursing-practice.org/triage-scenarios',
        estimatedTime: 40,
        difficulty: 'advanced'
      }
    ]
  },
  leadership: {
    visual: [
      { 
        title: 'Nursing Leadership Models Visualized',
        description: 'Visual overview of effective nursing leadership approaches',
        url: 'https://www.youtube.com/watch?v=nursing-leadership',
        estimatedTime: 20,
        difficulty: 'intermediate'
      }
    ],
    auditory: [
      { 
        title: 'Nursing Management Audio Series',
        description: 'Audio lectures on effective nursing management techniques',
        url: 'https://nursing-audio.com/management-series',
        estimatedTime: 35,
        difficulty: 'intermediate'
      }
    ],
    reading: [
      { 
        title: 'Effective Nursing Team Leadership',
        description: 'Guide to building and leading successful nursing teams',
        url: 'https://nursing-education.org/team-leadership',
        estimatedTime: 30,
        difficulty: 'intermediate'
      }
    ],
    kinesthetic: [
      { 
        title: 'Leadership & Management Simulation',
        description: 'Interactive scenarios for practicing nursing leadership',
        url: 'https://nursing-sims.org/leadership',
        estimatedTime: 45,
        difficulty: 'advanced'
      }
    ]
  }
};

// Quiz resources for assessment
const quizResources: Record<string, Array<{ title: string; description: string; estimatedTime: number; difficulty: DifficultyLevel; }>> = {
  fundamentals: [
    { 
      title: 'Fundamentals of Nursing Practice Quiz',
      description: 'Test your knowledge of essential nursing fundamentals',
      estimatedTime: 20,
      difficulty: 'beginner'
    },
    { 
      title: 'Advanced Nursing Fundamentals Assessment',
      description: 'Comprehensive quiz covering advanced fundamental concepts',
      estimatedTime: 30,
      difficulty: 'advanced'
    }
  ],
  pharmacology: [
    { 
      title: 'Basic Pharmacology Quiz',
      description: 'Test your knowledge of common medications and classifications',
      estimatedTime: 15,
      difficulty: 'beginner'
    },
    { 
      title: 'Advanced Pharmacology Assessment',
      description: 'Complex questions on pharmacokinetics and drug interactions',
      estimatedTime: 25,
      difficulty: 'advanced'
    }
  ],
  'med-surg': [
    { 
      title: 'Medical-Surgical Nursing Quiz',
      description: 'Test your knowledge of med-surg nursing concepts',
      estimatedTime: 25,
      difficulty: 'intermediate'
    },
    { 
      title: 'Advanced Med-Surg Critical Thinking Assessment',
      description: 'Complex case scenarios requiring advanced clinical judgment',
      estimatedTime: 35,
      difficulty: 'advanced'
    }
  ],
  pediatrics: [
    { 
      title: 'Pediatric Nursing Concepts Quiz',
      description: 'Test your knowledge of pediatric nursing principles',
      estimatedTime: 20,
      difficulty: 'intermediate'
    }
  ],
  obstetrics: [
    { 
      title: 'Maternal-Newborn Nursing Quiz',
      description: 'Test your knowledge of obstetric and newborn care',
      estimatedTime: 25,
      difficulty: 'intermediate'
    }
  ],
  psychiatric: [
    { 
      title: 'Psychiatric Nursing Assessment',
      description: 'Test your knowledge of mental health nursing concepts',
      estimatedTime: 20,
      difficulty: 'intermediate'
    }
  ],
  prioritization: [
    { 
      title: 'Nursing Prioritization Quiz',
      description: 'Test your ability to prioritize nursing actions in various scenarios',
      estimatedTime: 30,
      difficulty: 'advanced'
    }
  ],
  leadership: [
    { 
      title: 'Nursing Leadership & Management Quiz',
      description: 'Test your knowledge of nursing leadership principles',
      estimatedTime: 25,
      difficulty: 'intermediate'
    }
  ]
};

// Practice resources for hands-on application
const practiceResources: Record<string, Array<{ title: string; description: string; estimatedTime: number; difficulty: DifficultyLevel; }>> = {
  fundamentals: [
    { 
      title: 'Nursing Fundamentals Practice Exercises',
      description: 'Hands-on practice of fundamental nursing skills',
      estimatedTime: 45,
      difficulty: 'intermediate'
    }
  ],
  pharmacology: [
    { 
      title: 'Medication Calculation Practice',
      description: 'Practice calculating medication dosages and IV rates',
      estimatedTime: 30,
      difficulty: 'intermediate'
    }
  ],
  'med-surg': [
    { 
      title: 'Med-Surg Clinical Scenarios Practice',
      description: 'Practice clinical decision-making in medical-surgical scenarios',
      estimatedTime: 40,
      difficulty: 'advanced'
    }
  ],
  pediatrics: [
    { 
      title: 'Pediatric Care Planning Practice',
      description: 'Practice developing care plans for pediatric patients',
      estimatedTime: 35,
      difficulty: 'intermediate'
    }
  ],
  obstetrics: [
    { 
      title: 'Obstetric Complication Management Practice',
      description: 'Practice responding to obstetric emergencies',
      estimatedTime: 40,
      difficulty: 'advanced'
    }
  ],
  psychiatric: [
    { 
      title: 'Therapeutic Communication Practice',
      description: 'Practice therapeutic communication techniques for mental health',
      estimatedTime: 30,
      difficulty: 'beginner'
    }
  ],
  prioritization: [
    { 
      title: 'Multi-patient Prioritization Practice',
      description: 'Practice prioritizing care for multiple patients',
      estimatedTime: 35,
      difficulty: 'advanced'
    }
  ],
  leadership: [
    { 
      title: 'Conflict Resolution Practice Scenarios',
      description: 'Practice resolving conflicts in healthcare team settings',
      estimatedTime: 30,
      difficulty: 'intermediate'
    }
  ]
};

// AI-enhanced recommendation algorithm
export function generateLearningPath(preferences: LearningPreferences, studyAreas: Record<string, StudyArea>): LearningPath {
  // Generate a unique ID for the path
  const pathId = uuidv4();
  
  // Determine title and description based on preferences
  const title = `Personalized NCLEX Learning Path (${preferences.difficulty.charAt(0).toUpperCase() + preferences.difficulty.slice(1)})`;
  const description = `Custom ${preferences.learningStyle}-focused learning path with ${preferences.timeCommitment} time commitment, focusing on ${preferences.focusAreas.join(', ')}.`;
  
  // Create sections for the learning path
  const sections: LearningPathSection[] = [];
  let sectionOrder = 1;
  
  // For each focus area, create a section
  preferences.focusAreas.forEach(area => {
    const isExcluded = preferences.excludedAreas?.includes(area) || false;
    const areaConfidence = studyAreas[area]?.confidenceLevel || 2; // Default to medium if unknown
    
    // Adjust node count based on confidence level and excluded status
    const nodeCount = isExcluded 
      ? 2 // Fewer nodes for excluded areas
      : areaConfidence === 1 
        ? 5 // More nodes for low confidence
        : areaConfidence === 2 
          ? 4 // Medium for average confidence
          : 3; // Fewer for high confidence
    
    // Create nodes for this section
    const nodes: LearningPathNode[] = [];
    let nodeOrder = 1;
    
    // Add main learning resource based on learning style
    const learningStyleResources = resourceDatabase[area]?.[preferences.learningStyle] || [];
    if (learningStyleResources.length > 0) {
      // Choose appropriate difficulty resource
      const filteredResources = learningStyleResources.filter(
        resource => resource.difficulty === preferences.difficulty || resource.difficulty === 'intermediate'
      );
      
      const resource = filteredResources.length > 0
        ? filteredResources[0]
        : learningStyleResources[0];
      
      nodes.push({
        id: uuidv4(),
        title: resource.title,
        description: resource.description,
        resourceType: mapLearningStyleToResourceType(preferences.learningStyle),
        url: resource.url,
        estimatedTime: resource.estimatedTime,
        difficulty: resource.difficulty,
        completed: false,
        focusArea: area,
        order: nodeOrder++
      });
    }
    
    // Add additional resources and quiz
    if (nodeCount >= 2) {
      // Add quiz resource
      const quizzes = quizResources[area] || [];
      if (quizzes.length > 0) {
        const quiz = quizzes.find(q => q.difficulty === preferences.difficulty) || quizzes[0];
        
        nodes.push({
          id: uuidv4(),
          title: quiz.title,
          description: quiz.description,
          resourceType: 'quiz',
          estimatedTime: quiz.estimatedTime,
          difficulty: quiz.difficulty,
          completed: false,
          focusArea: area,
          order: nodeOrder++
        });
      }
      
      // Add practice resource
      if (nodeCount >= 3) {
        const practices = practiceResources[area] || [];
        if (practices.length > 0) {
          const practice = practices.find(p => p.difficulty === preferences.difficulty) || practices[0];
          
          nodes.push({
            id: uuidv4(),
            title: practice.title,
            description: practice.description,
            resourceType: 'practice',
            estimatedTime: practice.estimatedTime,
            difficulty: practice.difficulty,
            completed: false,
            focusArea: area,
            order: nodeOrder++
          });
        }
      }
      
      // Add complementary learning style resource (for variety)
      if (nodeCount >= 4) {
        const complementaryStyle = getComplementaryLearningStyle(preferences.learningStyle);
        const complementaryResources = resourceDatabase[area]?.[complementaryStyle] || [];
        
        if (complementaryResources.length > 0) {
          const resource = complementaryResources[0];
          
          nodes.push({
            id: uuidv4(),
            title: resource.title,
            description: resource.description,
            resourceType: mapLearningStyleToResourceType(complementaryStyle),
            url: resource.url,
            estimatedTime: resource.estimatedTime,
            difficulty: resource.difficulty,
            completed: false,
            focusArea: area,
            order: nodeOrder++
          });
        }
      }
      
      // Add another complementary learning style resource
      if (nodeCount >= 5) {
        const secondaryStyle = getSecondaryLearningStyle(preferences.learningStyle);
        const secondaryResources = resourceDatabase[area]?.[secondaryStyle] || [];
        
        if (secondaryResources.length > 0) {
          const resource = secondaryResources[0];
          
          nodes.push({
            id: uuidv4(),
            title: resource.title,
            description: resource.description,
            resourceType: mapLearningStyleToResourceType(secondaryStyle),
            url: resource.url,
            estimatedTime: resource.estimatedTime,
            difficulty: resource.difficulty,
            completed: false,
            focusArea: area,
            order: nodeOrder++
          });
        }
      }
    }
    
    // Only create section if we have nodes
    if (nodes.length > 0) {
      sections.push({
        id: uuidv4(),
        title: `${formatAreaTitle(area)} Nursing`,
        description: `Study materials focused on ${formatAreaTitle(area).toLowerCase()} nursing concepts and principles.`,
        order: sectionOrder++,
        nodes: nodes,
        completed: false
      });
    }
  });
  
  // Create the learning path
  const learningPath: LearningPath = {
    id: pathId,
    title,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    learningStyle: preferences.learningStyle,
    timeCommitment: preferences.timeCommitment,
    difficulty: preferences.difficulty,
    focusAreas: preferences.focusAreas,
    sections,
    progress: 0 // Initial progress is 0%
  };
  
  return learningPath;
}

// Helper to map learning style to resource type
function mapLearningStyleToResourceType(style: LearningStyle): ResourceType {
  switch (style) {
    case 'visual': return 'video';
    case 'auditory': return 'video'; // Audio resources are often videos
    case 'reading': return 'article';
    case 'kinesthetic': return 'interactive';
    default: return 'article';
  }
}

// Helper to get a complementary learning style
function getComplementaryLearningStyle(style: LearningStyle): LearningStyle {
  switch (style) {
    case 'visual': return 'reading';
    case 'auditory': return 'visual';
    case 'reading': return 'auditory';
    case 'kinesthetic': return 'visual';
    default: return 'reading';
  }
}

// Helper to get a secondary complementary learning style
function getSecondaryLearningStyle(style: LearningStyle): LearningStyle {
  switch (style) {
    case 'visual': return 'kinesthetic';
    case 'auditory': return 'kinesthetic';
    case 'reading': return 'visual';
    case 'kinesthetic': return 'reading';
    default: return 'visual';
  }
}

// Helper to format area title
function formatAreaTitle(area: string): string {
  // Special cases
  if (area === 'med-surg') return 'Medical-Surgical';
  
  // General case: capitalize first letter of each word
  return area
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}

// Update learning path progress based on completed nodes
export function updateLearningPathProgress(
  path: LearningPath,
  nodeId: string,
  completed: boolean
): LearningPath {
  // Create a deep copy of the path to avoid mutating the original
  const updatedPath: LearningPath = JSON.parse(JSON.stringify(path));
  
  // Find and update the node
  let totalNodes = 0;
  let completedNodes = 0;
  
  updatedPath.sections.forEach(section => {
    let sectionCompleted = true;
    
    section.nodes.forEach(node => {
      totalNodes++;
      
      // Update the specific node
      if (node.id === nodeId) {
        node.completed = completed;
      }
      
      // Count completed nodes
      if (node.completed) {
        completedNodes++;
      } else {
        sectionCompleted = false;
      }
    });
    
    // Update section completion status
    section.completed = sectionCompleted;
  });
  
  // Calculate overall progress
  updatedPath.progress = totalNodes > 0 
    ? Math.round((completedNodes / totalNodes) * 100) 
    : 0;
  
  // Update the updated timestamp
  updatedPath.updatedAt = new Date();
  
  return updatedPath;
}

// Get the next recommended node to study
export function getNextRecommendedNode(path: LearningPath): LearningPathNode | null {
  // Start with the first incomplete node in order
  for (const section of path.sections) {
    if (section.completed) continue;
    
    // Find the first incomplete node
    const nextNode = section.nodes
      .filter(node => !node.completed)
      .sort((a, b) => a.order - b.order)[0];
    
    if (nextNode) {
      return nextNode;
    }
  }
  
  return null; // No incomplete nodes found
}

// Get AI-enhanced recommendations based on path progress
export function getEnhancedRecommendations(
  path: LearningPath,
  studyAreas: Record<string, StudyArea>
): string[] {
  const recommendations: string[] = [];
  
  // Calculate completion percentages by area
  const areaCompletion: Record<string, { total: number; completed: number; percentage: number }> = {};
  
  path.sections.forEach(section => {
    section.nodes.forEach(node => {
      const area = node.focusArea;
      
      if (!areaCompletion[area]) {
        areaCompletion[area] = { total: 0, completed: 0, percentage: 0 };
      }
      
      areaCompletion[area].total++;
      if (node.completed) {
        areaCompletion[area].completed++;
      }
    });
  });
  
  // Calculate percentages
  Object.keys(areaCompletion).forEach(area => {
    const { total, completed } = areaCompletion[area];
    areaCompletion[area].percentage = total > 0 ? (completed / total) * 100 : 0;
  });
  
  // Generate recommendations based on progress patterns
  const lowProgressAreas = Object.entries(areaCompletion)
    .filter(([_, data]) => data.percentage < 33)
    .map(([area, _]) => area);
  
  if (lowProgressAreas.length > 0) {
    recommendations.push(
      `Focus on completing resources in these areas: ${lowProgressAreas.map(formatAreaTitle).join(', ')}.`
    );
  }
  
  // Check if user is neglecting certain areas
  const neglectedAreas = Object.entries(areaCompletion)
    .filter(([_, data]) => data.percentage === 0 && data.total > 0)
    .map(([area, _]) => area);
  
  if (neglectedAreas.length > 0) {
    recommendations.push(
      `You haven't started any resources in: ${neglectedAreas.map(formatAreaTitle).join(', ')}. Consider beginning with those areas.`
    );
  }
  
  // Recommendations based on study areas confidence
  const lowConfidenceAreas = Object.entries(studyAreas)
    .filter(([_, data]) => data.confidenceLevel === 1)
    .map(([area, _]) => area)
    .filter(area => path.focusAreas.includes(area));
  
  if (lowConfidenceAreas.length > 0) {
    recommendations.push(
      `Based on your confidence levels, prioritize more practice in: ${lowConfidenceAreas.map(formatAreaTitle).join(', ')}.`
    );
  }
  
  // Recommendation for learning style variation
  if (path.progress > 30) {
    recommendations.push(
      `Try varying your learning approaches. Consider adding more ${getComplementaryLearningStyle(path.learningStyle)}-based resources to reinforce your learning.`
    );
  }
  
  // If no specific recommendations, give general advice
  if (recommendations.length === 0) {
    recommendations.push(
      "You're making good progress across all areas. Continue with your current learning path and consider attempting practice questions to test your knowledge."
    );
  }
  
  return recommendations;
}