import React from 'react';
import { motion } from 'framer-motion';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerType = 'pulse' | 'heartbeat' | 'stethoscope' | 'nurse' | 'iv-drip' | 'cardiogram';

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
      case 'nurse':
        return <NurseSpinner size={sizeClasses[size]} />;
      case 'iv-drip':
        return <IVDripSpinner size={sizeClasses[size]} />;
      case 'cardiogram':
        return <CardiogramSpinner size={sizeClasses[size]} />;
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

function NurseSpinner({ size }: { size: string }) {
  return (
    <div className={`relative ${size}`}>
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ y: 0 }}
        animate={{ y: [-2, 2, -2] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        {/* Nurse Cap */}
        <motion.path
          d="M 35,35 L 65,35 L 60,25 L 40,25 Z"
          fill="#FFFFFF"
          stroke="#13294B"
          strokeWidth="2"
          initial={{ y: 0 }}
          animate={{ y: -2 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
            ease: "easeInOut"
          }}
        />
        
        {/* Red Cross on Cap */}
        <motion.path
          d="M 47,30 L 47,25 M 44,27.5 L 50,27.5"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
            ease: "easeInOut"
          }}
        />
        
        {/* Nurse Face */}
        <motion.circle
          cx="50"
          cy="45"
          r="10"
          fill="#FFD8B5"
          stroke="#13294B"
          strokeWidth="1"
        />
        
        {/* Nurse Body */}
        <motion.path
          d="M 40,55 L 40,75 L 60,75 L 60,55 Z"
          fill="#FFFFFF"
          stroke="#13294B"
          strokeWidth="2"
        />
        
        {/* Red Cross on Uniform */}
        <motion.path
          d="M 50,60 L 50,70 M 45,65 L 55,65"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1.1, opacity: 1 }}
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

function IVDripSpinner({ size }: { size: string }) {
  return (
    <div className={`relative ${size}`}>
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* IV Stand */}
        <motion.path
          d="M 50,10 L 50,90"
          stroke="#13294B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* IV Bag */}
        <motion.path
          d="M 40,15 L 60,15 L 60,35 L 40,35 Z"
          fill="none"
          stroke="#4B9CD3"
          strokeWidth="2"
        />
        
        {/* IV Fluid Level */}
        <motion.rect
          x="40"
          y="25"
          width="20"
          height="10"
          fill="#4B9CD3"
          initial={{ y: 25, height: 10 }}
          animate={{ y: 30, height: 5 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 3,
            ease: "linear"
          }}
        />
        
        {/* IV Tube */}
        <motion.path
          d="M 50,35 C 50,35 45,45 50,55 C 55,65 50,75 50,75"
          fill="none"
          stroke="#4B9CD3"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -20 }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear"
          }}
        />
        
        {/* IV Drip Animation */}
        <motion.circle
          cx="50"
          cy="42"
          r="2"
          fill="#4B9CD3"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 30, opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            times: [0, 0.2, 1],
            ease: "easeIn"
          }}
        />
      </motion.svg>
    </div>
  );
}

function CardiogramSpinner({ size }: { size: string }) {
  return (
    <div className={`relative ${size}`}>
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ECG Background Grid */}
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
        </pattern>
        <rect width="100" height="100" fill="url(#grid)" opacity="0.5" />
        
        {/* ECG Line */}
        <motion.path
          d="M 0,50 L 20,50 L 25,50 L 30,20 L 35,80 L 40,50 L 45,50 L 60,50 L 100,50"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: 1 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear"
          }}
        />
        
        {/* Heart Symbol */}
        <motion.path
          d="M 75,60 Q75,50 85,50 Q95,50 95,60 Q95,70 75,85 Q55,70 55,60 Q55,50 65,50 Q75,50 75,60 Z"
          fill="#ef4444"
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.6,
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
  spinnerType?: SpinnerType;
}

export function LoadingScreen({ 
  text = "Loading...", 
  minHeight = "400px",
  spinnerType = "cardiogram"
}: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-[${minHeight}]`} style={{ minHeight }}>
      <MedicalSpinner type={spinnerType} size="lg" text={text} />
    </div>
  );
}

interface QuestionLoaderProps {
  text?: string;
  spinnerType?: SpinnerType;
}

export function QuestionLoader({ 
  text = "Loading question...",
  spinnerType = "heartbeat" 
}: QuestionLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <MedicalSpinner type={spinnerType} size="md" text={text} />
    </div>
  );
}
