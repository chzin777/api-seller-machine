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
    
    // Construct the full local API URL
    const localApiUrl = `http://localhost:${process.env.PORT || 3000}${url}`;
    
    // Forward the request to the local API
    const response = await axios.get(localApiUrl, {
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