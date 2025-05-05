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
import { QuizContent } from './QuizContent';

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
            safety and follow established protocols. Documentation of your assessments, interventions,
            and patient responses is critical for continuity of care.
          </p>
        </>
      );
    }
  };
  
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="prose max-w-none">
          {getMainContent()}
        </div>
        
        {node.url && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              <span>Additional Learning Resources</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoContent = ({ node }: { node: LearningPathNode }) => {
  // Show embedded video or a link to external video content
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        {node.url ? (
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <iframe
              src={node.url.includes('youtube') 
                ? node.url.replace('watch?v=', 'embed/') 
                : node.url
              }
              title={node.title}
              allowFullScreen
              className="w-full h-full rounded-md"
            ></iframe>
          </div>
        ) : (
          <div className="bg-gray-100 flex items-center justify-center rounded-md p-12">
            <div className="text-center text-gray-500">
              <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>Video content is not available.</p>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-lg font-medium mb-2">Key Points from this Video</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Understanding the fundamental principles presented in the video</li>
            <li>Applying critical thinking to the clinical scenarios shown</li>
            <li>Connecting theoretical knowledge with practical applications</li>
            <li>Recognizing assessment techniques and appropriate interventions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const FlashcardContent = ({ node }: { node: LearningPathNode }) => {
  // State for flashcard interactions
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<number[]>([]);
  
  // Sample flashcards (would be loaded from node.content in a real app)
  const flashcards = [
    {
      front: 'What are the 5 rights of medication administration?',
      back: 'Right patient, right drug, right dose, right route, and right time. Additional rights include right documentation, right reason, and right response.'
    },
    {
      front: 'What is the ABCs assessment framework?',
      back: 'Airway, Breathing, Circulation. This is a primary assessment framework used to quickly evaluate and prioritize patient care needs.'
    },
    {
      front: 'What is the normal range for adult respiratory rate?',
      back: '12-20 breaths per minute. Tachypnea is > 20 breaths/min. Bradypnea is < 12 breaths/min.'
    },
    {
      front: 'What are the symptoms of hypoglycemia?',
      back: 'Shakiness, sweating, irritability, confusion, rapid heartbeat, dizziness, hunger, weakness, headache, and in severe cases, loss of consciousness.'
    },
    {
      front: 'What is the first action when a patient shows signs of anaphylaxis?',
      back: 'Administer epinephrine (via auto-injector or as prescribed), position the patient, maintain airway, and activate emergency response system.'
    }
  ];
  
  const handleNextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };
  
  const handlePreviousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
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
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Study Flashcards</h3>
          <div className="text-sm text-gray-500">
            Card {currentCard + 1} of {flashcards.length}
          </div>
        </div>
        
        <div 
          className={`relative h-64 mb-6 cursor-pointer transition-transform duration-500 ${flipped ? 'transform rotate-y-180' : ''}`}
          onClick={() => setFlipped(!flipped)}
        >
          <div className={`absolute inset-0 p-6 rounded-lg border border-gray-200 flex items-center justify-center transition-opacity duration-500 ${flipped ? 'opacity-0 pointer-events-none' : 'bg-blue-50'}`}>
            <div className="text-center">
              <p className="text-lg font-medium">{flashcards[currentCard].front}</p>
              <p className="text-xs text-gray-500 mt-4">Click to flip</p>
            </div>
          </div>
          
          <div className={`absolute inset-0 p-6 rounded-lg border border-gray-200 flex items-center justify-center transition-opacity duration-500 ${flipped ? 'bg-green-50' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-center">
              <p>{flashcards[currentCard].back}</p>
              <p className="text-xs text-gray-500 mt-4">Click to flip back</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePreviousCard}
            disabled={currentCard === 0}
            className={`px-4 py-2 rounded-md ${
              currentCard === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={() => toggleMastered(currentCard)}
            className={`px-4 py-2 rounded-md ${
              mastered.includes(currentCard)
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mastered.includes(currentCard) ? 'Mastered ✓' : 'Mark as Mastered'}
          </button>
          
          <button
            onClick={handleNextCard}
            disabled={currentCard === flashcards.length - 1}
            className={`px-4 py-2 rounded-md ${
              currentCard === flashcards.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
        
        <div className="flex justify-center mt-4">
          {flashcards.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 mx-1 rounded-full ${
                index === currentCard
                  ? 'bg-blue-600'
                  : mastered.includes(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PracticeContent = ({ node }: { node: LearningPathNode }) => {
  // State for interactive practice
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Sample practice scenario
  const practiceScenario = {
    title: "Clinical Decision-Making Practice",
    scenario: "A 65-year-old patient is admitted with shortness of breath, productive cough, and fever for 3 days. Vital signs: T 101.2°F, HR 110, RR 24, BP 138/84, O2 sat 91% on room air. Based on your assessment, what is your priority nursing action?",
    options: [
      { id: "A", text: "Administer prescribed antibiotics" },
      { id: "B", text: "Apply oxygen at 2-3L via nasal cannula" },
      { id: "C", text: "Collect a sputum specimen for culture" },
      { id: "D", text: "Document vital signs in the chart" }
    ],
    correctOption: "B",
    rationale: "The patient has signs of respiratory distress with an oxygen saturation of 91% on room air. Providing supplemental oxygen addresses the immediate physiological need for oxygenation and corrects hypoxemia. While antibiotics are important for treating the underlying infection, oxygen therapy is the priority to address the urgent physiological need according to Maslow's hierarchy and the ABCs (Airway, Breathing, Circulation) approach."
  };
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleSubmit = () => {
    setShowFeedback(true);
  };
  
  const handleTryAgain = () => {
    setSelectedOption(null);
    setShowFeedback(false);
  };
  
  return (
    <div>
      <ContentHeader title={node.title} />
      <p className="mb-6">{node.description}</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h3 className="text-lg font-medium mb-4">{practiceScenario.title}</h3>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p>{practiceScenario.scenario}</p>
        </div>
        
        <div className="space-y-3 mb-6">
          {practiceScenario.options.map(option => (
            <div
              key={option.id}
              onClick={() => !showFeedback && handleOptionSelect(option.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === option.id
                  ? showFeedback
                    ? option.id === practiceScenario.correctOption
                      ? 'bg-green-100 border-green-300'
                      : 'bg-red-100 border-red-300'
                    : 'bg-blue-50 border-blue-300'
                  : 'hover:bg-gray-50 border-gray-200'
              } ${showFeedback && option.id === practiceScenario.correctOption && 'bg-green-100 border-green-300'}`}
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                    selectedOption === option.id
                      ? showFeedback
                        ? option.id === practiceScenario.correctOption
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } ${showFeedback && option.id === practiceScenario.correctOption && 'bg-green-500 text-white'}`}
                >
                  {option.id}
                </div>
                <span>{option.text}</span>
              </div>
            </div>
          ))}
        </div>
        
        {showFeedback ? (
          <div>
            <div className={`p-4 rounded-lg mb-4 ${
              selectedOption === practiceScenario.correctOption
                ? 'bg-green-50 border-l-4 border-green-500'
                : 'bg-yellow-50 border-l-4 border-yellow-500'
            }`}>
              <h4 className={`font-medium mb-2 ${
                selectedOption === practiceScenario.correctOption
                  ? 'text-green-800'
                  : 'text-yellow-800'
              }`}>
                {selectedOption === practiceScenario.correctOption
                  ? 'Correct!'
                  : 'Not quite right.'}
              </h4>
              <p className={selectedOption === practiceScenario.correctOption ? 'text-green-800' : 'text-yellow-800'}>
                {practiceScenario.rationale}
              </p>
            </div>
            
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Another Scenario
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`px-4 py-2 rounded-md ${
              !selectedOption
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Submit Answer
          </button>
        )}
      </div>
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
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Patient Information</h4>
            <p>
              <strong>Name:</strong> J.D., a 68-year-old male
            </p>
            <p className="mt-2">
              <strong>Chief Complaint:</strong> Shortness of breath, chest discomfort, fatigue
            </p>
            <p className="mt-2">
              <strong>Vital Signs:</strong> BP 162/94, HR 92, RR 24, Temp 99.1°F, O2 sat 94% on RA
            </p>
            <p className="mt-2">
              <strong>Medical History:</strong> Hypertension, Type 2 Diabetes, COPD
            </p>
            <p className="mt-2">
              <strong>Current Medications:</strong> Lisinopril 20mg daily, Metformin 1000mg BID, Albuterol inhaler PRN
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-3">Interactive Assessment</h4>
            <p className="mb-3">
              Based on the patient information, what are your priority assessments and interventions?
            </p>
            
            <div className="space-y-2">
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium text-gray-700">1</div>
                  <span>Perform a focused respiratory assessment including lung sounds</span>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium text-gray-700">2</div>
                  <span>Obtain a 12-lead ECG to assess for cardiac involvement</span>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium text-gray-700">3</div>
                  <span>Check capillary blood glucose level</span>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium text-gray-700">4</div>
                  <span>Administer supplemental oxygen to maintain O2 saturation &gt; 94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium mb-3">Additional Learning Scenarios</h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium mb-2">Scenario 1</h5>
              <p className="text-gray-700 mb-3">
                The patient reveals that his chest discomfort worsens with exertion and improves with rest. 
                How does this additional information change your assessment priorities?
              </p>
              <a href="#" className="text-blue-600 text-sm hover:underline">Explore this scenario →</a>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium mb-2">Scenario 2</h5>
              <p className="text-gray-700 mb-3">
                You are caring for a post-operative patient who reports pain at 7/10 despite receiving 
                prescribed analgesics an hour ago. What assessments would you perform?
              </p>
              <a href="#" className="text-blue-600 text-sm hover:underline">Explore this scenario →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component to display learning content based on resource type
export function LearningContent({ node }: { node: LearningPathNode }) {
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
        return (
          <div>
            <ContentHeader title={node.title} />
            <p className="mb-6">{node.description}</p>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
              <p>This content type is not supported.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-6">
      {renderContent()}
    </div>
  );
}