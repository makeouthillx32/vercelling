import axios from 'axios';

export default async function handler(req, res) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = 'UCvuBk9XEgxn1WUkVvKzTd7g';

  console.log('Request received:', req.url);  // Log incoming requests
  console.log('API Key:', API_KEY); // Log API key to check if it's correctly set
  console.log('Request type:', req.query.type); // Log the type of request being made

  try {
    if (req.query.type === 'channel') {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
        params: {
          part: 'snippet',
          id: CHANNEL_ID,
          key: API_KEY,
        },
      });
      res.status(200).json(response.data);
    } else if (req.query.type === 'latest-video') {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          channelId: CHANNEL_ID,
          maxResults: 1,
          order: 'date',
          type: 'video',
          key: API_KEY,
        },
      });
      res.status(200).json(response.data);
    } else {
      res.status(400).json({ error: 'Invalid request type' });
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while fetching data from YouTube API' });
  }
}
