import React from "react";
import { Loader2, Heart, Stethoscope, Activity, Thermometer, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

type SpinnerType = "default" | "pulse" | "heartbeat" | "stethoscope" | "temperature";

interface MedicalSpinnerProps {
  type?: SpinnerType;
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
}

export function MedicalSpinner({ 
  type = "default", 
  size = "md", 
  color = "#4B9CD3", 
  text 
}: MedicalSpinnerProps) {
  // Size mapping
  const sizeMap = {
    sm: {
      container: "h-8 w-8",
      icon: 16,
      text: "text-xs"
    },
    md: {
      container: "h-12 w-12",
      icon: 24,
      text: "text-sm"
    },
    lg: {
      container: "h-16 w-16",
      icon: 32,
      text: "text-base"
    }
  };

  // Animation variants
  const pulseAnimation = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const heartbeatAnimation = {
    animate: {
      scale: [1, 1.3, 1, 1.15, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    }
  };

  const rotateAnimation = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const ecgAnimation = {
    initial: { pathLength: 0, pathOffset: 0 },
    animate: {
      pathLength: 1,
      pathOffset: [0, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  const temperatureAnimation = {
    animate: {
      y: [0, -4, 0, -4, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Spinner content based on type
  const renderSpinner = () => {
    switch (type) {
      case "pulse":
        return (
          <motion.div
            variants={pulseAnimation}
            animate="animate"
            className={`${sizeMap[size].container} flex items-center justify-center rounded-full bg-blue-100`}
          >
            <Activity size={sizeMap[size].icon} color={color} />
          </motion.div>
        );
      case "heartbeat":
        return (
          <motion.div 
            variants={heartbeatAnimation}
            animate="animate"
            className={`${sizeMap[size].container} flex items-center justify-center`}
          >
            <Heart size={sizeMap[size].icon} fill={color} color={color} />
          </motion.div>
        );
      case "stethoscope":
        return (
          <motion.div 
            variants={rotateAnimation}
            animate="animate"
            className={`${sizeMap[size].container} flex items-center justify-center`}
          >
            <Stethoscope size={sizeMap[size].icon} color={color} />
          </motion.div>
        );
      case "temperature":
        return (
          <motion.div 
            variants={temperatureAnimation}
            animate="animate"
            className={`${sizeMap[size].container} flex items-center justify-center`}
          >
            <Thermometer size={sizeMap[size].icon} color={color} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            variants={rotateAnimation}
            animate="animate"
            className={`${sizeMap[size].container} flex items-center justify-center`}
          >
            <PlusCircle size={sizeMap[size].icon} color={color} />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderSpinner()}
      {text && (
        <p className={`mt-2 ${sizeMap[size].text} text-gray-600 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingScreen({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <MedicalSpinner type="heartbeat" size="lg" color="#4B9CD3" text={text} />
    </div>
  );
}

export function MedicalLoadingOverlay({ text = "Processing..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
        <MedicalSpinner type="pulse" size="lg" color="#4B9CD3" text={text} />
      </div>
    </div>
  );
}

export function QuestionLoader() {
  return (
    <div className="space-y-6">
      {/* Question title */}
      <div className="flex items-center">
        <MedicalSpinner type="stethoscope" size="sm" />
        <div className="ml-3 bg-gray-200 h-6 w-3/4 rounded animate-pulse"></div>
      </div>
      
      {/* Question text */}
      <div className="space-y-2">
        <div className="bg-gray-200 h-4 w-full rounded animate-pulse"></div>
        <div className="bg-gray-200 h-4 w-5/6 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-4 w-4/6 rounded animate-pulse"></div>
      </div>
      
      {/* Answer options */}
      <div className="space-y-3 mt-8">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-5 w-5 rounded-full bg-gray-200"
          ></motion.div>
          <div className="bg-gray-200 h-12 w-full rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-5 w-5 rounded-full bg-gray-200"
          ></motion.div>
          <div className="bg-gray-200 h-12 w-full rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="h-5 w-5 rounded-full bg-gray-200"
          ></motion.div>
          <div className="bg-gray-200 h-12 w-full rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            className="h-5 w-5 rounded-full bg-gray-200"
          ></motion.div>
          <div className="bg-gray-200 h-12 w-full rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}