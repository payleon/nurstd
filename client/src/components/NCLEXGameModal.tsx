import React from 'react';
import { X } from 'lucide-react';
import { NCLEXGameHub } from './games/NCLEXGameHub';
import { motion, AnimatePresence } from 'framer-motion';

interface NCLEXGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NCLEXGameModal({ isOpen, onClose }: NCLEXGameModalProps) {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
              className="w-full max-w-5xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <NCLEXGameHub onClose={onClose} />
              
              <button
                className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}