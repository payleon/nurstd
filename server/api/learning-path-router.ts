import express from 'express';
import {
  createLearningPath,
  getLearningPath,
  updateLearningPath,
  getAllLearningPaths,
  deleteLearningPath
} from './learning-path';

const router = express.Router();

// Routes for learning paths
router.post('/', createLearningPath);
router.get('/', getAllLearningPaths);
router.get('/:id', getLearningPath);
router.put('/:id', updateLearningPath);
router.delete('/:id', deleteLearningPath);

export default router;