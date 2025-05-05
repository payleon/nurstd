import React, { useState } from 'react';
import { 
  CheckCircle, 
  Loader2,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  MousePointer,
  Zap,
  PenTool
} from 'lucide-react';
import { LearningPathNode } from '@/lib/learning-path';

// Resource type icons
const resourceIcons = {
  video: Video,
  article: FileText,
  quiz: HelpCircle,
  interactive: MousePointer,
  flashcard: Zap,
  practice: PenTool,
};

// Generic card content components
const ContentHeader = ({ title }: { title: string }) => (
  <h3 className="text-xl font-semibold text-blue-900 mb-3">{title}</h3>
);

const ArticleContent = ({ node }: { node: LearningPathNode }) => {
  // Generate article content based on node data and topic
  // Extract keywords from the title for more specific content
  const titleLower = node.title.toLowerCase();
  const isAboutPharmacology = titleLower.includes('pharmac') || titleLower.includes('medication') || titleLower.includes('drug');
  const isAboutPrioritization = titleLower.includes('priorit') || titleLower.includes('triage');
  const isAboutAssessment = titleLower.includes('assess') || titleLower.includes('exam');
  const isAboutDisease = titleLower.includes('disease') || titleLower.includes('disorder') || titleLower.includes('syndrome');
  const isAboutCare = titleLower.includes('care') || titleLower.includes('intervention') || titleLower.includes('treatment');
  
  // Generate customized content based on topic type
  const getMainContent = () => {
    if (isAboutPharmacology) {
      return (
        <>
          <p className="mb-4">
            Pharmacological interventions are a critical aspect of nursing care. Understanding 
            medication classifications, mechanisms of action, side effects, and nursing 
            considerations is essential for safe and effective medication administration.
          </p>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Key Pharmacology Concepts</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>Medication classifications and their general effects</li>
            <li>Common side effects and adverse reactions to monitor</li>
            <li>Drug interactions and contraindications</li>
            <li>Proper administration techniques and routes</li>
            <li>Patient education requirements for medication management</li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <h5 className="font-medium text-yellow-800">Important Nursing Considerations</h5>
            <p className="text-yellow-800 mt-1">
              Always check the "rights" of medication administration: right patient, right medication, 
              right dose, right route, right time, right documentation, right reason, and right response.
            </p>
          </div>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Critical Thinking in Pharmacology</h4>
          <p>
            When administering medications, nurses must consider the patient's complete 
            clinical picture, including comorbidities, laboratory values, and potential drug interactions.
            The nurse should also know why a medication is being given and what expected outcomes
            and adverse effects to monitor for.
          </p>
        </>
      );
    } else if (isAboutPrioritization) {
      return (
        <>
          <p className="mb-4">
            Prioritization is a critical nursing skill that involves determining which patient 
            or intervention requires immediate attention. This skill is essential for effective 
            time management and ensuring optimal patient outcomes in complex healthcare settings.
          </p>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Frameworks for Prioritization</h4>
          <div className="space-y-4 mb-4">
            <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
              <h5 className="font-medium">Maslow's Hierarchy of Needs</h5>
              <p className="mt-1 text-gray-700">
                Prioritize physiological needs (oxygen, circulation) before safety, love/belonging, 
                esteem, and self-actualization needs.
              </p>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
              <h5 className="font-medium">ABCs Framework</h5>
              <p className="mt-1 text-gray-700">
                Prioritize Airway, then Breathing, then Circulation, followed by Disability 
                and Exposure.
              </p>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-500">
              <h5 className="font-medium">Nursing Process</h5>
              <p className="mt-1 text-gray-700">
                Use Assessment, Diagnosis, Planning, Implementation, and Evaluation to 
                systematically approach patient care.
              </p>
            </div>
          </div>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Application to Clinical Scenarios</h4>
          <p>
            When faced with multiple patients requiring care, or multiple tasks to complete, 
            first address life-threatening issues, then potentially harmful situations, 
            followed by health promotion and maintenance activities.
          </p>
        </>
      );
    } else if (isAboutAssessment) {
      return (
        <>
          <p className="mb-4">
            Assessment is the first and most critical step of the nursing process. A thorough 
            assessment provides the foundation for all subsequent nursing interventions and 
            care planning.
          </p>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Components of a Comprehensive Assessment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <h5 className="font-medium text-blue-800">Physical Assessment</h5>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>Vital signs</li>
                <li>Head-to-toe examination</li>
                <li>System-specific assessment</li>
                <li>Pain assessment</li>
              </ul>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <h5 className="font-medium text-green-800">Psychosocial Assessment</h5>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>Mental status</li>
                <li>Social support</li>
                <li>Cultural considerations</li>
                <li>Coping mechanisms</li>
              </ul>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <h5 className="font-medium text-purple-800">Developmental Assessment</h5>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>Age-appropriate milestones</li>
                <li>Growth parameters</li>
                <li>Developmental screening</li>
              </ul>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <h5 className="font-medium text-amber-800">Functional Assessment</h5>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>Activities of daily living</li>
                <li>Mobility and dexterity</li>
                <li>Sensory function</li>
                <li>Nutritional status</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Assessment Techniques</h4>
          <p>
            Use inspection, palpation, percussion, and auscultation in a systematic manner. 
            Always compare bilateral findings and note deviations from normal parameters.
          </p>
        </>
      );
    } else if (isAboutDisease) {
      return (
        <>
          <p className="mb-4">
            Understanding pathophysiology is crucial for nurses to provide appropriate care, 
            anticipate complications, and educate patients about their conditions.
          </p>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Key Pathophysiological Concepts</h4>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Concept</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Nursing Implications</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Inflammation</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Monitor for cardinal signs (redness, heat, swelling, pain, loss of function). 
                    Implement anti-inflammatory interventions as ordered.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Ischemia</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Assess for signs of decreased tissue perfusion. Implement interventions 
                    to improve circulation and oxygenation.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Necrosis</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Identify signs of tissue death. Implement wound care protocols and 
                    prevent infection.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Immune Response</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Monitor for signs of infection or immune dysregulation. Implement 
                    infection control measures.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Clinical Manifestations</h4>
          <p>
            Understanding the clinical manifestations of diseases allows for early 
            recognition of complications and prompt intervention. Always correlate 
            symptoms with underlying pathophysiological changes.
          </p>
        </>
      );
    } else if (isAboutCare) {
      return (
        <>
          <p className="mb-4">
            Nursing interventions are actions that nurses take to implement the plan of care, 
            monitor patient responses, and achieve positive patient outcomes.
          </p>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Types of Nursing Interventions</h4>
          <div className="space-y-3 mb-6">
            <div className="flex">
              <div className="bg-blue-500 text-white p-2 rounded-l-md flex items-center justify-center w-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-white p-3 rounded-r-md shadow-sm border-t border-r border-b border-gray-200 flex-1">
                <h5 className="font-medium">Independent Interventions</h5>
                <p className="text-sm mt-1">
                  Actions the nurse can take without a provider's order, such as positioning, 
                  hygiene care, and patient education.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="bg-green-500 text-white p-2 rounded-l-md flex items-center justify-center w-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="bg-white p-3 rounded-r-md shadow-sm border-t border-r border-b border-gray-200 flex-1">
                <h5 className="font-medium">Dependent Interventions</h5>
                <p className="text-sm mt-1">
                  Actions that require a provider's order, such as medication administration, 
                  treatments, and certain procedures.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="bg-purple-500 text-white p-2 rounded-l-md flex items-center justify-center w-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="bg-white p-3 rounded-r-md shadow-sm border-t border-r border-b border-gray-200 flex-1">
                <h5 className="font-medium">Collaborative Interventions</h5>
                <p className="text-sm mt-1">
                  Actions that involve coordination with other healthcare team members, 
                  such as discharge planning and interdisciplinary care conferences.
                </p>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Evidence-Based Practice</h4>
          <p>
            Nursing interventions should be based on the best available evidence, clinical expertise, 
            and patient preferences. Regularly review current research and clinical guidelines to 
            ensure interventions are up-to-date and effective.
          </p>
        </>
      );
    } else {
      // Default content for other topics
      return (
        <>
          <p className="mb-4">
            This content explains core concepts related to {node.title.toLowerCase()}. 
            Understanding these principles is essential for nursing practice and NCLEX preparation.
          </p>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Key Concepts</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>Assessment and evaluation techniques</li>
            <li>Evidence-based nursing interventions</li>
            <li>Critical thinking in clinical scenarios</li>
            <li>Patient-centered communication strategies</li>
          </ul>
          
          <h4 className="text-lg font-medium mt-6 mb-2">Clinical Application</h4>
          <p>
            When applying these concepts in clinical practice, remember to prioritize patient 
            safety and follow established protocols. Documentation is critical for continuity of care.
          </p>
          
          <h4 className="text-lg font-medium mt-6 mb-2">NCLEX Preparation Strategies</h4>
          <div className="bg-gray-50 p-4 rounded-md space-y-2 mb-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Review content systematically using a comprehensive study plan</span>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Practice application questions that require critical thinking</span>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Focus on understanding rationales for both correct and incorrect answers</span>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Simulate test-taking conditions with timed practice exams</span>
            </div>
          </div>
        </>
      );
    }
  };
  
  return (
    <div className="prose max-w-none">
      <ContentHeader title={node.title} />
      <p className="mb-4">{node.description}</p>
      
      {/* Generated article content based on the node title/description */}
      {getMainContent()}
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-6">
        <h4 className="text-md font-medium text-blue-800 mb-2">NCLEX Tip</h4>
        <p className="text-blue-800">
          When answering NCLEX questions on this topic, remember to apply the nursing process 
          and consider patient safety as your highest priority. Focus on assessment data and 
          recognizing abnormal findings that require intervention.
        </p>
      </div>
      
      {node.url && (
        <div className="mt-6">
          <a 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>Additional Resource</span>
          </a>
        </div>
      )}
    </div>
  );
};

