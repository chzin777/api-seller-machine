import { Router } from 'express';
import { createRfvParameterSet, calculateRfvScores } from '../controllers/rfvController';

const router = Router();

// Endpoint to create a new set of RFV parameters
router.post('/parameters', createRfvParameterSet);

// Endpoint to run the RFV analysis
router.get('/analysis', calculateRfvScores);

export default router;