import { Router } from 'express';
import { createSegment, getSegments, updateSegment, deleteSegment } from '../controllers/rfvSegmentController';

const router = Router();

router.post('/', createSegment);
router.get('/', getSegments);
router.put('/:id', updateSegment);
router.delete('/:id', deleteSegment);

export default router;