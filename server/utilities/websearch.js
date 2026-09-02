import axios from 'axios';

export async function webSearch(query) {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: { q: query, api_key: process.env.SEARCH_API_KEY, num: 5 }
    });
    return response.data.organic_results?.map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet || ''
    })) || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
