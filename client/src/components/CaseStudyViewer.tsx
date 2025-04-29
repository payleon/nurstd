import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, FileText, Download, CheckCircle, XCircle, LightbulbIcon, BrainIcon, MessageCircleQuestion } from 'lucide-react';
import { Button } from './ui/button';
import { PulseIcon, MedicalCrossIcon, StethoscopeIcon } from '../assets/icons';

interface CaseStudyViewerProps {
  caseStudyId: string;
  onBack: () => void;
}

// Mock interface for case study content
interface CaseStudyContent {
  id: string;
  title: string;
  category: string;
  sections: {
    title: string;
    content: string;
  }[];
  nursingDiagnoses?: string[];
  learningObjectives?: string[];
  references?: string[];
  reflectionQuestions?: string[];
  knowledgeChecks?: {
    question: string;
    options: string[];
    correctOption: number;
    explanation: string;
  }[];
}

export function CaseStudyViewer({ caseStudyId, onBack }: CaseStudyViewerProps) {
  const [caseStudy, setCaseStudy] = useState<CaseStudyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'reflection' | 'knowledge'>('content');
  const [, setLocation] = useLocation();

  // Fetch case study data based on ID
  useEffect(() => {
    setLoading(true);
    
    // This would be replaced with an actual API call to fetch case study content
    // For now, we'll simulate loading with mock data
    const fetchCaseStudy = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data structure for the case study
        const mockCaseStudy: CaseStudyContent = {
          id: caseStudyId,
          title: "Acute Respiratory Distress Case",
          category: "Critical Care",
          sections: [
            {
              title: "Case Presentation",
              content: "Mr. Johnson, a 65-year-old male, presents to the emergency department with progressive dyspnea, fever, and cough for the past 3 days. His past medical history includes hypertension, type 2 diabetes mellitus, and a 40-pack-year smoking history. On admission, vital signs show: Temperature 39.2°C, HR 110 bpm, RR 28/min, BP 145/90 mmHg, and SpO2 88% on room air. Physical examination reveals bilateral crackles and diminished breath sounds. Chest X-ray shows bilateral infiltrates, and arterial blood gas analysis indicates hypoxemia with respiratory alkalosis."
            },
            {
              title: "Assessment",
              content: "The patient is diagnosed with Acute Respiratory Distress Syndrome (ARDS) secondary to community-acquired pneumonia. Laboratory results show elevated WBC count (15,000/µL), elevated CRP (120 mg/L), and a PaO2/FiO2 ratio of 150 mmHg. The patient is admitted to the ICU for closer monitoring and management."
            },
            {
              title: "Interventions",
              content: "Initial interventions include:\n\n1. Oxygen therapy with high-flow nasal cannula at 60L/min and FiO2 of 0.6\n2. Empiric broad-spectrum antibiotics (Ceftriaxone and Azithromycin)\n3. Fluid management with careful monitoring of intake and output\n4. Lung-protective mechanical ventilation strategy after deterioration requiring intubation\n5. Prone positioning for 16 hours per day\n6. Deep vein thrombosis prophylaxis\n7. Stress ulcer prophylaxis\n8. Sedation and pain management protocol\n9. Regular suctioning and pulmonary hygiene"
            },
            {
              title: "Nursing Considerations",
              content: "Key nursing considerations include:\n\n1. Hourly monitoring of vital signs and oxygen saturation\n2. Strict intake and output monitoring\n3. Regular assessment of respiratory status and work of breathing\n4. Careful positioning to optimize ventilation and prevent complications\n5. Assessment for signs of ventilator-associated pneumonia\n6. Monitoring for complications of mechanical ventilation\n7. Skin assessment while in prone position\n8. Implementation of ABCDEF bundle for ICU care\n9. Family education and psychological support\n10. Preparation for weaning from mechanical ventilation when appropriate"
            },
            {
              title: "Outcomes",
              content: "After 10 days in the ICU with lung-protective ventilation strategies and supportive care, the patient shows improvement in oxygenation with PaO2/FiO2 ratio increasing to 280 mmHg. The patient is successfully extubated and transitioned to high-flow nasal cannula with gradual weaning of oxygen requirements. After 15 days of hospitalization, the patient is discharged home on 2L nasal cannula with outpatient pulmonary follow-up."
            }
          ],
          nursingDiagnoses: [
            "Impaired Gas Exchange related to alveolar-capillary membrane changes",
            "Ineffective Breathing Pattern related to respiratory muscle fatigue",
            "Risk for Infection related to invasive procedures",
            "Risk for Impaired Skin Integrity related to immobility and prone positioning",
            "Anxiety related to dyspnea and critical illness",
            "Disturbed Sleep Pattern related to environmental factors in ICU"
          ],
          learningObjectives: [
            "Recognize clinical manifestations of ARDS",
            "Understand the pathophysiology of ARDS and its impact on gas exchange",
            "Implement appropriate nursing interventions for patients with ARDS",
            "Explain the rationale for lung-protective ventilation strategies",
            "Identify potential complications of mechanical ventilation and their prevention"
          ],
          references: [
            "ARDS Definition Task Force. (2012). Acute respiratory distress syndrome: the Berlin Definition. JAMA, 307(23), 2526-2533.",
            "Guérin, C., et al. (2013). Prone positioning in severe acute respiratory distress syndrome. New England Journal of Medicine, 368(23), 2159-2168.",
            "Papazian, L., et al. (2019). Formal guidelines: management of acute respiratory distress syndrome. Annals of Intensive Care, 9(1), 69."
          ],
          reflectionQuestions: [
            "What are the early clinical signs that would lead you to suspect ARDS in a patient with pneumonia?",
            "How would you explain the rationale for prone positioning to a family member who is concerned about this intervention?",
            "What nursing interventions would you prioritize for a patient with ARDS who is mechanically ventilated?",
            "How would you assess for readiness to wean from mechanical ventilation in a patient recovering from ARDS?",
            "What psychological support would you provide to a patient experiencing anxiety due to respiratory distress?"
          ],
          knowledgeChecks: [
            {
              question: "Which criterion is required for diagnosing ARDS according to the Berlin Definition?",
              options: [
                "Onset within 2 weeks of a known risk factor",
                "Bilateral infiltrates on chest imaging not explained by effusions or nodules", 
                "PaO2/FiO2 ratio ≤ 300 mmHg with PEEP ≥ 5 cmH2O", 
                "All of the above"
              ],
              correctOption: 3,
              explanation: "The Berlin Definition of ARDS includes all three criteria: onset within one week of a known clinical insult or new/worsening respiratory symptoms, bilateral opacities on imaging not fully explained by effusions, collapse, or nodules, and respiratory failure not fully explained by cardiac failure or fluid overload with a PaO2/FiO2 ratio ≤ 300 mmHg with PEEP or CPAP ≥ 5 cmH2O."
            },
            {
              question: "What is the primary goal of lung-protective ventilation strategies in ARDS?",
              options: [
                "To achieve normal CO2 levels", 
                "To prevent ventilator-induced lung injury (VILI)", 
                "To maximize oxygen delivery to tissues", 
                "To minimize sedation requirements"
              ],
              correctOption: 1,
              explanation: "The primary goal of lung-protective ventilation strategies is to prevent ventilator-induced lung injury (VILI) by limiting tidal volumes and airway pressures, which can worsen lung damage. This approach may lead to permissive hypercapnia (elevated CO2 levels) as a trade-off for reduced mechanical stress on the lungs."
            },
            {
              question: "Which of the following interventions is NOT typically recommended for patients with ARDS?",
              options: [
                "Prone positioning for severe ARDS", 
                "Fluid conservative management after initial resuscitation", 
                "High tidal volume ventilation (10-12 mL/kg predicted body weight)", 
                "Neuromuscular blockade for patients with severe ARDS"
              ],
              correctOption: 2,
              explanation: "High tidal volume ventilation (10-12 mL/kg) is not recommended for patients with ARDS. Current guidelines recommend using low tidal volumes (4-8 mL/kg predicted body weight) to reduce ventilator-induced lung injury. Prone positioning, conservative fluid management, and neuromuscular blockade are all evidence-based interventions for managing ARDS."
            }
          ]
        };
        
        setCaseStudy(mockCaseStudy);
      } catch (error) {
        console.error("Error fetching case study:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaseStudy();
  }, [caseStudyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="text-center py-10">
        <div className="mb-4">
          <FileText className="h-16 w-16 mx-auto text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-600">Case study not found</h3>
        <p className="text-gray-500 mt-2 mb-4">The requested case study could not be loaded</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case Studies
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case Studies
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#13294B]">{caseStudy.title}</h1>
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded">
                {caseStudy.category}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="mr-3">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" /> Print Case Study
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Section Navigation */}
        <div className="lg:col-span-1">
          <div className="neuro-card p-4 sticky top-4">
            <h3 className="font-bold text-[#13294B] mb-4 text-lg">Case Study Sections</h3>
            <nav>
              <ul className="space-y-2">
                {caseStudy.sections.map((section, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setActiveSection(index);
                        setActiveTab('content');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeSection === index && activeTab === 'content'
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Learning Activities */}
            <div className="mt-6">
              <h3 className="font-bold text-[#13294B] mb-4 text-lg">Learning Activities</h3>
              <nav>
                <ul className="space-y-2">
                  {caseStudy.reflectionQuestions && (
                    <li>
                      <button
                        onClick={() => setActiveTab('reflection')}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                          activeTab === 'reflection'
                            ? 'bg-green-100 text-green-800 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <MessageCircleQuestion className="h-4 w-4 mr-2" />
                        Reflection Questions
                      </button>
                    </li>
                  )}
                  {caseStudy.knowledgeChecks && (
                    <li>
                      <button
                        onClick={() => setActiveTab('knowledge')}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                          activeTab === 'knowledge'
                            ? 'bg-orange-100 text-orange-800 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <BrainIcon className="h-4 w-4 mr-2" />
                        Knowledge Checks
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'content' && (
            <>
              <div className="neuro-card p-6">
                <h2 className="text-2xl font-bold text-[#13294B] mb-4">{caseStudy.sections[activeSection].title}</h2>
                <div className="prose max-w-none">
                  {caseStudy.sections[activeSection].content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                {/* Section Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    disabled={activeSection === 0}
                    onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
                  >
                    Previous Section
                  </Button>
                  
                  <Button
                    disabled={activeSection === caseStudy.sections.length - 1}
                    onClick={() => setActiveSection(prev => Math.min(caseStudy.sections.length - 1, prev + 1))}
                  >
                    Next Section
                  </Button>
                </div>
              </div>
              
              {/* Additional Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Nursing Diagnoses */}
                {caseStudy.nursingDiagnoses && (
                  <div className="neuro-card p-4">
                    <div className="flex items-center mb-4">
                      <PulseIcon />
                      <h3 className="font-bold text-[#13294B] ml-2 text-lg">Nursing Diagnoses</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                      {caseStudy.nursingDiagnoses.map((diagnosis, idx) => (
                        <li key={idx} className="text-gray-700">{diagnosis}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Learning Objectives */}
                {caseStudy.learningObjectives && (
                  <div className="neuro-card p-4">
                    <div className="flex items-center mb-4">
                      <StethoscopeIcon />
                      <h3 className="font-bold text-[#13294B] ml-2 text-lg">Learning Objectives</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                      {caseStudy.learningObjectives.map((objective, idx) => (
                        <li key={idx} className="text-gray-700">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* References */}
              {caseStudy.references && (
                <div className="neuro-card p-4 mt-6">
                  <div className="flex items-center mb-4">
                    <MedicalCrossIcon />
                    <h3 className="font-bold text-[#13294B] ml-2 text-lg">References</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2">
                    {caseStudy.references.map((reference, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">{reference}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          
          {/* Reflection Questions */}
          {activeTab === 'reflection' && caseStudy.reflectionQuestions && (
            <div className="neuro-card p-6">
              <div className="flex items-center mb-6">
                <MessageCircleQuestion className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-[#13294B] ml-2">Reflection Questions</h2>
              </div>
              
              <p className="mb-6 text-gray-700">
                Take time to thoughtfully respond to these questions to develop your critical thinking skills.
                Consider writing down your answers for future reference and discussion with peers or instructors.
              </p>
              
              <div className="space-y-6">
                {caseStudy.reflectionQuestions.map((question, idx) => (
                  <div key={idx} className="p-4 border-2 border-black bg-green-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-bold text-lg mb-2">Question {idx + 1}:</h3>
                    <p className="text-gray-800 mb-4">{question}</p>
                    <textarea 
                      className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={4}
                      placeholder="Enter your response here..."
                    ></textarea>
                    <div className="mt-2 text-right">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Save Response
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('content')}
                  className="mr-4"
                >
                  Back to Case Study
                </Button>
                <Button 
                  onClick={() => setActiveTab('knowledge')}
                >
                  Continue to Knowledge Checks
                </Button>
              </div>
            </div>
          )}
          
          {/* Knowledge Checks */}
          {activeTab === 'knowledge' && caseStudy.knowledgeChecks && (
            <div className="neuro-card p-6">
              <div className="flex items-center mb-6">
                <BrainIcon className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-[#13294B] ml-2">Knowledge Checks</h2>
              </div>
              
              <p className="mb-6 text-gray-700">
                Test your understanding of key concepts from this case study with these questions.
                Select your answer and check your understanding.
              </p>
              
              <div className="space-y-8">
                {caseStudy.knowledgeChecks.map((check, idx) => (
                  <div key={idx} className="p-4 border-2 border-black bg-orange-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-bold text-lg mb-2">Question {idx + 1}:</h3>
                    <p className="text-gray-800 mb-4">{check.question}</p>
                    
                    <div className="space-y-2 mb-4">
                      {check.options.map((option, optionIdx) => (
                        <div 
                          key={optionIdx}
                          className={`p-3 border-2 rounded-md cursor-pointer flex items-center ${
                            showAnswers[idx]
                              ? optionIdx === check.correctOption
                                ? 'bg-green-100 border-green-500'
                                : selectedAnswers[idx] === optionIdx 
                                  ? 'bg-red-100 border-red-500' 
                                  : 'border-gray-300'
                              : selectedAnswers[idx] === optionIdx
                                ? 'bg-blue-100 border-blue-500'
                                : 'border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            if (!showAnswers[idx]) {
                              const newSelectedAnswers = [...selectedAnswers];
                              newSelectedAnswers[idx] = optionIdx;
                              setSelectedAnswers(newSelectedAnswers);
                            }
                          }}
                        >
                          <div className="flex-grow">
                            <span className="font-medium">{String.fromCharCode(65 + optionIdx)}.</span> {option}
                          </div>
                          {showAnswers[idx] && (
                            <div className="flex-shrink-0">
                              {optionIdx === check.correctOption ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : selectedAnswers[idx] === optionIdx ? (
                                <XCircle className="h-5 w-5 text-red-600" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {showAnswers[idx] ? (
                      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <h4 className="font-bold mb-2">Explanation:</h4>
                        <p>{check.explanation}</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <Button 
                          className="bg-orange-600 hover:bg-orange-700"
                          disabled={selectedAnswers[idx] === undefined}
                          onClick={() => {
                            const newShowAnswers = [...showAnswers];
                            newShowAnswers[idx] = true;
                            setShowAnswers(newShowAnswers);
                          }}
                        >
                          Check Answer
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('content')}
                  className="mr-4"
                >
                  Back to Case Study
                </Button>
                <Button 
                  onClick={() => setActiveTab('reflection')}
                >
                  Review Reflection Questions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}