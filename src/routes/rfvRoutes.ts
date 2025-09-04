import { Router } from 'express';
import { createRfvParameterSet, getRfvParameterSets, calculateRfvScores, createRfvSegment, getRfvSegments, updateRfvSegment, deleteRfvSegment } from '../controllers/rfvController';

const router = Router();

// Endpoints for RFV Parameters
router.get('/parameters', getRfvParameterSets);
router.post('/parameters', createRfvParameterSet);

// Endpoint to run the RFV analysis
router.get('/analysis', calculateRfvScores);

// Endpoints for RFV Segments
router.post('/segments', createRfvSegment);
router.get('/segments', getRfvSegments);
router.put('/segments/:id', updateRfvSegment);
router.delete('/segments/:id', deleteRfvSegment);

export default router;