import React from 'react';
import { motion } from 'framer-motion';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerType = 'pulse' | 'heartbeat' | 'stethoscope';

interface MedicalSpinnerProps {
  type?: SpinnerType;
  size?: SpinnerSize;
  text?: string;
  className?: string;
  color?: string;
}

export function MedicalSpinner({ 
  type = 'pulse', 
  size = 'md',
  text,
  className,
  color
}: MedicalSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const renderSpinner = () => {
    switch (type) {
      case 'heartbeat':
        return <HeartbeatSpinner size={sizeClasses[size]} />;
      case 'stethoscope':
        return <StethoscopeSpinner size={sizeClasses[size]} />;
      case 'pulse':
      default:
        return <PulseSpinner size={sizeClasses[size]} />;
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}>
      {renderSpinner()}
      {text && (
        <p className={`mt-3 text-[#13294B] ${textSizeClasses[size]}`}>{text}</p>
      )}
    </div>
  );
}

function PulseSpinner({ size }: { size: string }) {
  return (
    <div className={`relative ${size}`}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-[#4B9CD3]"
        fill="none"
        strokeWidth="4"
      >
        <motion.path
          d="M 10,50 L 30,50 L 40,20 L 50,80 L 60,50 L 70,50 L 80,50 L 90,50"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      <motion.div 
        className="absolute inset-0 border-2 border-[#4B9CD3] rounded-full"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeOut"
        }}
      />
    </div>
  );
}

function HeartbeatSpinner({ size }: { size: string }) {
  return (
    <div className={`relative ${size}`}>
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.4,
          ease: "easeOut"
        }}
      >
        <motion.path
          d="M 10,50 L 30,50 L 40,20 L 50,80 L 60,50 L 70,50 L 80,50 L 90,50"
          fill="none"
          stroke="#4B9CD3"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M 50,30 Q50,20 60,20 Q75,20 75,35 Q75,50 50,70 Q25,50 25,35 Q25,20 40,20 Q50,20 50,30 Z"
          fill="#ef4444"
          fillOpacity="0.6"
          stroke="#ef4444"
          strokeWidth="1.5"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.8,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </div>
  );
}

function StethoscopeSpinner({ size }: { size: string }) {
  return (
    <div className={`relative ${size}`}>
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear"
        }}
      >
        <motion.circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="#4B9CD3" 
          strokeWidth="2" 
          fill="none" 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 50,20 C 70,20 70,45 70,50 C 70,60 65,70 50,70 C 35,70 30,60 30,50 C 30,45 30,20 50,20 Z"
          fill="none"
          stroke="#13294B"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <motion.circle 
          cx="50" 
          cy="75" 
          r="6" 
          fill="#4B9CD3" 
          initial={{ scale: 0.5, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </div>
  );
}

interface LoadingScreenProps {
  text?: string;
  minHeight?: string;
}

export function LoadingScreen({ text = "Loading...", minHeight = "400px" }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-[${minHeight}]`} style={{ minHeight }}>
      <MedicalSpinner type="pulse" size="lg" text={text} />
    </div>
  );
}

interface QuestionLoaderProps {
  text?: string;
}

export function QuestionLoader({ text = "Loading question..." }: QuestionLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <MedicalSpinner type="heartbeat" size="md" text={text} />
    </div>
  );
}