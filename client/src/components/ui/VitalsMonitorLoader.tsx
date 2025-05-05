import React, { useState, useEffect } from 'react';
import { Heart, Activity } from 'lucide-react';

interface VitalsMonitorLoaderProps {
  isLoading: boolean;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  vitalsData?: {
    heartRate?: { min: number; max: number };
    spO2?: { min: number; max: number };
    bloodPressure?: { systolic: { min: number; max: number }; diastolic: { min: number; max: number } };
    temperature?: { min: number; max: number };
    respiratoryRate?: { min: number; max: number };
  };
}

/**
 * A specialized loader component that simulates a patient vitals monitor
 * Displays realistic vital sign readings that fluctuate within normal ranges
 */
export function VitalsMonitorLoader({
  isLoading,
  size = 'md',
  message = 'Loading patient data...',
  className = '',
  vitalsData = {
    heartRate: { min: 60, max: 100 },
    spO2: { min: 95, max: 100 },
    bloodPressure: { 
      systolic: { min: 110, max: 130 }, 
      diastolic: { min: 70, max: 85 } 
    },
    temperature: { min: 36.5, max: 37.2 },
    respiratoryRate: { min: 12, max: 20 }
  }
}: VitalsMonitorLoaderProps) {
  // State for current vitals
  const [heartRate, setHeartRate] = useState(75);
  const [spO2, setSpO2] = useState(98);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });
  const [temperature, setTemperature] = useState(36.8);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  
  // Size mapping
  const sizeClasses = {
    sm: {
      container: 'max-w-sm p-3',
      text: 'text-xs',
      title: 'text-sm',
    },
    md: {
      container: 'max-w-md p-4',
      text: 'text-sm',
      title: 'text-base',
    },
    lg: {
      container: 'max-w-lg p-5',
      text: 'text-base',
      title: 'text-lg',
    }
  };
  
  // Update vitals at randomized intervals to simulate real-time monitoring
  useEffect(() => {
    if (!isLoading) return;
    
    // Helper to get random value within range
    const getRandomValue = (min: number, max: number) => {
      return Math.round((Math.random() * (max - min) + min) * 10) / 10;
    };
    
    // Update different vitals at different intervals for realism
    const hrInterval = setInterval(() => {
      setHeartRate(getRandomValue(vitalsData.heartRate?.min || 60, vitalsData.heartRate?.max || 100));
    }, 1000);
    
    const spo2Interval = setInterval(() => {
      setSpO2(getRandomValue(vitalsData.spO2?.min || 95, vitalsData.spO2?.max || 100));
    }, 2000);
    
    const bpInterval = setInterval(() => {
      setBloodPressure({
        systolic: getRandomValue(
          vitalsData.bloodPressure?.systolic.min || 110, 
          vitalsData.bloodPressure?.systolic.max || 130
        ),
        diastolic: getRandomValue(
          vitalsData.bloodPressure?.diastolic.min || 70, 
          vitalsData.bloodPressure?.diastolic.max || 85
        )
      });
    }, 3000);
    
    const tempInterval = setInterval(() => {
      setTemperature(getRandomValue(vitalsData.temperature?.min || 36.5, vitalsData.temperature?.max || 37.2));
    }, 5000);
    
    const rrInterval = setInterval(() => {
      setRespiratoryRate(getRandomValue(
        vitalsData.respiratoryRate?.min || 12, 
        vitalsData.respiratoryRate?.max || 20
      ));
    }, 2500);
    
    return () => {
      clearInterval(hrInterval);
      clearInterval(spo2Interval);
      clearInterval(bpInterval);
      clearInterval(tempInterval);
      clearInterval(rrInterval);
    };
  }, [isLoading, vitalsData]);
  
  if (!isLoading) return null;
  
  const currentSize = sizeClasses[size];
  
  return (
    <div className={`bg-black text-green-500 rounded-lg ${currentSize.container} ${className}`}>
      <div className="text-center mb-4">
        <h3 className={`font-mono font-bold ${currentSize.title}`}>PATIENT MONITOR</h3>
        <p className={`text-gray-400 font-mono ${currentSize.text}`}>{message}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Heart Rate */}
        <div className="bg-gray-900 rounded p-2 flex flex-col">
          <div className="flex items-center justify-between">
            <span className={`font-mono ${currentSize.text}`}>HR</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
          </div>
          <div className="flex items-end">
            <span className="font-mono font-bold text-2xl">{Math.round(heartRate)}</span>
            <span className="font-mono text-xs ml-1 mb-1">BPM</span>
          </div>
          <div className="w-full h-6 overflow-hidden">
            <svg className="w-full" height="24" viewBox="0 0 100 24">
              <path
                d="M0,12 L5,12 L7,5 L9,19 L11,12 L13,12 L15,12 L17,12 L20,12 L21,5 L23,19 L25,12 L30,12 L32,12 L35,5 L37,19 L39,12 L41,12 L43,12 L45,12 L50,12 L52,12 L55,12 L57,5 L59,19 L61,12 L63,12 L65,12 L67,12 L70,12 L71,5 L73,19 L75,12 L80,12 L82,12 L85,5 L87,19 L89,12 L91,12 L93,12 L95,12 L100,12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-ekg"
              />
            </svg>
          </div>
        </div>
        
        {/* SpO2 */}
        <div className="bg-gray-900 rounded p-2 flex flex-col">
          <div className="flex items-center justify-between">
            <span className={`font-mono ${currentSize.text}`}>SpO₂</span>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-end">
            <span className="font-mono font-bold text-2xl">{Math.round(spO2)}</span>
            <span className="font-mono text-xs ml-1 mb-1">%</span>
          </div>
          <div className="w-full h-6 bg-gray-800 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-blue-700 transition-all duration-700"
              style={{ width: `${spO2}%` }}
            ></div>
          </div>
        </div>
        
        {/* Blood Pressure */}
        <div className="bg-gray-900 rounded p-2 flex flex-col">
          <span className={`font-mono ${currentSize.text}`}>NIBP</span>
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-xl">
              {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)}
            </span>
            <span className="font-mono text-xs">mmHg</span>
          </div>
          <div className="flex items-center text-xs font-mono text-gray-400 mt-1">
            <span>MAP: {Math.round((bloodPressure.systolic + (2 * bloodPressure.diastolic)) / 3)}</span>
          </div>
        </div>
        
        {/* Temperature */}
        <div className="bg-gray-900 rounded p-2 flex flex-col">
          <span className={`font-mono ${currentSize.text}`}>TEMP</span>
          <div className="flex items-end">
            <span className="font-mono font-bold text-xl">{temperature.toFixed(1)}</span>
            <span className="font-mono text-xs ml-1 mb-0.5">°C</span>
          </div>
          <div className="flex items-center text-xs font-mono text-gray-400 mt-1">
            <span>{((temperature * 9/5) + 32).toFixed(1)}°F</span>
          </div>
        </div>
        
        {/* Respiratory Rate */}
        <div className="bg-gray-900 rounded p-2 flex flex-col col-span-2">
          <span className={`font-mono ${currentSize.text}`}>RESP</span>
          <div className="flex items-end">
            <span className="font-mono font-bold text-xl">{Math.round(respiratoryRate)}</span>
            <span className="font-mono text-xs ml-1 mb-0.5">BPM</span>
          </div>
          <div className="w-full h-4 overflow-hidden mt-1">
            <svg className="w-full" height="16" viewBox="0 0 100 16">
              <path
                d="M0,8 C10,8 10,4 20,4 C30,4 30,12 40,12 C50,12 50,4 60,4 C70,4 70,12 80,12 C90,12 90,4 100,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="animate-pulse-slow"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}