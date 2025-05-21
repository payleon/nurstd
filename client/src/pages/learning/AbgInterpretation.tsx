import { ArrowLeft, Download, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function AbgInterpretationPage() {
  return (
    <div className="bg-[#f9fafb] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Understanding ABGs (Arterial Blood Gases)
              </h1>
              <p className="text-blue-800 mb-4">
                Comprehensive guide to interpreting arterial blood gases and managing acid-base imbalances
              </p>
              <div className="flex items-center text-sm text-blue-700">
                <span className="mr-4">Estimated time: 15 minutes</span>
                <span>Difficulty: Intermediate</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-white/80">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Introduction to Arterial Blood Gases</h2>
          <p className="mb-4">
            Arterial blood gas (ABG) analysis is a crucial diagnostic tool that provides information about a patient's oxygenation, ventilation, and acid-base balance. Understanding how to interpret ABGs is essential for managing critically ill patients and those with respiratory or metabolic disorders.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Key Components of an ABG</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2 text-blue-700">pH</h4>
                <p>Measures hydrogen ion concentration and indicates acidity or alkalinity of blood.</p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Normal range: 7.35-7.45</li>
                  <li>&lt; 7.35: Acidemia</li>
                  <li>&gt; 7.45: Alkalemia</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2 text-blue-700">PaCO₂</h4>
                <p>Partial pressure of carbon dioxide; reflects ventilation status.</p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Normal range: 35-45 mmHg</li>
                  <li>&lt; 35 mmHg: Hypocapnia (respiratory alkalosis)</li>
                  <li>&gt; 45 mmHg: Hypercapnia (respiratory acidosis)</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2 text-blue-700">HCO₃⁻</h4>
                <p>Bicarbonate concentration; reflects metabolic component.</p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Normal range: 22-26 mEq/L</li>
                  <li>&lt; 22 mEq/L: Metabolic acidosis</li>
                  <li>&gt; 26 mEq/L: Metabolic alkalosis</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2 text-blue-700">PaO₂</h4>
                <p>Partial pressure of oxygen; indicates oxygenation status.</p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Normal range: 80-100 mmHg (room air)</li>
                  <li>&lt; 80 mmHg: Hypoxemia</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-3">Systematic Approach to ABG Interpretation</h3>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li><strong>Assess oxygenation:</strong> Review PaO₂ to determine if hypoxemia is present.</li>
            <li><strong>Evaluate pH:</strong> Determine if acidemia or alkalemia is present.</li>
            <li><strong>Identify primary disorder:</strong> Determine whether the abnormality is respiratory or metabolic.
              <ul className="list-disc pl-6 mt-1 mb-1">
                <li>If pH and PaCO₂ move in opposite directions (↓pH, ↑PaCO₂ or ↑pH, ↓PaCO₂), the primary disorder is respiratory.</li>
                <li>If pH and HCO₃⁻ move in the same direction (↓pH, ↓HCO₃⁻ or ↑pH, ↑HCO₃⁻), the primary disorder is metabolic.</li>
              </ul>
            </li>
            <li><strong>Check for compensation:</strong> Determine if there's compensation for the primary disorder.
              <ul className="list-disc pl-6 mt-1 mb-1">
                <li>Respiratory compensation for metabolic disorders occurs within minutes to hours.</li>
                <li>Metabolic compensation for respiratory disorders takes hours to days.</li>
              </ul>
            </li>
            <li><strong>Calculate the anion gap:</strong> For metabolic acidosis, calculate the anion gap to determine the cause.</li>
          </ol>
          
          <h3 className="text-xl font-bold mt-8 mb-3">Common ABG Patterns</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 border">Disorder</th>
                  <th className="px-4 py-2 border">pH</th>
                  <th className="px-4 py-2 border">PaCO₂</th>
                  <th className="px-4 py-2 border">HCO₃⁻</th>
                  <th className="px-4 py-2 border">Common Causes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-medium">Respiratory Acidosis</td>
                  <td className="px-4 py-2 border">↓</td>
                  <td className="px-4 py-2 border">↑</td>
                  <td className="px-4 py-2 border">Normal or ↑ (if compensated)</td>
                  <td className="px-4 py-2 border">COPD, pneumonia, respiratory depression, neuromuscular disorders</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Respiratory Alkalosis</td>
                  <td className="px-4 py-2 border">↑</td>
                  <td className="px-4 py-2 border">↓</td>
                  <td className="px-4 py-2 border">Normal or ↓ (if compensated)</td>
                  <td className="px-4 py-2 border">Hyperventilation, anxiety, pulmonary embolism, sepsis</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Metabolic Acidosis</td>
                  <td className="px-4 py-2 border">↓</td>
                  <td className="px-4 py-2 border">Normal or ↓ (if compensated)</td>
                  <td className="px-4 py-2 border">↓</td>
                  <td className="px-4 py-2 border">Diabetic ketoacidosis, lactic acidosis, renal failure, diarrhea</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Metabolic Alkalosis</td>
                  <td className="px-4 py-2 border">↑</td>
                  <td className="px-4 py-2 border">Normal or ↑ (if compensated)</td>
                  <td className="px-4 py-2 border">↑</td>
                  <td className="px-4 py-2 border">Vomiting, nasogastric suction, diuretic use, hypokalemia</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-3">Anion Gap</h3>
          <p className="mb-4">
            The anion gap is a calculated value that helps differentiate causes of metabolic acidosis:
          </p>
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <p className="font-medium">Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻)</p>
            <p className="text-sm text-blue-700 mt-2">Normal range: 8-12 mEq/L</p>
          </div>
          
          <h4 className="font-bold mt-4 mb-2">Increased Anion Gap Metabolic Acidosis (HAGMA):</h4>
          <ul className="list-disc pl-6 mb-4">
            <li>Diabetic ketoacidosis</li>
            <li>Lactic acidosis</li>
            <li>Renal failure</li>
            <li>Toxic ingestion (methanol, ethylene glycol, salicylates)</li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-2">Normal Anion Gap Metabolic Acidosis (NAGMA):</h4>
          <ul className="list-disc pl-6 mb-6">
            <li>Diarrhea</li>
            <li>Renal tubular acidosis</li>
            <li>Pancreatic fistula</li>
            <li>Ureterosigmoidostomy</li>
          </ul>
        </div>
        
        {/* Clinical Application Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Clinical Application</h2>
          <p className="mb-6">
            Understanding how to interpret ABGs is essential for clinical decision-making. Here are practical examples of how to apply ABG analysis in patient care:
          </p>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h3 className="font-bold text-lg mb-2">Case Study 1: COPD Exacerbation</h3>
            <p className="mb-2">ABG Values:</p>
            <ul className="list-disc pl-6 mb-2">
              <li>pH: 7.31</li>
              <li>PaCO₂: 60 mmHg</li>
              <li>HCO₃⁻: 29 mEq/L</li>
              <li>PaO₂: 58 mmHg</li>
            </ul>
            <p className="mt-2">
              <strong>Interpretation:</strong> Partially compensated respiratory acidosis with hypoxemia, typical of COPD exacerbation. The elevated HCO₃⁻ indicates renal compensation attempting to normalize the pH.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h3 className="font-bold text-lg mb-2">Case Study 2: Diabetic Ketoacidosis</h3>
            <p className="mb-2">ABG Values:</p>
            <ul className="list-disc pl-6 mb-2">
              <li>pH: 7.24</li>
              <li>PaCO₂: 28 mmHg</li>
              <li>HCO₃⁻: 12 mEq/L</li>
              <li>PaO₂: 95 mmHg</li>
              <li>Anion Gap: 22</li>
            </ul>
            <p className="mt-2">
              <strong>Interpretation:</strong> High anion gap metabolic acidosis with respiratory compensation (decreased PaCO₂ due to hyperventilation) consistent with diabetic ketoacidosis.
            </p>
          </div>
        </div>
        
        {/* Resources and References */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2 text-blue-600" />
              <a href="#" className="text-blue-600 hover:underline">Downloadable ABG Interpretation Guide (PDF)</a>
            </li>
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2 text-blue-600" />
              <a href="#" className="text-blue-600 hover:underline">ABG Practice Problems Worksheet</a>
            </li>
          </ul>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous: Acid-Base Balance Basics
          </Button>
          <Button>
            Next: Advanced Respiratory Assessment
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}