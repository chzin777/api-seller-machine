import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Proxy route to forward requests to local API
router.get('/', async (req: Request, res: Response) => {
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
    const response = await axios.get(apiUrl, {
      params: req.query,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Return the response from the local API
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      // Forward the error response from the local API
      res.status(error.response.status).json(error.response.data);
    } else {
      // Handle network or other errors
      res.status(500).json({ 
        error: 'Proxy request failed', 
        message: error.message 
      });
    }
  }
});

export default router;