const VideoContent = ({ node }: { node: LearningPathNode }) => {
  // Show embedded content and/or link to video
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-4">{node.description}</p>
      
      {node.url && node.url.includes('youtube.com') ? (
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe 
            className="w-full h-72 rounded-lg border border-gray-200"
            src={node.url.replace('watch?v=', 'embed/')} 
            title={node.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg mb-4 text-center flex flex-col items-center justify-center min-h-[200px]">
          <Video className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600 mb-2">Video content preview</p>
          {node.url && (
            <a 
              href={node.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Watch Video</span>
            </a>
          )}
        </div>
      )}
      
      <div className="prose max-w-none mt-4">
        <h4 className="text-lg font-medium mb-2">Video Summary</h4>
        <p>
          This video covers key concepts related to {node.title.toLowerCase()}, 
          including assessment techniques, interventions, and patient care considerations.
        </p>
        
        <h4 className="text-lg font-medium mt-4 mb-2">Learning Objectives</h4>
        <ul className="list-disc pl-5">
          <li>Understand the fundamental principles of {node.title.toLowerCase()}</li>
          <li>Apply critical thinking to related clinical scenarios</li>
          <li>Identify key assessment findings and appropriate interventions</li>
          <li>Recognize complications and appropriate nursing responses</li>
        </ul>
      </div>
    </div>
  );
};

const QuizContent = ({ node }: { node: LearningPathNode }) => {
  // State management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Generate topic-specific quiz questions
  const titleLower = node.title.toLowerCase();
  
  // Sample questions based on topic
  const questions = [
    {
      question: `Which of the following best describes a key principle of ${node.title}?`,
      options: [
        'Focusing exclusively on medical interventions',
        'Prioritizing patient needs based on assessment data',
        'Delegating all care responsibilities to support staff',
        'Documenting only when adverse events occur'
      ],
      correctAnswer: 1,
      rationale: "Prioritizing patient needs based on assessment data is a fundamental nursing principle that emphasizes evidence-based, patient-centered care."
    },
    {
      question: 'Which nursing action demonstrates appropriate clinical judgment?',
      options: [
        'Implementing interventions without assessing the patient',
        'Following the care plan without considering changes in patient status',
        'Assessing the patient\'s response to interventions and adjusting care accordingly',
        'Documenting findings without reporting abnormal results'
      ],
      correctAnswer: 2,
      rationale: "Clinical judgment involves continuous assessment and adaptation. Assessing the patient's response to interventions and adjusting care accordingly demonstrates the iterative nature of the nursing process."
    },
    {
      question: 'A priority nursing intervention for a patient with decreased tissue perfusion would be:',
      options: [
        'Administering prescribed oxygen therapy',
        'Documenting vital signs every shift',
        'Scheduling family visits',
        'Planning discharge education'
      ],
      correctAnswer: 0,
      rationale: "For decreased tissue perfusion, improving oxygenation is the priority intervention to prevent tissue hypoxia and further complications."
    }
  ];
  
  // Event handlers
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
    setShowExplanation(true);
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };
  
  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanation(false);
  };
  
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  return (
    <div className="quiz-content">
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        {!showResults ? (
          // Quiz interface
          <>
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <HelpCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium">Assessment Quiz: {node.title}</h3>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div 
                className="h-1.5 rounded-full bg-blue-600"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">
                {questions[currentQuestion].question}
              </h4>
              
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestion] === optionIndex
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs font-medium ${
                        selectedAnswers[currentQuestion] === optionIndex 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Explanation section, shown after selecting an answer */}
              {showExplanation && selectedAnswers[currentQuestion] !== undefined && (
                <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h5 className="font-medium text-blue-800 mb-1">Explanation</h5>
                  <p className="text-blue-800">
                    {questions[currentQuestion].rationale}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className={`px-4 py-2 rounded-md flex items-center ${
                  selectedAnswers[currentQuestion] === undefined
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    View Results
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          // Results interface
          <>
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Quiz Results</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              You've completed the quiz on {node.title}! Here's how you did:
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-6">
              <div className="relative h-40 w-40 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600">{calculateScore()}%</span>
                    <p className="text-sm text-gray-500 mt-1">
                      {Object.keys(selectedAnswers).filter(idx => 
                        selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                      ).length} of {questions.length} correct
                    </p>
                  </div>
                </div>
                <svg className="h-40 w-40" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${calculateScore()}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex-1">
                <h4 className="font-medium text-blue-800 mb-2">
                  Performance Analysis
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Correct Answers</span>
                      <span className="font-medium">
                        {Object.keys(selectedAnswers).filter(idx => 
                          selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                        ).length} of {questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-600"
                        style={{ 
                          width: `${(Object.keys(selectedAnswers).filter(idx => 
                            selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                          ).length / questions.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-blue-800 mb-2">Score Interpretation</h5>
                    <p className="text-blue-800 text-sm">
                      {calculateScore() >= 80 
                        ? "Excellent work! You demonstrate a strong understanding of the concepts covered in this topic."
                        : calculateScore() >= 60
                          ? "Good job! You've grasped many key concepts, but there are some areas you could review further."
                          : "This is a topic you should focus more study time on. Consider reviewing the explanations and resources provided."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
              {node.url && (
                <a 
                  href={node.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Additional Resources
                </a>
              )}
            </div>
          </>
        )}
      </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-6">
            <div className="relative h-40 w-40 flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-600">{calculateScore()}%</span>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round((Object.keys(selectedAnswers).filter(idx => 
                      selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                    ).length / questions.length) * 100)}% Accuracy
                  </p>
                </div>
              </div>
              <svg className="h-40 w-40" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${calculateScore()}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex-1">
              <h4 className="font-medium text-blue-800 mb-2">Performance Analysis</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Correct Answers</span>
                    <span className="font-medium">
                      {Object.keys(selectedAnswers).filter(idx => 
                        selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                      ).length} of {questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-600"
                      style={{ 
                        width: `${(Object.keys(selectedAnswers).filter(idx => 
                          selectedAnswers[parseInt(idx)] === questions[parseInt(idx)].correctAnswer
                        ).length / questions.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Time</span>
                    <span className="font-medium">
                      {formatTime((difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45) * questions.length - timer)} / {formatTime((difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45) * questions.length)}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-600"
                      style={{ 
                        width: `${(((difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45) * questions.length - timer) / ((difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45) * questions.length)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Difficulty Level</span>
                    <span className={`font-medium ${
                      difficulty === 'easy' 
                        ? 'text-green-600' 
                        : difficulty === 'medium' 
                          ? 'text-blue-600' 
                          : 'text-red-600'
                    }`}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleReview}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Review Questions & Explanations
            </button>
            
            <button
              onClick={handleRestartQuiz}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restart Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Question Review</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className={`p-1 rounded-full ${
                  currentQuestion === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-500">
                {currentQuestion + 1} of {questions.length}
              </span>
              <button
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === questions.length - 1}
                className={`p-1 rounded-full ${
                  currentQuestion === questions.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">
              {currentQuestion + 1}. {questions[currentQuestion].question}
            </h4>
            
            <div className="space-y-2 mb-6">
              {questions[currentQuestion].options.map((option, optionIndex) => (
                <div 
                  key={optionIndex} 
                  className={`p-3 rounded-md ${
                    selectedAnswers[currentQuestion] === optionIndex 
                      ? optionIndex === questions[currentQuestion].correctAnswer 
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-red-100 border border-red-300'
                      : optionIndex === questions[currentQuestion].correctAnswer
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-medium ${
                      optionIndex === questions[currentQuestion].correctAnswer 
                        ? 'bg-green-500 text-white' 
                        : selectedAnswers[currentQuestion] === optionIndex 
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + optionIndex)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h5 className="font-medium text-blue-800 mb-1">Rationale</h5>
              <p className="text-blue-800">
                {questions[currentQuestion].rationale}
              </p>
            </div>
            
            {selectedAnswers[currentQuestion] !== questions[currentQuestion].correctAnswer && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <h5 className="font-medium text-yellow-800 mb-1">Study Tip</h5>
                <p className="text-yellow-800">
                  Review this concept again, focusing on understanding why the correct answer is {String.fromCharCode(65 + questions[currentQuestion].correctAnswer)}. 
                  Consider how this information applies in clinical scenarios.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Results
            </button>
            
            {node.url && (
              <a 
                href={node.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span>Additional Resources</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className={`text-sm font-medium ${
              timer <= 15 ? 'text-red-600' : timer <= 30 ? 'text-yellow-600' : 'text-gray-600'
            } flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(timer)}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
            <div 
              className={`h-1.5 rounded-full ${
                currentQuestion / questions.length < 0.33 
                  ? 'bg-blue-600' 
                  : currentQuestion / questions.length < 0.66 
                    ? 'bg-green-600' 
                    : 'bg-purple-600'
              }`}
              style={{ width: `${(currentQuestion / (questions.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-medium ${
                      selectedAnswers[currentQuestion] === index 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {showHint && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <h4 className="font-medium text-yellow-800 mb-1">Hint</h4>
                <p className="text-yellow-800">{questions[currentQuestion].hint}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>
            
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={`px-4 py-2 rounded-md flex items-center ${
                selectedAnswers[currentQuestion] === undefined
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Submit Quiz
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveContent = ({ node }: { node: LearningPathNode }) => {
  // Show interactive content (case study, drag and drop, etc.)
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-medium mb-4">Case Study: Patient Assessment</h3>
        
        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p>
              <strong>Patient:</strong> J.D., a 68-year-old male, admitted with shortness of breath, fatigue, and peripheral edema.
            </p>
            <p className="mt-2">
              <strong>Medical History:</strong> Hypertension, Type 2 Diabetes, COPD
            </p>
            <p className="mt-2">
              <strong>Vital Signs:</strong> BP 160/95, HR 98, RR 24, Temp 37.1°C, SpO2 91% on room air
            </p>
          </div>
          
          <p className="mb-4">
            Based on the assessment data, identify the priority nursing diagnosis and interventions.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Nursing Diagnosis: Impaired Gas Exchange</h4>
              <p className="mt-2 text-gray-600">Related to fluid overload and respiratory disease</p>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Nursing Diagnosis: Decreased Cardiac Output</h4>
              <p className="mt-2 text-gray-600">Related to fluid volume excess and increased cardiac workload</p>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Nursing Diagnosis: Activity Intolerance</h4>
              <p className="mt-2 text-gray-600">Related to imbalance between oxygen supply and demand</p>
            </div>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h4 className="font-medium text-green-800">Learning Point</h4>
            <p className="text-green-800 mt-2">
              When prioritizing care for patients with complex conditions, use the ABCs (Airway, Breathing, Circulation) 
              framework and Maslow's hierarchy of needs to determine which issues need immediate attention.
            </p>
          </div>
        </div>
        
        {node.url && (
          <div className="mt-6">
            <a 
              href={node.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Try More Interactive Cases</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const FlashcardContent = ({ node }: { node: LearningPathNode }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<number[]>([]);
  
  // Generate topic-specific flashcards based on node title
  const titleLower = node.title.toLowerCase();
  
  // Customize flashcards based on topic
  const getFlashcards = () => {
    if (titleLower.includes('pharmac') || titleLower.includes('medication') || titleLower.includes('drug')) {
      return [
        {
          front: 'What are the "rights" of medication administration?',
          back: 'Right patient, right medication, right dose, right route, right time, right documentation, right reason, and right response.'
        },
        {
          front: 'What is the purpose of a drug half-life?',
          back: 'Half-life is the time it takes for the concentration of a drug in the body to be reduced by 50%. It helps determine dosing frequency and duration of effect.'
        },
        {
          front: 'What is the difference between peak and trough levels?',
          back: 'Peak levels represent the highest concentration of a drug in the bloodstream, while trough levels represent the lowest concentration before the next dose.'
        },
        {
          front: 'What factors can influence drug absorption?',
          back: 'pH of the environment, blood flow to the site of administration, presence of food, drug formulation, and various patient factors like age and disease state.'
        }
      ];
    } else if (titleLower.includes('priorit') || titleLower.includes('triage')) {
      return [
        {
          front: 'What is the ABCs framework for prioritization?',
          back: 'Airway, Breathing, Circulation - addressing life-threatening needs first, followed by Disability and Exposure.'
        },
        {
          front: 'How does Maslow\'s Hierarchy apply to nursing prioritization?',
          back: 'Physiological needs (oxygen, food, water) are prioritized first, followed by safety, love/belonging, esteem, and self-actualization needs.'
        },
        {
          front: 'What patient would receive highest priority in triage?',
          back: 'A patient with compromised airway, breathing, or circulation that poses an immediate threat to life.'
        },
        {
          front: 'What is the nursing process and how does it relate to prioritization?',
          back: 'Assessment, Diagnosis, Planning, Implementation, Evaluation (ADPIE). Assessment findings drive the prioritization of nursing diagnoses and interventions.'
        }
      ];
    } else if (titleLower.includes('assess')) {
      return [
        {
          front: 'What are the four primary physical assessment techniques?',
          back: 'Inspection, palpation, percussion, and auscultation - performed in this sequence for most body systems.'
        },
        {
          front: 'What is the Glasgow Coma Scale used to assess?',
          back: 'Level of consciousness based on eye opening, verbal response, and motor response, with scores ranging from 3-15.'
        },
        {
          front: 'What are the components of a comprehensive pain assessment?',
          back: 'Location, intensity, quality, timing, aggravating/relieving factors, associated symptoms, and impact on functioning (PQRSTU).'
        },
        {
          front: 'What is the purpose of the FAST assessment in stroke?',
          back: 'Face drooping, Arm weakness, Speech difficulties, Time to call emergency services - helps identify signs of stroke quickly for rapid intervention.'
        }
      ];
    } else {
      // Default flashcards for general nursing topics
      return [
        {
          front: `What are the key components of ${node.title}?`,
          back: 'Assessment, planning, implementation, and evaluation - following the nursing process framework.'
        },
        {
          front: 'Which assessment findings would indicate a priority concern?',
          back: 'Changes in vital signs, decreased level of consciousness, or signs of respiratory distress require immediate intervention.'
        },
        {
          front: 'How does evidence-based practice impact nursing care?',
          back: 'Evidence-based practice ensures nursing interventions are based on current research, improving patient outcomes and standardizing care.'
        },
        {
          front: 'What documentation is essential when implementing nursing interventions?',
          back: 'Assessment findings, interventions performed, patient response to interventions, and any communication with healthcare team members.'
        }
      ];
    }
  };
  
  const flashcards = getFlashcards();
  
  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
  };
  
  const toggleFlip = () => {
    setFlipped(!flipped);
  };
  
  const toggleMastered = (index: number) => {
    if (mastered.includes(index)) {
      setMastered(mastered.filter(i => i !== index));
    } else {
      setMastered([...mastered, index]);
    }
  };
  
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-4">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            Flashcard Study: {node.title}
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Test your knowledge of key concepts related to this topic. Click on the flashcard to 
            reveal the answer, then mark it as mastered when you're confident with the material.
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="h-2.5 rounded-full bg-green-500"
              style={{ width: `${Math.round((mastered.length / flashcards.length) * 100)}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-600 mb-6 flex justify-between">
            <span>Progress: {mastered.length} of {flashcards.length} mastered</span>
            <span>{Math.round((mastered.length / flashcards.length) * 100)}% complete</span>
          </div>
        </div>
        
        <div className="mb-6 flex justify-center">
          <div 
            className="w-full max-w-lg h-64 cursor-pointer perspective-1000 relative"
            onClick={toggleFlip}
          >
            {/* Card counter badge */}
            <div className="absolute top-2 left-2 z-10 bg-white rounded-full px-2 py-1 text-xs font-medium shadow-sm border border-gray-200">
              {currentCard + 1} / {flashcards.length}
            </div>
            
            {/* Mastery badge */}
            <div 
              className={`absolute top-2 right-2 z-10 rounded-full p-1 cursor-pointer ${
                mastered.includes(currentCard) ? 'bg-green-100' : 'bg-gray-100'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleMastered(currentCard);
              }}
            >
              <svg 
                className={`h-6 w-6 ${mastered.includes(currentCard) ? 'text-green-600' : 'text-gray-400'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className={`relative w-full h-full duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
              {/* Front of card */}
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-blue-50 border-2 border-blue-300 rounded-xl p-6 flex flex-col justify-center shadow-lg">
                <p className="text-xl font-medium text-center text-blue-900">{flashcards[currentCard].front}</p>
                <div className="flex items-center justify-center mt-4">
                  <div className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-full px-3 py-1 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Tap to reveal answer
                  </div>
                </div>
              </div>
              
              {/* Back of card */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 rounded-xl p-6 flex flex-col justify-center shadow-lg">
                <p className="text-xl font-medium text-center text-blue-800">{flashcards[currentCard].back}</p>
                <div className="flex items-center justify-center mt-4">
                  <div className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-full px-3 py-1 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Tap to flip back
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
              currentCard === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <button
            onClick={() => toggleMastered(currentCard)}
            className={`px-4 py-2 border rounded-md flex items-center ${
              mastered.includes(currentCard)
                ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {mastered.includes(currentCard) ? (
              <>
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Mastered
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark as Mastered
              </>
            )}
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentCard === flashcards.length - 1}
            className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
              currentCard === flashcards.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {node.url && (
        <div className="mt-6">
          <a 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>More Flashcards</span>
          </a>
        </div>
      )}
    </div>
  );
};

const PracticeContent = ({ node }: { node: LearningPathNode }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [viewRationale, setViewRationale] = useState(false);
  const [userRanking, setUserRanking] = useState<string[]>(['A', 'B', 'C', 'D']);
  
  // Generate topic-specific practice based on node title
  const titleLower = node.title.toLowerCase();
  
  // Determine the type of practice content based on the title
  const isPrioritization = titleLower.includes('priorit') || titleLower.includes('triage');
  const isAssessment = titleLower.includes('assess') || titleLower.includes('exam');
  const isLabValues = titleLower.includes('lab') || titleLower.includes('value') || titleLower.includes('diagnostic');
  const isInterventions = titleLower.includes('intervention') || titleLower.includes('care') || titleLower.includes('treatment');
  
  // Reordering function for drag and drop
  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...userRanking];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setUserRanking(newOrder);
  };
  
  // Define the practice content components
  const renderPrioritizationContent = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Prioritization Exercise</h3>
        </div>
        
        <p className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3">
          You are assigned to care for the following four patients. Based on the information provided,
          rank these patients in order of priority (highest to lowest).
        </p>
        
        <div className="space-y-3 mb-6">
          {userRanking.map((patientLetter, index) => {
            const patient = {
              A: {
                description: '68-year-old male with chest pain, diaphoresis, and shortness of breath. BP 160/90, HR 110, RR 24.',
                priority: 'high',
                correctPosition: 0
              },
              B: {
                description: '45-year-old female recovering from appendectomy yesterday, reports pain at 4/10. Vital signs stable.',
                priority: 'medium',
                correctPosition: 1
              },
              C: {
                description: '78-year-old female with urinary tract infection, receiving IV antibiotics. Afebrile, vital signs stable.',
                priority: 'medium-low',
                correctPosition: 2
              },
              D: {
                description: '52-year-old male admitted for scheduled colonoscopy, awaiting procedure. No acute concerns.',
                priority: 'low',
                correctPosition: 3
              }
            }[patientLetter];
            
            // Define className based on state
            const isCorrectPosition = index === patient.correctPosition && showFeedback;
            const isIncorrectPosition = index !== patient.correctPosition && showFeedback;
            
            const baseClass = "border p-4 rounded-lg flex items-start gap-3 transition-all";
            const appearanceClass = isCorrectPosition
              ? "border-green-300 bg-green-50"
              : isIncorrectPosition
                ? "border-red-300 bg-red-50"
                : "border-gray-200 hover:bg-gray-50";
            
            return (
              <div 
                key={patientLetter}
                className={`${baseClass} ${appearanceClass} relative`}
              >
                {/* Priority indicator */}
                {showFeedback && (
                  <div className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${
                    isCorrectPosition ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {isCorrectPosition ? 'Correct Position' : 'Incorrect Position'}
                  </div>
                )}
                
                {/* Reordering controls */}
                {!showFeedback && (
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveItem(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className={`p-1 rounded-full ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => moveItem(index, Math.min(userRanking.length - 1, index + 1))}
                      disabled={index === userRanking.length - 1}
                      className={`p-1 rounded-full ${index === userRanking.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 text-sm font-medium ${
                      patient.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : patient.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : patient.priority === 'medium-low'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <h4 className="font-medium">Patient {patientLetter}</h4>
                  </div>
                  <p className="mt-1 text-gray-600">
                    {patient.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {!showFeedback ? (
          <button
            onClick={() => setShowFeedback(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check My Answer
          </button>
        ) : !viewRationale ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setViewRationale(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium w-full md:w-auto flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Rationale
            </button>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
            <h4 className="font-medium text-green-800">Priority Rationale</h4>
            <div className="space-y-2 mt-2 text-green-800">
              <p>
                <strong>1. Patient A:</strong> Highest priority due to symptoms suggestive of possible 
                acute coronary syndrome, which is potentially life-threatening and requires immediate attention.
              </p>
              <p>
                <strong>2. Patient B:</strong> Second priority due to recent surgery with pain. 
                Post-operative patients need assessment for potential complications like infection or bleeding.
              </p>
              <p>
                <strong>3. Patient C:</strong> Third priority as the patient is receiving appropriate 
                treatment for their condition and is currently stable.
              </p>
              <p>
                <strong>4. Patient D:</strong> Lowest priority as this is a scheduled procedure 
                with no acute concerns or immediate needs.
              </p>
              <p className="mt-4 font-medium">
                Using the ABCs framework (Airway, Breathing, Circulation), you would prioritize Patient A
                since they have potential circulatory and respiratory issues that could be life-threatening.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderAssessmentContent = () => {
    // Sample assessment exercise
    const assessmentScenario = {
      title: "Physical Assessment Case",
      description: "75-year-old female presenting with shortness of breath, productive cough, and fever for 3 days.",
      question: "Which assessment findings would be most important to document for this patient?",
      options: [
        {
          id: "a",
          text: "Family history of heart disease, medication compliance, and ankle edema",
          correct: false,
          feedback: "While these are important aspects of a complete assessment, they are not the most critical for a patient with respiratory symptoms."
        },
        {
          id: "b",
          text: "Vital signs, lung sounds, oxygen saturation, and sputum characteristics",
          correct: true,
          feedback: "Correct! These findings directly relate to the patient's respiratory symptoms and are essential for evaluating potential pneumonia or other respiratory conditions."
        },
        {
          id: "c",
          text: "Diet history, exercise tolerance, and sleep patterns",
          correct: false,
          feedback: "These are part of a holistic assessment but are not the highest priority for a patient with acute respiratory symptoms."
        },
        {
          id: "d",
          text: "Skin color, capillary refill, and peripheral pulses",
          correct: false,
          feedback: "While these circulatory assessments may be affected in severe respiratory distress, the respiratory findings would be more directly relevant."
        }
      ]
    };
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">{assessmentScenario.title}</h3>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <p className="italic">{assessmentScenario.description}</p>
        </div>
        
        <p className="font-medium mb-3">{assessmentScenario.question}</p>
        
        <div className="space-y-3 mb-6">
          {assessmentScenario.options.map(option => (
            <div 
              key={option.id}
              onClick={() => {
                if (!showFeedback) {
                  setSelectedOption(option.id);
                }
              }}
              className={`border p-4 rounded-lg cursor-pointer transition-all ${
                showFeedback 
                  ? option.correct 
                    ? 'border-green-300 bg-green-50' 
                    : selectedOption === option.id 
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 opacity-70'
                  : selectedOption === option.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 text-sm font-medium flex-shrink-0 ${
                  showFeedback 
                    ? option.correct 
                      ? 'bg-green-500 text-white' 
                      : selectedOption === option.id 
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    : selectedOption === option.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                }`}>
                  {option.id.toUpperCase()}
                </div>
                <div>
                  <p className={`${
                    showFeedback && option.correct ? 'font-medium' : ''
                  }`}>{option.text}</p>
                  
                  {showFeedback && selectedOption === option.id && (
                    <p className={`mt-2 text-sm ${option.correct ? 'text-green-700' : 'text-red-700'}`}>
                      {option.feedback}
                    </p>
                  )}
                  
                  {showFeedback && option.correct && selectedOption !== option.id && (
                    <p className="mt-2 text-sm text-green-700">
                      {option.feedback}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedOption && !showFeedback ? (
          <button
            onClick={() => setShowFeedback(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check My Answer
          </button>
        ) : showFeedback && (
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-medium text-blue-800">Clinical Application</h4>
            <p className="mt-2 text-blue-800">
              In respiratory assessment, focus on vital signs (especially respiratory rate, temperature, and oxygen saturation),
              lung sounds (crackles/rhonchi may indicate pneumonia), sputum characteristics (color can indicate infection),
              and work of breathing. These findings help determine the severity of the condition and guide appropriate interventions.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  // Default content fallback for other types
  const renderDefaultContent = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <PenTool className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium">Practice Exercise: {node.title}</h3>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p>
            This practice module will help you apply key concepts related to {node.title.toLowerCase()}.
            Work through the following scenarios to test your understanding and clinical reasoning skills.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Scenario 1</h4>
            <p className="text-gray-700 mb-3">
              A 62-year-old patient is admitted with congestive heart failure. Their current vital signs are: 
              BP 160/90, HR 95, RR 22, O2 sat 92% on room air. What nursing interventions would be appropriate?
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                  ✓
                </div>
                <p>Position the patient in high Fowler's position to decrease work of breathing</p>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                  ✓
                </div>
                <p>Administer oxygen as ordered and monitor oxygen saturation</p>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                  ✓
                </div>
                <p>Assess for peripheral edema and auscultate lung sounds</p>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                  ✗
                </div>
                <p>Administer a fluid bolus to improve circulation</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Scenario 2</h4>
            <p className="text-gray-700 mb-3">
              You are caring for a post-operative patient who reports pain at 7/10 despite receiving 
              pain medication one hour ago. What is your priority action?
            </p>
            
            <div className="mt-3 bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-gray-800">Clinical Reasoning:</p>
              <p className="text-gray-700 mt-1">
                The priority action is to perform a focused assessment to evaluate the nature and location 
                of the pain. Determine if the pain is surgical or could indicate a complication such as infection 
                or deep vein thrombosis. Check vital signs and the surgical site before contacting the provider 
                about adjusting the pain management regimen.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the appropriate content based on the topic
  const renderContent = () => {
    if (isPrioritization) {
      return renderPrioritizationContent();
    } else if (isAssessment) {
      return renderAssessmentContent();
    } else {
      return renderDefaultContent();
    }
  };
  
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        {renderContent()}
        
        {node.url && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <a 
              href={node.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>More Practice Exercises</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component to display learning content based on resource type
export function LearningContent({ node }: { node: LearningPathNode }) {
  // Add custom CSS for the flip card animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .perspective-1000 {
        perspective: 1000px;
      }
      .preserve-3d {
        transform-style: preserve-3d;
      }
      .backface-hidden {
        backface-visibility: hidden;
      }
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Display appropriate content based on resource type
  const renderContent = () => {
    switch (node.resourceType) {
      case 'article':
        return <ArticleContent node={node} />;
      case 'video':
        return <VideoContent node={node} />;
      case 'quiz':
        return <QuizContent node={node} />;
      case 'interactive':
        return <InteractiveContent node={node} />;
      case 'flashcard':
        return <FlashcardContent node={node} />;
      case 'practice':
        return <PracticeContent node={node} />;
      default:
        return <ArticleContent node={node} />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {renderContent()}
      
      {/* External link at bottom if needed */}
      {node.url && node.resourceType !== 'video' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">External resource:</p>
          <a 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>{node.url}</span>
          </a>
        </div>
      )}
    </div>
  );
}