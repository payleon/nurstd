import { ResourceType, DifficultyLevel } from '@/lib/resource-helpers';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  difficultyLevel: DifficultyLevel;
  estimatedTime: number; // in minutes
  link: string;
  isNew?: boolean;
  featured?: boolean;
}

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: "1",
    title: "Understanding ABGs (Arterial Blood Gases)",
    description: "Learn how to interpret ABG results and identify acid-base imbalances with this comprehensive guide.",
    type: "concept",
    category: "Med-Surg",
    difficultyLevel: "intermediate",
    estimatedTime: 15,
    link: "/learning/abg-interpretation"
  },
  {
    id: "2",
    title: "Prioritization in Critical Care Nursing",
    description: "Master the skill of prioritizing patient care in high-pressure situations.",
    type: "article",
    category: "Critical Care",
    difficultyLevel: "advanced",
    estimatedTime: 20,
    link: "/learning/prioritization-critical-care"
  },
  {
    id: "3",
    title: "Medication Administration Safety",
    description: "Review the essential steps for safe medication administration with this interactive tutorial.",
    type: "practice",
    category: "Fundamentals",
    difficultyLevel: "beginner",
    estimatedTime: 10,
    link: "/learning/medication-safety"
  },
  {
    id: "4",
    title: "Heart Sounds and Murmurs",
    description: "Audio guide to identifying normal and abnormal heart sounds for accurate cardiac assessment.",
    type: "video",
    category: "Cardiac",
    difficultyLevel: "intermediate",
    estimatedTime: 25,
    link: "/learning/heart-sounds"
  },
  {
    id: "5",
    title: "Diabetes Management Updates",
    description: "Latest evidence-based practices for managing diabetes and preventing complications.",
    type: "article",
    category: "Endocrine",
    difficultyLevel: "intermediate",
    estimatedTime: 15,
    link: "/learning/diabetes-updates"
  },
  {
    id: "6",
    title: "Pediatric Medication Calculations",
    description: "Practice pediatric dosage calculations with step-by-step examples and interactive problems.",
    type: "practice",
    category: "Pediatrics",
    difficultyLevel: "intermediate",
    estimatedTime: 20,
    link: "/learning/pediatric-calculations"
  },
  {
    id: "7",
    title: "Understanding Sepsis Protocols",
    description: "Learn current sepsis identification criteria and evidence-based treatment protocols.",
    type: "concept",
    category: "Med-Surg",
    difficultyLevel: "advanced",
    estimatedTime: 30,
    link: "/learning/sepsis-protocols",
    isNew: true
  },
  {
    id: "8",
    title: "ECG Interpretation Basics",
    description: "Master the fundamentals of ECG reading and rhythm identification.",
    type: "video",
    category: "Cardiac",
    difficultyLevel: "beginner",
    estimatedTime: 45,
    link: "/learning/ecg-basics",
    featured: true
  },
  {
    id: "9",
    title: "Respiratory Assessment Techniques",
    description: "Comprehensive guide to thorough respiratory assessments and interpretation of findings.",
    type: "video",
    category: "Respiratory",
    difficultyLevel: "intermediate",
    estimatedTime: 20,
    link: "/learning/respiratory-assessment"
  },
  {
    id: "10",
    title: "Neurological Assessment",
    description: "Step-by-step guide to performing accurate neurological assessments.",
    type: "practice",
    category: "Neurology",
    difficultyLevel: "intermediate",
    estimatedTime: 25,
    link: "/learning/neuro-assessment"
  },
  {
    id: "11",
    title: "Wound Care and Dressing Selection",
    description: "Evidence-based approaches to wound assessment and appropriate dressing selection.",
    type: "article",
    category: "Med-Surg",
    difficultyLevel: "intermediate",
    estimatedTime: 15,
    link: "/learning/wound-care"
  },
  {
    id: "12",
    title: "Pain Management Strategies",
    description: "Multimodal approaches to effective pain management across different patient populations.",
    type: "concept",
    category: "Pharmacology",
    difficultyLevel: "intermediate",
    estimatedTime: 20,
    link: "/learning/pain-management"
  },
  {
    id: "13",
    title: "Fluid and Electrolyte Balance",
    description: "Understanding fluid balance, electrolyte disturbances, and appropriate interventions.",
    type: "concept",
    category: "Fundamentals",
    difficultyLevel: "intermediate",
    estimatedTime: 30,
    link: "/learning/fluid-electrolytes"
  },
  {
    id: "14",
    title: "Postpartum Assessment",
    description: "Comprehensive guide to maternal assessment in the postpartum period.",
    type: "practice",
    category: "Maternity",
    difficultyLevel: "beginner",
    estimatedTime: 15,
    link: "/learning/postpartum-assessment"
  },
  {
    id: "15",
    title: "Mental Health Assessment",
    description: "Techniques for conducting thorough mental health assessments and risk evaluations.",
    type: "article",
    category: "Psychiatric",
    difficultyLevel: "intermediate",
    estimatedTime: 20,
    link: "/learning/mental-health-assessment"
  }
];