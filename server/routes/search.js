import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    // Using SerpAPI as example; replace with your provider
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        q,
        api_key: process.env.SEARCH_API_KEY,
        num: 5
      }
    });

    const results = response.data.organic_results?.map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet || ''
    })) || [];

    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

export default router;
