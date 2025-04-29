import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Search, Book, FileText, HelpCircle, BookOpen } from 'lucide-react';
import { Header } from '../components/ui/header';
import { Sidebar } from '../components/ui/sidebar';
import { fetchQuestions, fetchTests } from '../utils/api'; 
import { Question } from '../types/question';
import { Test } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define case study categories
const categories = [
  'All',
  'Medical-Surgical',
  'Pediatric',
  'Obstetrics',
  'Mental Health',
  'Critical Care',
  'Other'
];

// Define question categories
const questionCategories = [
  'All',
  'Fundamentals',
  'Medical-Surgical',
  'Pediatric',
  'Obstetric',
  'Mental Health',
  'Pharmacology',
  'Leadership'
];

// Interface for case study data
interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  filename: string;
}

interface CategoryData {
  id: string;
  title: string;
  questions: number;
  icon: JSX.Element;
  color: string;
  iconBg: string;
}

export default function ExamsAndStudies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('case-studies');
  const [activeQuestionCategory, setActiveQuestionCategory] = useState('All');
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<CaseStudy[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to categorize case studies based on filename patterns
  const categorizeByFilename = (filename: string): string => {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('pediatric') || lowerFilename.includes('neonatal') || 
        lowerFilename.includes('child') || lowerFilename.includes('infant')) {
      return 'Pediatric';
    } else if (lowerFilename.includes('pregnancy') || lowerFilename.includes('preeclampsia') || 
               lowerFilename.includes('postpartum') || lowerFilename.includes('gestational') ||
               lowerFilename.includes('ectopic')) {
      return 'Obstetrics';
    } else if (lowerFilename.includes('depression') || lowerFilename.includes('anxiety') || 
               lowerFilename.includes('disorder') || lowerFilename.includes('mental') ||
               lowerFilename.includes('ptsd') || lowerFilename.includes('stress') || 
               lowerFilename.includes('therapy') || lowerFilename.includes('suicide')) {
      return 'Mental Health';
    } else if (lowerFilename.includes('respiratory') || lowerFilename.includes('cardiac') || 
               lowerFilename.includes('stroke') || lowerFilename.includes('failure') ||
               lowerFilename.includes('sepsis') || lowerFilename.includes('shock') ||
               lowerFilename.includes('overdose') || lowerFilename.includes('distress')) {
      return 'Critical Care';
    } else {
      return 'Medical-Surgical';
    }
  };

  // Load case studies from the specified directory
  useEffect(() => {
    // This would typically be an API call to fetch case studies
    // For now, we'll create a list based on the filenames you provided
    const caseStudiesFromDocs = [
      { id: '1', title: 'Abdominal Surgery Postoperative Care', filename: 'Abdominal-surgey-postoperative-care.docx', category: 'Medical-Surgical', description: 'Case study focusing on postoperative care for abdominal surgery patients.' },
      { id: '2', title: 'Acute Asthma', filename: 'Acute-Asthma.docx', category: 'Medical-Surgical', description: 'Management of acute asthma exacerbation in clinical settings.' },
      { id: '3', title: 'Acute Respiratory Distress', filename: 'Acute-Respiratory-Distress.docx', category: 'Critical Care', description: 'Case presentation and management of acute respiratory distress syndrome (ARDS).' },
      { id: '4', title: 'Anorexia with Dehydration', filename: 'Anorexia-with-Dehydration.docx', category: 'Mental Health', description: 'Nutritional and psychological care for patients with anorexia experiencing dehydration.' },
      { id: '5', title: 'Attention-Deficit Hyperactivity Disorder (Pediatric)', filename: 'Attention-Deficit-Hyperactivity-Disorder-(Pediatric).docx', category: 'Pediatric', description: 'Assessment and management strategies for pediatric ADHD patients.' },
      { id: '6', title: 'Breast Cancer', filename: 'Breast-Cancer.docx', category: 'Medical-Surgical', description: 'Clinical case of breast cancer diagnosis, treatment, and nursing care.' },
      { id: '7', title: 'Burn', filename: 'Burn.docx', category: 'Medical-Surgical', description: 'Comprehensive care approach for burn patients including wound care and pain management.' },
      { id: '8', title: 'COPD', filename: 'COPD.docx', category: 'Medical-Surgical', description: 'Management of Chronic Obstructive Pulmonary Disease exacerbation.' },
      { id: '9', title: 'COPD II', filename: 'COPD-II.docx', category: 'Medical-Surgical', description: 'Advanced management techniques for Chronic Obstructive Pulmonary Disease.' },
      { id: '10', title: 'Catheter-Related Urinary Tract Infection', filename: 'Catheter-Related-Urinary-Tract-Infection.docx', category: 'Medical-Surgical', description: 'Prevention and management of catheter-associated UTIs.' },
      { id: '11', title: 'Chest Pain (MI)', filename: 'Chest-Pain-(MI).docx', category: 'Critical Care', description: 'Emergency assessment and intervention for Myocardial Infarction.' },
      { id: '12', title: 'Compartment Syndrome', filename: 'Compartment-Syndrome.docx', category: 'Medical-Surgical', description: 'Recognition and management of compartment syndrome following trauma or surgery.' },
      { id: '13', title: 'Deep Vein Thrombosis', filename: 'Deep-Vein-Thrombosis.docx', category: 'Medical-Surgical', description: 'Assessment, prevention, and treatment of Deep Vein Thrombosis.' },
      { id: '14', title: 'Deep Vein Thrombosis II', filename: 'Deep-Vein-Thrombosis-II.docx', category: 'Medical-Surgical', description: 'Advanced management and complications of Deep Vein Thrombosis.' },
      { id: '15', title: 'Dehydration in Alzheimer\'s', filename: 'Dehydration_Alzheimers_.docx', category: 'Medical-Surgical', description: 'Managing hydration in patients with Alzheimer\'s disease.' },
      { id: '16', title: 'Ectopic Pregnancy', filename: 'Ectopic-pregnancy.docx', category: 'Obstetrics', description: 'Recognition, management, and care for patients with ectopic pregnancy.' },
      { id: '17', title: 'Electroconvulsive Therapy', filename: 'Electroconvulsive-Therapy.docx', category: 'Mental Health', description: 'Nursing considerations for patients undergoing electroconvulsive therapy.' },
      { id: '18', title: 'End-Stage Renal Disease and Dialysis', filename: 'End-Stage-Renal-Disease-and-Dialysis.docx', category: 'Medical-Surgical', description: 'Care management for patients with ESRD requiring dialysis.' },
      { id: '19', title: 'Febrile Seizures', filename: 'Febrile-Seizures.docx', category: 'Pediatric', description: 'Assessment and management of febrile seizures in pediatric patients.' },
      { id: '20', title: 'Gastroesophageal Reflux', filename: 'Gastroesphageal-Reflux.docx', category: 'Medical-Surgical', description: 'Management strategies for patients with GERD.' },
      { id: '21', title: 'Gestational Diabetes', filename: 'Gestational-diabetes.docx', category: 'Obstetrics', description: 'Screening, monitoring, and care for gestational diabetes mellitus.' },
      { id: '22', title: 'HIV with Opportunistic Infection', filename: 'HIV-with-Opportunistic-Infection.docx', category: 'Medical-Surgical', description: 'Care for HIV patients experiencing opportunistic infections.' },
      { id: '23', title: 'Heart Failure', filename: 'Heart-Failure.docx', category: 'Medical-Surgical', description: 'Comprehensive management of heart failure including medication management and lifestyle modifications.' },
      { id: '24', title: 'Home Safety', filename: 'Home-Safety.docx', category: 'Other', description: 'Assessment and intervention for creating safe home environments.' },
      { id: '25', title: 'Home Safety II', filename: 'Home-Safety-II.docx', category: 'Other', description: 'Advanced considerations for home safety in special populations.' },
      { id: '26', title: 'Intimate Partner Violence', filename: 'Intimate-Partner-Violence.docx', category: 'Mental Health', description: 'Screening, intervention, and support for intimate partner violence survivors.' },
      { id: '27', title: 'Ketoacidosis', filename: 'Ketoacidosis.docx', category: 'Medical-Surgical', description: 'Management of diabetic ketoacidosis including fluid resuscitation and insulin therapy.' },
      { id: '28', title: 'Liver Failure', filename: 'Liver-Failure.docx', category: 'Medical-Surgical', description: 'Comprehensive care for patients with acute or chronic liver failure.' },
      { id: '29', title: 'Neonatal Jaundice', filename: 'Neonatal-Jaundice.docx', category: 'Pediatric', description: 'Assessment and management of hyperbilirubinemia in newborns.' },
      { id: '30', title: 'Neonatal Respiratory Distress Syndrome', filename: 'Neonatal-Respiratory-Distress-Syndrome.docx', category: 'Pediatric', description: 'Care for premature neonates with respiratory distress syndrome.' },
      { id: '31', title: 'Neuroleptic Malignant Syndrome', filename: 'Neuroleptic-Maligant-Syndrome.docx', category: 'Mental Health', description: 'Recognition and management of this rare but serious reaction to neuroleptic medications.' },
      { id: '32', title: 'Opioid Overdose', filename: 'Opioid-Overdose.docx', category: 'Critical Care', description: 'Emergency management of opioid overdose including naloxone administration.' },
      { id: '33', title: 'Pediatric Hypoglycemia', filename: 'Pediactric-Hypoglycemia.docx', category: 'Pediatric', description: 'Recognition and treatment of hypoglycemia in pediatric patients.' },
      { id: '34', title: 'Pediatric Anaphylaxis', filename: 'Pediatric-Anaphylaxis.docx', category: 'Pediatric', description: 'Emergency management of anaphylactic reactions in children.' },
      { id: '35', title: 'Pediatric Intussusception', filename: 'Pediatric-Intussusception.docx', category: 'Pediatric', description: 'Assessment and management of intussusception in pediatric patients.' },
      { id: '36', title: 'Pediatric Sickle Cell Complications', filename: 'Pediatric-Sickle-Cell-Complications.docx', category: 'Pediatric', description: 'Management of complications associated with sickle cell disease in children.' },
      { id: '37', title: 'Pediatric Diarrhea and Dehydration', filename: 'Pediatric-diarrhea-and-dehydration.docx', category: 'Pediatric', description: 'Assessment and management of diarrhea and resulting dehydration in pediatric patients.' },
      { id: '38', title: 'Post-Operative Atelectasis', filename: 'Post-Operative-Atelectasis.docx', category: 'Medical-Surgical', description: 'Prevention and management of atelectasis following surgery.' },
      { id: '39', title: 'Post-traumatic Stress Disorder', filename: 'Post-traumatic-stress-disorder.docx', category: 'Mental Health', description: 'Assessment and therapeutic interventions for PTSD.' },
      { id: '40', title: 'Poststreptococcal Glomerulonephritis (Pediatric)', filename: 'Poststreptococcal-Glomerulonephritis-Pediatric.docx', category: 'Pediatric', description: 'Management of this kidney condition following streptococcal infection in children.' },
      { id: '41', title: 'Preeclampsia', filename: 'Preeclampsia.docx', category: 'Obstetrics', description: 'Assessment, monitoring, and management of preeclampsia in pregnancy.' },
      { id: '42', title: 'Pressure Injury', filename: 'Pressure-Injury.docx', category: 'Medical-Surgical', description: 'Prevention and treatment of pressure injuries in hospitalized patients.' },
      { id: '43', title: 'Prostate Cancer', filename: 'Prostate-Cancer.docx', category: 'Medical-Surgical', description: 'Care management for patients with prostate cancer including treatment options and side effect management.' },
      { id: '44', title: 'Spine Surgery', filename: 'Spine-Surgery.docx', category: 'Medical-Surgical', description: 'Pre and post-operative care for patients undergoing spinal surgery.' },
      { id: '45', title: 'Stroke', filename: 'Stroke.docx', category: 'Critical Care', description: 'Acute management and rehabilitation considerations for stroke patients.' },
      { id: '46', title: 'Substance Use, Withdrawal, and Pain Control', filename: 'Substance-Use-Withdrawal-and-Pain-Control.docx', category: 'Mental Health', description: 'Managing pain in patients with substance use disorders and addressing withdrawal symptoms.' },
      { id: '47', title: 'Suicide Prevention', filename: 'Suicide-Prevention.docx', category: 'Mental Health', description: 'Risk assessment and interventions for suicide prevention.' },
      { id: '48', title: 'Tardive Dyskinesia', filename: 'Tardive-Dyskinesia.docx', category: 'Mental Health', description: 'Recognition and management of this movement disorder associated with antipsychotic medications.' },
      { id: '49', title: 'Tension Pneumothorax', filename: 'Tension-Pneumothorax.docx', category: 'Critical Care', description: 'Emergency recognition and management of tension pneumothorax.' },
      { id: '50', title: 'Transfusion Reaction', filename: 'Transfusion-Reaction.docx', category: 'Critical Care', description: 'Identification and management of blood transfusion reactions.' },
      { id: '51', title: 'Tuberculosis', filename: 'Tuberculosis.docx', category: 'Medical-Surgical', description: 'Management of tuberculosis including medication therapy and infection control measures.' },
      { id: '52', title: 'Urinary Tract Infection', filename: 'Urinary-Tract-Infection.docx', category: 'Medical-Surgical', description: 'Assessment and management of urinary tract infections.' },
      { id: '53', title: 'Postpartum Hemorrhage', filename: 'postpartum-hemmorhage.docx', category: 'Obstetrics', description: 'Recognition and management of hemorrhage following childbirth.' },
    ];

    setCaseStudies(caseStudiesFromDocs);
    setFilteredStudies(caseStudiesFromDocs);
  }, []);

  // Filter case studies based on search query and active category
  useEffect(() => {
    let filtered = caseStudies;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(study => 
        study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(study => study.category === activeCategory);
    }
    
    setFilteredStudies(filtered);
  }, [searchQuery, activeCategory, caseStudies]);

  // Load tests data
  useEffect(() => {
    async function loadTests() {
      try {
        const testsData = await fetchTests();
        setTests(testsData);
      } catch (error) {
        console.error("Error loading tests:", error);
        setError("Failed to load tests. Please try again later.");
      }
    }
    
    loadTests();
  }, []);

  // Load questions data
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const response = await fetchQuestions();
        
        // Add category information to questions if missing
        const processedQuestions = response.questions.map((question: Question) => {
          if (question.category) return question;
          
          // Determine category based on the question title or content
          const title = question.title?.toLowerCase() || '';
          const text = question.text?.toLowerCase() || '';
          const content = title + " " + text;
          let category = "fund"; // default to fundamentals
          
          if (content.includes("med") || content.includes("surg") || content.includes("medical") || content.includes("surgical")) {
            category = "med-surg";
          } else if (content.includes("ped") || content.includes("child") || content.includes("infant") || content.includes("adolescent")) {
            category = "peds";
          } else if (content.includes("ob") || content.includes("gyn") || content.includes("pregnancy") || content.includes("birth")) {
            category = "ob";
          } else if (content.includes("psych") || content.includes("mental") || content.includes("behavioral")) {
            category = "psych";
          } else if (content.includes("med") || content.includes("drug") || content.includes("dose") || content.includes("pharm")) {
            category = "pharm";
          } else if (content.includes("lead") || content.includes("manage") || content.includes("priority") || content.includes("delegation")) {
            category = "leadership";
          }
          
          return { ...question, category };
        });
        
        setQuestions(processedQuestions);
        setFilteredQuestions(processedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error loading questions:", error);
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    }
    
    if (activeTab === 'question-bank') {
      loadQuestions();
    }
  }, [activeTab]);

  // Filter questions based on search query and category
  useEffect(() => {
    if (questions.length === 0) return;
    
    let filtered = [...questions];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(question => 
        question.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeQuestionCategory !== 'All') {
      filtered = filtered.filter(question => {
        const category = question.category?.toLowerCase() || '';
        const activeCategory = activeQuestionCategory.toLowerCase();
        
        if (activeCategory === 'medical-surgical') {
          return category.includes('med') || category.includes('surg');
        } else if (activeCategory === 'pediatric') {
          return category.includes('ped');
        } else if (activeCategory === 'obstetric') {
          return category.includes('ob');
        } else if (activeCategory === 'mental health') {
          return category.includes('psych') || category.includes('mental');
        } else if (activeCategory === 'pharmacology') {
          return category.includes('pharm');
        } else if (activeCategory === 'leadership') {
          return category.includes('lead') || category.includes('manage');
        } else if (activeCategory === 'fundamentals') {
          return category.includes('fund');
        }
        
        return false;
      });
    }
    
    setFilteredQuestions(filtered);
  }, [searchQuery, activeQuestionCategory, questions]);

  // Prepare category data for display
  const getCategoryData = (): CategoryData[] => {
    if (!questions.length) return [];
    
    const categoryCounts: Record<string, number> = {};
    
    questions.forEach(question => {
      const category = question.category?.toLowerCase() || 'other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return [
      {
        id: 'med-surg',
        title: 'Medical-Surgical',
        questions: categoryCounts['med-surg'] || 0,
        icon: <FileText />,
        color: 'from-blue-50 to-blue-100',
        iconBg: 'bg-blue-100'
      },
      {
        id: 'peds',
        title: 'Pediatric',
        questions: categoryCounts['peds'] || 0,
        icon: <BookOpen />,
        color: 'from-green-50 to-green-100',
        iconBg: 'bg-green-100'
      },
      {
        id: 'ob',
        title: 'Obstetric',
        questions: categoryCounts['ob'] || 0,
        icon: <HelpCircle />,
        color: 'from-purple-50 to-purple-100',
        iconBg: 'bg-purple-100'
      },
      {
        id: 'psych',
        title: 'Mental Health',
        questions: categoryCounts['psych'] || 0,
        icon: <Book />,
        color: 'from-yellow-50 to-yellow-100',
        iconBg: 'bg-yellow-100'
      },
      {
        id: 'pharm',
        title: 'Pharmacology',
        questions: categoryCounts['pharm'] || 0,
        icon: <FileText />,
        color: 'from-red-50 to-red-100',
        iconBg: 'bg-red-100'
      },
      {
        id: 'fund',
        title: 'Fundamentals',
        questions: categoryCounts['fund'] || 0,
        icon: <Book />,
        color: 'from-gray-50 to-gray-100',
        iconBg: 'bg-gray-100'
      }
    ];
  };

  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex min-h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto w-full">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#13294B]">Exams &amp; Studies</h1>
            
            <Tabs defaultValue="case-studies" onValueChange={setActiveTab} className="mb-6">
              <TabsList className="mb-6 inline-flex flex-nowrap p-1 bg-white shadow-md rounded-lg border-2 border-[#e2e8f0] min-w-fit">
                <TabsTrigger 
                  value="case-studies"
                  className="whitespace-nowrap px-4 py-2 font-medium text-sm rounded-md bg-gray-50 data-[state=active]:bg-[#4B9CD3] data-[state=active]:text-white"
                >
                  Case Studies
                </TabsTrigger>
                <TabsTrigger 
                  value="question-bank"
                  className="whitespace-nowrap px-4 py-2 font-medium text-sm rounded-md bg-gray-50 data-[state=active]:bg-[#4B9CD3] data-[state=active]:text-white"
                >
                  Question Bank
                </TabsTrigger>
                <TabsTrigger 
                  value="practice-tests"
                  className="whitespace-nowrap px-4 py-2 font-medium text-sm rounded-md bg-gray-50 data-[state=active]:bg-[#4B9CD3] data-[state=active]:text-white"
                >
                  Practice Tests
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="case-studies" className="mt-0">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search case studies..."
                      className="pl-10 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <Tabs defaultValue="All" className="mb-6">
                  <div className="overflow-x-auto pb-2">
                    <TabsList className="mb-6 inline-flex flex-nowrap p-1 bg-white shadow-md rounded-lg border-2 border-[#e2e8f0] min-w-fit">
                      {categories.map(category => (
                        <TabsTrigger 
                          key={category} 
                          value={category}
                          onClick={() => setActiveCategory(category)}
                          className="whitespace-nowrap px-4 py-2 font-medium text-sm rounded-md bg-gray-50 data-[state=active]:bg-[#4B9CD3] data-[state=active]:text-white"
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  <TabsContent value={activeCategory} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudies.length > 0 ? (
                        filteredStudies.map(study => (
                          <div key={study.id} className="neuro-card p-4 flex flex-col h-full">
                            <h3 className="font-bold text-[#13294B] mb-2 text-lg line-clamp-2">{study.title}</h3>
                            <div className="mb-2">
                              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                                {study.category}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-4 text-sm flex-grow line-clamp-3">{study.description}</p>
                            <div className="mt-auto">
                              <Link href={`/case-study/${study.id}`} className="neuro-button-primary inline-block w-full text-center">
                                View Case Study
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-10">
                          <h3 className="text-xl font-medium text-gray-600">No case studies found</h3>
                          <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="question-bank">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search questions..."
                      className="pl-10 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {questionCategories.map(category => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors neuro-button-lite
                        ${activeQuestionCategory === category ? 'bg-[#13294B] text-white' : 'bg-white text-[#333333] hover:bg-gray-100'}`}
                      onClick={() => setActiveQuestionCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg">Loading questions...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button 
                      className="neuro-button-primary"
                      onClick={() => {
                        setError(null);
                        setActiveTab('question-bank');
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.slice(0, 12).map((question, index) => (
                        <div key={question.id} className="neuro-card p-4 flex flex-col h-full">
                          <div className="mb-3">
                            <span className={`inline-block ${
                              question.category?.includes('med') || question.category?.includes('surg') ? 'bg-blue-100 text-blue-800' :
                              question.category?.includes('ped') ? 'bg-green-100 text-green-800' :
                              question.category?.includes('ob') ? 'bg-purple-100 text-purple-800' :
                              question.category?.includes('psych') ? 'bg-yellow-100 text-yellow-800' :
                              question.category?.includes('pharm') ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            } px-2 py-1 text-xs rounded`}>
                              {question.type === 'mc' ? 'Multiple Choice' : 
                               question.type === 'sata' ? 'Select All That Apply' : 
                               question.type === 'fill_in_blank' ? 'Fill in Blank' :
                               question.type === 'ordered-response' ? 'Ordered Response' :
                               question.type === 'hotspot' ? 'Hotspot' :
                               question.type === 'chart-exhibit' ? 'Chart Exhibit' : 
                               'Question'}
                            </span>
                          </div>
                          <h3 className="font-bold text-[#13294B] mb-2 text-lg line-clamp-2">
                            {question.title || `Question #${question.id}`}
                          </h3>
                          <p className="text-gray-700 mb-4 text-sm flex-grow line-clamp-3">
                            {question.text || "Start practicing this question..."}
                          </p>
                          <div className="mt-auto">
                            <Link href={`/question/${question.id}`} className="neuro-button-primary inline-block w-full text-center">
                              Practice Question
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <h3 className="text-xl font-medium text-gray-600">No questions found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="practice-tests">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Dynamic test cards from API */}
                  {tests && tests.length > 0 ? (
                    tests.map((test) => (
                      <div key={test.id} className="neuro-card p-4 flex flex-col h-full">
                        <h3 className="font-bold text-[#13294B] mb-2 text-lg">{test.title}</h3>
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                            {test.questionCount || 75} Questions
                          </span>
                          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded ml-2">
                            {test.timeLimit || 2} {test.timeLimit === 1 ? 'Hour' : 'Hours'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-sm flex-grow">
                          {test.description || `Practice test covering ${test.category || 'nursing'} content.`}
                        </p>
                        <div className="mt-auto">
                          <button 
                            className="neuro-button-primary inline-block w-full text-center min-h-[44px]"
                            onClick={() => setLocation(`/?testId=${test.id}`)}
                            aria-label={`Start ${test.title} Test`}
                          >
                            Start Test
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {/* Fallback for when no tests are available or loading */}
                      <div className="neuro-card p-4 flex flex-col h-full">
                        <h3 className="font-bold text-[#13294B] mb-2 text-lg">Full NCLEX Practice Test</h3>
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                            175 Questions
                          </span>
                          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded ml-2">
                            5 Hours
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-sm flex-grow">
                          A comprehensive exam that simulates the full NCLEX experience with adaptive difficulty.
                        </p>
                        <div className="mt-auto">
                          <button 
                            className="neuro-button-primary inline-block w-full text-center min-h-[44px]"
                            onClick={() => setLocation("/")}
                            aria-label="Start Full NCLEX Practice Test"
                          >
                            Start Test
                          </button>
                        </div>
                      </div>
                      
                      <div className="neuro-card p-4 flex flex-col h-full">
                        <h3 className="font-bold text-[#13294B] mb-2 text-lg">Mini NCLEX Practice</h3>
                        <div className="mb-2">
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 text-xs rounded">
                            75 Questions
                          </span>
                          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded ml-2">
                            2 Hours
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-sm flex-grow">
                          A shorter version of the NCLEX exam, perfect for when you're short on time.
                        </p>
                        <div className="mt-auto">
                          <button 
                            className="neuro-button-primary inline-block w-full text-center min-h-[44px]"
                            onClick={() => setLocation("/")}
                            aria-label="Start Mini NCLEX Practice Test"
                          >
                            Start Test
                          </button>
                        </div>
                      </div>
                      
                      <div className="neuro-card p-4 flex flex-col h-full">
                        <h3 className="font-bold text-[#13294B] mb-2 text-lg">Custom Practice Test</h3>
                        <div className="mb-2">
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 text-xs rounded">
                            Customizable
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-sm flex-grow">
                          Create your own practice test by selecting the number of questions, time limit, and specific content areas.
                        </p>
                        <div className="mt-auto">
                          <button 
                            className="neuro-button-primary inline-block w-full text-center min-h-[44px]"
                            onClick={() => setLocation("/")}
                            aria-label="Create Custom Practice Test"
                          >
                            Create Test
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}