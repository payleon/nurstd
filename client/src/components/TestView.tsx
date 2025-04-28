import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Test } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { fetchTestContent } from "@/lib/api";

interface TestViewProps {
  test: Test;
  onBack: () => void;
}

export function TestView({ test, onBack }: TestViewProps) {
  const { data: testContent, isLoading, error } = useQuery({
    queryKey: [`/api/tests/${test.id}/content`],
  });
  
  const [iframeHeight, setIframeHeight] = useState(600);

  // Adjust iframe height based on content
  useEffect(() => {
    const adjustHeight = () => {
      const iframe = document.getElementById('test-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          const height = iframe.contentWindow.document.body.scrollHeight;
          setIframeHeight(height + 50); // Add some padding
        } catch (e) {
          console.error("Could not access iframe content:", e);
        }
      }
    };

    // Try to adjust height once content is loaded
    const iframe = document.getElementById('test-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = adjustHeight;
    }

    // Adjust height periodically for dynamic content
    const interval = setInterval(adjustHeight, 1000);
    return () => clearInterval(interval);
  }, [testContent]);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Button onClick={onBack} className="mb-4 flex items-center" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tests
          </Button>
          <div className="text-red-500">
            Error loading test content: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={onBack} className="bg-primary text-white flex items-center hover:bg-primary/90">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Reset Qbank
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <div className="w-full">
              <iframe
                id="test-iframe"
                title={test.title}
                srcDoc={testContent}
                className="w-full border-0"
                style={{ height: `${iframeHeight}px` }}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
