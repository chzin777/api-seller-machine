"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// Proxy route to forward requests to local API
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.query;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'URL parameter is required' });
        }
        // Construct the full API URL
        // When running locally, use localhost. When deployed, use the production URL
        const isProduction = process.env.NODE_ENV === 'production';
        const baseUrl = isProduction
            ? (process.env.RAILWAY_STATIC_URL || process.env.API_BASE_URL || `https://api-maquina-de-vendas-production.up.railway.app`)
            : `http://localhost:${process.env.PORT || 3000}`;
        const apiUrl = `${baseUrl}${url}`;
        // Forward the request to the API
        const response = yield axios_1.default.get(apiUrl, {
            params: req.query,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Return the response from the local API
        res.status(response.status).json(response.data);
    }
    catch (error) {
        console.error('Proxy error:', error.message);
        if (error.response) {
            // Forward the error response from the local API
            res.status(error.response.status).json(error.response.data);
        }
        else {
            // Handle network or other errors
            res.status(500).json({
                error: 'Proxy request failed',
                message: error.message
            });
        }
    }
}));
exports.default = router;
