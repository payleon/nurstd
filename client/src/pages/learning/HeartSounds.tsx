import { ArrowLeft, Download, Bookmark, Share2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";

export default function HeartSoundsPage() {
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

  const playAudio = (id: string) => {
    setActiveAudio(id);
    // In a real implementation, this would play the actual audio file
    console.log(`Playing audio: ${id}`);
  };

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
        <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-red-900 mb-2">
                Heart Sounds and Murmurs
              </h1>
              <p className="text-red-800 mb-4">
                Audio guide to identifying normal and abnormal heart sounds for accurate cardiac assessment
              </p>
              <div className="flex items-center text-sm text-red-700">
                <span className="mr-4">Estimated time: 25 minutes</span>
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
          <h2 className="text-2xl font-bold mb-4">Introduction to Heart Sounds</h2>
          <p className="mb-4">
            Heart auscultation is a fundamental skill for healthcare professionals. Understanding normal and abnormal heart sounds helps in accurately assessing cardiovascular health and identifying cardiac conditions.
          </p>
          
          <div className="my-6 p-4 bg-red-50 rounded-md border border-red-100">
            <p className="italic text-red-800 text-sm">
              This module includes audio examples. Click the play button to listen to each heart sound. Headphones are recommended for optimal learning.
            </p>
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-3">Normal Heart Sounds</h3>
          <p className="mb-4">
            The cardiac cycle normally produces two distinct sounds, often described as "lub-dub."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-red-700">S₁ (First Heart Sound)</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playAudio('s1')}
                    className={activeAudio === 's1' ? 'bg-red-100' : ''}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                </div>
                <p className="mb-2">S₁ ("lub") is caused by closure of the atrioventricular (AV) valves (mitral and tricuspid) at the beginning of systole.</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Best heard at the apex (mitral area)</li>
                  <li>Louder and longer than S₂</li>
                  <li>Lower pitched than S₂</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-red-700">S₂ (Second Heart Sound)</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playAudio('s2')}
                    className={activeAudio === 's2' ? 'bg-red-100' : ''}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                </div>
                <p className="mb-2">S₂ ("dub") is produced by closure of the semilunar valves (aortic and pulmonic) at the end of systole.</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Best heard at the base of the heart</li>
                  <li>Higher pitched than S₁</li>
                  <li>May split during inspiration (physiologic splitting)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="border border-red-200 rounded-md p-4 mb-6">
            <h4 className="font-bold text-red-700 mb-2">Normal Heart Sound Sequence</h4>
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="font-medium">S₁</p>
                <p className="text-sm text-gray-600">("lub")</p>
              </div>
              <div className="text-center text-gray-400 font-bold">→</div>
              <div className="text-center flex-1">
                <p className="font-medium">Systole</p>
                <p className="text-sm text-gray-600">(~0.3 sec)</p>
              </div>
              <div className="text-center text-gray-400 font-bold">→</div>
              <div className="text-center flex-1">
                <p className="font-medium">S₂</p>
                <p className="text-sm text-gray-600">("dub")</p>
              </div>
              <div className="text-center text-gray-400 font-bold">→</div>
              <div className="text-center flex-1">
                <p className="font-medium">Diastole</p>
                <p className="text-sm text-gray-600">(~0.5 sec)</p>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => playAudio('normal')}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Listen to Normal Heart Sounds
              </Button>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-3">Extra Heart Sounds</h3>
          <p className="mb-4">
            In addition to S₁ and S₂, other sounds may be present in certain conditions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-red-700">S₃ (Third Heart Sound)</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playAudio('s3')}
                    className={activeAudio === 's3' ? 'bg-red-100' : ''}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                </div>
                <p className="mb-2">S₃ occurs early in diastole and is often associated with ventricular dysfunction.</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Creates a "Kentucky" gallop rhythm (lub-dub-dum)</li>
                  <li>Normal in children and young adults</li>
                  <li>Pathological in adults (heart failure, volume overload)</li>
                  <li>Best heard at the apex with the bell of the stethoscope</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-red-700">S₄ (Fourth Heart Sound)</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playAudio('s4')}
                    className={activeAudio === 's4' ? 'bg-red-100' : ''}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                </div>
                <p className="mb-2">S₄ occurs late in diastole, just before S₁, and is caused by atrial contraction against a stiff ventricle.</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Creates a "Tennessee" gallop rhythm (ta-lub-dub)</li>
                  <li>Indicates decreased ventricular compliance</li>
                  <li>Common in hypertension, aortic stenosis, and myocardial infarction</li>
                  <li>Best heard at the apex with the bell of the stethoscope</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-3">Heart Murmurs</h3>
          <p className="mb-4">
            Murmurs are abnormal sounds produced by turbulent blood flow. They are characterized by timing, location, radiation, intensity, pitch, and quality.
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-red-50">
                  <th className="px-4 py-2 border">Murmur</th>
                  <th className="px-4 py-2 border">Timing</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Characteristics</th>
                  <th className="px-4 py-2 border">Listen</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-medium">Aortic Stenosis</td>
                  <td className="px-4 py-2 border">Systolic ejection</td>
                  <td className="px-4 py-2 border">Right upper sternal border</td>
                  <td className="px-4 py-2 border">Harsh, crescendo-decrescendo, radiates to carotids</td>
                  <td className="px-4 py-2 border">
                    <Button variant="ghost" size="sm" onClick={() => playAudio('aortic-stenosis')}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Mitral Regurgitation</td>
                  <td className="px-4 py-2 border">Holosystolic</td>
                  <td className="px-4 py-2 border">Apex</td>
                  <td className="px-4 py-2 border">Blowing, high-pitched, radiates to axilla</td>
                  <td className="px-4 py-2 border">
                    <Button variant="ghost" size="sm" onClick={() => playAudio('mitral-regurgitation')}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Mitral Stenosis</td>
                  <td className="px-4 py-2 border">Mid-diastolic</td>
                  <td className="px-4 py-2 border">Apex</td>
                  <td className="px-4 py-2 border">Low-pitched, rumbling, with presystolic accentuation</td>
                  <td className="px-4 py-2 border">
                    <Button variant="ghost" size="sm" onClick={() => playAudio('mitral-stenosis')}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Tricuspid Regurgitation</td>
                  <td className="px-4 py-2 border">Holosystolic</td>
                  <td className="px-4 py-2 border">Left lower sternal border</td>
                  <td className="px-4 py-2 border">Blowing, increases with inspiration</td>
                  <td className="px-4 py-2 border">
                    <Button variant="ghost" size="sm" onClick={() => playAudio('tricuspid-regurgitation')}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Patent Ductus Arteriosus</td>
                  <td className="px-4 py-2 border">Continuous</td>
                  <td className="px-4 py-2 border">Left infraclavicular area</td>
                  <td className="px-4 py-2 border">Machinery-like, heard throughout cardiac cycle</td>
                  <td className="px-4 py-2 border">
                    <Button variant="ghost" size="sm" onClick={() => playAudio('pda')}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Clinical Application Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Clinical Application</h2>
          <p className="mb-4">
            Accurate identification of heart sounds and murmurs is essential for clinical assessment and diagnosis. Here are some key clinical applications:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2 text-red-700">Auscultation Technique</h4>
                <ul className="list-disc pl-5">
                  <li>Use the diaphragm for high-pitched sounds (S₁, S₂, most murmurs)</li>
                  <li>Use the bell for low-pitched sounds (S₃, S₄, mitral stenosis)</li>
                  <li>Auscultate in multiple positions (supine, left lateral, sitting, standing)</li>
                  <li>Listen during different respiratory phases</li>
                  <li>Systematically examine all cardiac listening posts</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2 text-red-700">Cardiac Listening Posts</h4>
                <ul className="list-disc pl-5">
                  <li><strong>Aortic area:</strong> 2nd right intercostal space</li>
                  <li><strong>Pulmonic area:</strong> 2nd left intercostal space</li>
                  <li><strong>Erb's point:</strong> 3rd left intercostal space</li>
                  <li><strong>Tricuspid area:</strong> 4th left intercostal space at sternal border</li>
                  <li><strong>Mitral area (apex):</strong> 5th left intercostal space, midclavicular line</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <h3 className="font-bold text-lg mb-2">Case Study: 68-year-old with Shortness of Breath</h3>
            <p className="mb-2">Clinical Presentation:</p>
            <ul className="list-disc pl-6 mb-2">
              <li>68-year-old male with history of hypertension</li>
              <li>Progressive shortness of breath on exertion</li>
              <li>Occasional dizziness when standing up quickly</li>
              <li>On examination: harsh systolic murmur at right upper sternal border radiating to carotids</li>
              <li>S₄ present</li>
            </ul>
            <p className="mt-2">
              <strong>Interpretation:</strong> Findings consistent with aortic stenosis. The harsh systolic ejection murmur at the right upper sternal border that radiates to the carotids is characteristic. The presence of S₄ indicates decreased ventricular compliance, commonly seen in aortic stenosis as the left ventricle becomes hypertrophic in response to the increased afterload.
            </p>
          </div>
        </div>
        
        {/* Resources and References */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Practice Activities</h2>
          
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Interactive Heart Sound Identification</h3>
            <p className="mb-4">Test your ability to identify heart sounds and murmurs with these practice recordings.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(num => (
                <Button 
                  key={num} 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => playAudio(`practice-${num}`)}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Practice Sound #{num}
                </Button>
              ))}
            </div>
          </div>
          
          <h3 className="font-bold text-lg mb-3">Additional Resources</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2 text-red-600" />
              <a href="#" className="text-red-600 hover:underline">Heart Sounds Reference Guide (PDF)</a>
            </li>
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2 text-red-600" />
              <a href="#" className="text-red-600 hover:underline">Cardiac Auscultation Practice Quiz</a>
            </li>
          </ul>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous: Cardiac Anatomy and Physiology
          </Button>
          <Button>
            Next: ECG Interpretation Basics
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}