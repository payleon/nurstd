import React from 'react';

interface ExplanationPanelProps {
  isVisible: boolean;
  question: any;
  correctAnswer: string | string[];
  explanationText?: string;
}

export function ExplanationPanel({ 
  isVisible, 
  question, 
  correctAnswer,
  explanationText 
}: ExplanationPanelProps) {
  if (!isVisible) return null;

  // Generate the explanation content - this is a simplified example
  // In a real implementation, this would come from your question data
  const topicTitle = question?.title || "Medical Topic";
  
  // Extract the core topic name from the title for highlighting
  const coreTopic = topicTitle.split(" ")[0];
  
  return (
    <div className="bg-white p-4 border-l">
      <div className="mb-4">
        <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm">
          Explanation
        </button>
      </div>
      
      <div className="text-sm">
        <p className="mb-3">
          <strong>{coreTopic}</strong> in children are a significant medical concern and can occur in various
          forms, such as <strong>scalds</strong> from hot liquids or steam, <strong>contact burns</strong> from hot
          objects, <strong>electrical burns</strong>, and <strong>chemical burns</strong>. Children's skin is thinner
          than that of adults, making them more susceptible to deeper burns at
          lower temperatures. The risk factors for burns in children vary with age, with
          younger children more susceptible to scalds and older children to flame-
          related injuries. The nurse should prioritize interventions based on the
          <strong> ABCDE approach</strong>: Airway, Breathing, Circulation, Disability, and
          Exposure/Environmental control.
        </p>
        
        <h4 className="font-bold mb-1">Rationale for correct answer:</h4>
        <p className="mb-3">
          {correctAnswer === "D" ? (
            <>
              <strong>D. Burns involving the face and neck</strong> present a high risk for rapid
              development of <strong>airway edema</strong>, which can lead to <strong>airway obstruction</strong>.
              Immediate intubation is crucial for securing the airway if needed. Ensuring
              <strong> adequate oxygenation</strong> is critical and should be prioritized to prevent
              <strong> hypoxia</strong>.
            </>
          ) : (
            <>
              {explanationText || "The correct answer focuses on prioritizing interventions based on the ABCDE approach, with airway management being the highest priority for burns involving the face and neck."}
            </>
          )}
        </p>
        
        <h4 className="font-bold mb-1">Rationale for incorrect answers:</h4>
        <p>
          While assessment, fluid resuscitation, and wound care are all important in burn management, securing the airway takes precedence according to the ABCDE approach to trauma care.
        </p>
      </div>
    </div>
  );
}