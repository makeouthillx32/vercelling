import axios from 'axios';

// Use environment variables for secure API key storage
export default async function handler(req, res) {
  const API_KEY = process.env.YOUTUBE_API_KEY; // Access the API key from the environment
  const CHANNEL_ID = 'UCvuBk9XEgxn1WUkVvKzTd7g'; // Replace with your actual channel ID
  const MAX_RESULTS = 1;

  try {
    const urlParams = new URLSearchParams(req.url);

    if (urlParams.has('type') && urlParams.get('type') === 'channel') {
      // Fetch YouTube channel information
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      res.status(200).json(response.data);
    } else if (urlParams.has('type') && urlParams.get('type') === 'latest-video') {
      // Fetch YouTube latest video information
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${API_KEY}`
      );
      res.status(200).json(response.data);
    } else {
      res.status(400).json({ error: 'Invalid request type' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
}
