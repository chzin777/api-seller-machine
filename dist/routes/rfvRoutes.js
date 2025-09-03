"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfvController_1 = require("../controllers/rfvController");
const router = (0, express_1.Router)();
// Endpoint to create a new set of RFV parameters
router.post('/parameters', rfvController_1.createRfvParameterSet);
// Endpoint to run the RFV analysis
router.get('/analysis', rfvController_1.calculateRfvScores);
// Endpoints for RFV Segments
router.post('/segments', rfvController_1.createRfvSegment);
router.get('/segments', rfvController_1.getRfvSegments);
router.put('/segments/:id', rfvController_1.updateRfvSegment);
router.delete('/segments/:id', rfvController_1.deleteRfvSegment);
exports.default = router;
