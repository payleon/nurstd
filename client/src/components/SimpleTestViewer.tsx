import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Test, Question, QuestionsResponse } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { fetchTestContent } from "@/lib/api";

interface SimpleTestViewerProps {
  test: Test;
  onBack: () => void;
}

export function SimpleTestViewer({ test, onBack }: SimpleTestViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testContent, setTestContent] = useState<string | QuestionsResponse | null>(null);

  const loadTest = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Manually fetching test content for ID: ${test.id}`);
      const content = await fetchTestContent(test.id);
      console.log("Fetched content:", content);
      setTestContent(content);
    } catch (err) {
      console.error("Error loading test:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  let contentDisplay;
  if (loading) {
    contentDisplay = <div className="p-4 text-center">Loading test content...</div>;
  } else if (error) {
    contentDisplay = <div className="p-4 text-red-500">Error: {error}</div>;
  } else if (!testContent) {
    contentDisplay = (
      <div className="p-4 text-center">
        <Button 
          onClick={loadTest} 
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Load Test Content
        </Button>
      </div>
    );
  } else if (typeof testContent === 'object' && 'questions' in testContent) {
    // JSON content with questions
    contentDisplay = (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Questions Loaded: {testContent.questions.length}</h2>
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-bold">First Question:</h3>
          {testContent.questions[0] ? (
            <div>
              <p className="mb-2"><span className="font-semibold">Title:</span> {testContent.questions[0].title}</p>
              <p className="mb-2"><span className="font-semibold">Question:</span> {testContent.questions[0].text}</p>
              <p className="mb-2"><span className="font-semibold">Type:</span> {testContent.questions[0].type}</p>
            </div>
          ) : (
            <p>No questions found</p>
          )}
        </div>
      </div>
    );
  } else {
    // HTML content
    contentDisplay = (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">HTML Content Loaded</h2>
        <div className="border p-4 mb-4 rounded">
          <p>Length: {typeof testContent === 'string' ? testContent.length : 0} characters</p>
          <iframe
            srcDoc={typeof testContent === 'string' ? testContent : ''}
            className="w-full border rounded mt-4"
            style={{ height: '400px' }}
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-700 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Simple Test Viewer: {test.title}</h1>
          <Button variant="outline" onClick={onBack} className="text-white border-white hover:bg-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      {contentDisplay}
    </div>
  );
}