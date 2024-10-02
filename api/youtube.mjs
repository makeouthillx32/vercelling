export default async function handler(req, res) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = 'UCvuBk9XEgxn1WUkVvKzTd7g';
  
    console.log('Request received:', req.url);  // Log incoming requests
  
    const urlParams = new URLSearchParams(req.url);
  
    if (urlParams.has('type') && urlParams.get('type') === 'channel') {
      // Fetch YouTube channel information
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`);
      res.status(200).json(response.data);
    } else if (urlParams.has('type') && urlParams.get('type') === 'latest-video') {
      // Fetch latest video
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&key=${API_KEY}`);
      res.status(200).json(response.data);
    } else {
      res.status(400).json({ error: 'Invalid request type' });
    }
  }
  