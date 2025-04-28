import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, FileText, Download } from 'lucide-react';
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
}

export function CaseStudyViewer({ caseStudyId, onBack }: CaseStudyViewerProps) {
  const [caseStudy, setCaseStudy] = useState<CaseStudyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
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
                      onClick={() => setActiveSection(index)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeSection === index
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
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
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
        </div>
      </div>
    </div>
  );
}