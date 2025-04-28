import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import { Header } from '../components/ui/header';
import { Sidebar } from '../components/ui/sidebar';

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

// Interface for case study data
interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  filename: string;
}

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<CaseStudy[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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

  return (
    <div className="bg-[#f0f2f5] font-sans text-[#333333] min-h-screen neuro-noise">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex h-screen pt-16">
        <main className="flex-1 p-4 md:p-6 lg:pl-72 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#13294B]">Nursing Case Studies</h1>
      
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
              <TabsList className="mb-4 flex flex-wrap">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    onClick={() => setActiveCategory(category)}
                    className="mr-2 mb-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeCategory} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStudies.length > 0 ? (
                    filteredStudies.map(study => (
                      <div key={study.id} className="neuro-card p-4 h-full">
                        <h3 className="font-bold text-[#13294B] mb-2 text-lg">{study.title}</h3>
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                            {study.category}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-sm">{study.description}</p>
                        <Link href={`/case-study/${study.id}`} className="neuro-button-primary inline-block mt-auto">
                          View Case Study
                        </Link>
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
          </div>
        </main>
      </div>
    </div>
  );
}