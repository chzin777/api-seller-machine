"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfvController_1 = require("../controllers/rfvController");
const router = (0, express_1.Router)();
// Endpoint to create a new set of RFV parameters
router.post('/parameters', rfvController_1.createRfvParameterSet);
// Endpoint to run the RFV analysis
router.get('/analysis', rfvController_1.calculateRfvScores);
exports.default = router;
