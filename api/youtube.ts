import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const API_KEY = process.env.YOUTUBE_API_KEY || '';
const CHANNEL_ID = 'UCvuBk9XEgxn1WUkVvKzTd7g';

const fetchYouTubeAPI = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log the API key to check if it's being retrieved correctly
  console.log('YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY);

  try {
    // Construct YouTube API URLs
    const channelInfoURL = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`;
    console.log('Channel Info URL:', channelInfoURL);  // Log the request URL
    
    const channelInfoResponse = await fetchYouTubeAPI(channelInfoURL);
    const channelInfo = channelInfoResponse.items[0].snippet;

    const latestVideoURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${process.env.YOUTUBE_API_KEY}`;
    console.log('Latest Video URL:', latestVideoURL);  // Log the request URL

    const latestVideoResponse = await fetchYouTubeAPI(latestVideoURL);
    const videoInfo = latestVideoResponse.items[0].snippet;
    const videoId = latestVideoResponse.items[0].id.videoId;

    // Respond with channel and video info
    res.status(200).json({
      channel: {
        title: channelInfo.title,
        description: channelInfo.description,
        thumbnail: channelInfo.thumbnails.high.url,
        link: `https://www.youtube.com/channel/${CHANNEL_ID}`,
      },
      latestVideo: {
        title: videoInfo.title,
        description: videoInfo.description,
        thumbnail: videoInfo.thumbnails.high.url,
        link: `https://www.youtube.com/watch?v=${videoId}`,
      },
    });
  } catch (error) {
    console.error('Error fetching data from YouTube API:', error);  // Log any API error
    res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
  }
}
