import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Calculator, BrainCircuit, Award, PanelRight, ArrowRight, Stethoscope, ListTodo } from 'lucide-react';
import { lazyLoad } from '@/utils/lazyLoad';
import { LazyComponentLoader } from '@/components/ui/LazyComponentLoader';

const NursingPriorityGame = lazyLoad(() => 
  import('./NursingPriorityGame').then(mod => ({ default: mod.NursingPriorityGame }))
);

const MedicationDosageGame = lazyLoad(() => 
  import('./MedicationDosageGame').then(mod => ({ default: mod.MedicationDosageGame }))
);

interface NCLEXGameHubProps {
  onClose?: () => void;
}

type GameType = 'prioritization' | 'dosage' | 'hub';

interface GameScore {
  name: string;
  score: number;
  date: Date;
}

export function NCLEXGameHub({ onClose }: NCLEXGameHubProps) {
  const [currentGame, setCurrentGame] = useState<GameType>('hub');
  const [gameHistory, setGameHistory] = useState<GameScore[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  
  const handleGameComplete = (game: string, score: number): void => {
    const newScore = {
      name: game,
      score,
      date: new Date()
    };
    
    setGameHistory([newScore, ...gameHistory]);
    setTotalPoints(prev => prev + score);
  };
  
  const returnToHub = () => {
    setCurrentGame('hub');
  };
  
  if (currentGame === 'prioritization') {
    return (
      <LazyComponentLoader spinnerType="stethoscope" text="Loading nursing priority game..." minHeight="600px">
        <NursingPriorityGame 
          onComplete={(score: number) => handleGameComplete('Nursing Priority', score)} 
          onClose={returnToHub}
        />
      </LazyComponentLoader>
    );
  }
  
  if (currentGame === 'dosage') {
    return (
      <LazyComponentLoader spinnerType="pulse" text="Loading medication dosage game..." minHeight="600px">
        <MedicationDosageGame
          onComplete={(score: number) => handleGameComplete('Medication Dosage', score)}
          onClose={returnToHub}
        />
      </LazyComponentLoader>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      <div className="bg-[#13294B] text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5" />
          NCLEX Learning Games
        </h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white hover:bg-[#0A1E3A] p-1 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-8 text-center">
          <h3 className="text-lg text-[#13294B] font-bold mb-4">
            Choose a game to enhance your NCLEX preparation
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These interactive games are designed to strengthen critical nursing skills tested on the NCLEX exam.
            Practice prioritization, medication calculations, and more while having fun!
          </p>
          
          {gameHistory.length > 0 && (
            <div className="mt-4 flex items-center justify-center">
              <Award className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-bold text-[#4B9CD3]">Total Points: {totalPoints}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Nursing Priority Game Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 overflow-hidden shadow-sm"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <ListTodo className="h-5 w-5" />
                </div>
                <h3 className="ml-3 text-lg font-bold text-blue-800">Nursing Priority Challenge</h3>
              </div>
              
              <p className="text-blue-700 mb-4">
                Test your ability to prioritize nursing interventions correctly, a critical skill for the
                NCLEX exam. Drag and arrange interventions in the correct priority order.
              </p>
              
              <div className="flex items-center text-sm text-blue-600 mb-4">
                <Activity className="h-4 w-4 mr-1.5" />
                <span>60 seconds per scenario</span>
                <span className="mx-1.5">•</span>
                <Stethoscope className="h-4 w-4 mr-1.5" />
                <span>5 clinical scenarios</span>
              </div>
              
              <button
                onClick={() => setCurrentGame('prioritization')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center transition-colors"
              >
                Start Game <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </motion.div>
          
          {/* Medication Dosage Game Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 overflow-hidden shadow-sm"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <Calculator className="h-5 w-5" />
                </div>
                <h3 className="ml-3 text-lg font-bold text-purple-800">Medication Dosage Calculator</h3>
              </div>
              
              <p className="text-purple-700 mb-4">
                Practice medication calculations including weight-based dosing, IV drip rates,
                and medication conversions. Sharpen your math skills for the NCLEX.
              </p>
              
              <div className="flex items-center text-sm text-purple-600 mb-4">
                <Activity className="h-4 w-4 mr-1.5" />
                <span>90 seconds per question</span>
                <span className="mx-1.5">•</span>
                <Calculator className="h-4 w-4 mr-1.5" />
                <span>Built-in calculator</span>
              </div>
              
              <button
                onClick={() => setCurrentGame('dosage')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md flex items-center justify-center transition-colors"
              >
                Start Game <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Recent Game History */}
        {gameHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-[#13294B] mb-3 flex items-center">
              <PanelRight className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
            
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-500">Game</th>
                    <th className="text-right py-2 font-medium text-gray-500">Score</th>
                    <th className="text-right py-2 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.slice(0, 5).map((game, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 text-gray-800">{game.name}</td>
                      <td className="py-2 text-right font-medium text-gray-800">{game.score}</td>
                      <td className="py-2 text-right text-gray-500">
                        {game.date.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}