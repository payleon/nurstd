import React from 'react';
import { ContextualHelp } from '@/components/ui/contextual-help';
import { Tooltip } from '@/components/ui/animated-tooltip';
import { TooltipProvider } from '@/components/ui/animated-tooltip';
import { Button } from '@/components/ui/button';

export default function TooltipDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Animated Tooltip Components</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Contextual Help Tooltips</h2>
        <div className="flex flex-wrap gap-6 p-4 border-2 border-black rounded-lg">
          <div className="flex items-center">
            <span className="mr-2">Info Help:</span>
            <ContextualHelp 
              type="info"
              content={<p>This is helpful information for the user to understand this concept.</p>}
            />
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">Help Icon:</span>
            <ContextualHelp 
              type="help"
              content={<p>This gives additional guidance or explains complex features.</p>}
            />
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">Warning Help:</span>
            <ContextualHelp 
              type="warning" 
              content={
                <div>
                  <p className="font-semibold">Important!</p>
                  <p>This action cannot be undone. Please proceed with caution.</p>
                </div>
              }
            />
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">Definition:</span>
            <ContextualHelp 
              type="definition" 
              content={
                <div>
                  <p className="font-semibold">Pulse Oximetry</p>
                  <p>A non-invasive method for monitoring a person's oxygen saturation.</p>
                </div>
              }
            />
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Different Sizes</h2>
        <div className="flex flex-wrap gap-6 p-4 border-2 border-black rounded-lg">
          <div className="flex items-center">
            <span className="mr-2">Small:</span>
            <ContextualHelp 
              size="sm"
              content={<p>Small contextual help tooltip</p>}
            />
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">Medium:</span>
            <ContextualHelp 
              size="md"
              content={<p>Medium contextual help tooltip</p>}
            />
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">Large:</span>
            <ContextualHelp 
              size="lg"
              content={<p>Large contextual help tooltip</p>}
            />
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Custom Tooltips</h2>
        <div className="flex flex-wrap gap-6 p-4 border-2 border-black rounded-lg">
          <TooltipProvider>
            <Tooltip 
              content={
                <div>
                  <p className="font-semibold">Custom Tooltip</p>
                  <p>This tooltip uses the animated tooltip component directly</p>
                </div>
              }
            >
              <Button>Hover Me</Button>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip 
              content="This tooltip appears from the right side"
              side="right"
            >
              <Button variant="secondary">Side: Right</Button>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip 
              content="This tooltip appears below"
              side="bottom"
              contentClassName="bg-pink-50 border-pink-200"
            >
              <Button variant="outline">Bottom w/ Pink</Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Inline Text Examples</h2>
        <div className="p-4 border-2 border-black rounded-lg">
          <p className="mb-4">
            The Nursing Process is a systematic 
            <ContextualHelp 
              inline 
              content={<p>A way of organizing care in a logical sequence</p>}
            /> 
            approach to delivering patient care. It consists of several steps: Assessment
            <ContextualHelp 
              inline 
              type="definition"
              content={<p>The systematic collection of data about a patient</p>}
            />, 
            Diagnosis
            <ContextualHelp 
              inline 
              type="definition"
              content={<p>Clinical judgment about patient response to health conditions</p>}
            />, 
            Planning, Implementation, and Evaluation.
          </p>
        </div>
      </section>
    </div>
  );
}