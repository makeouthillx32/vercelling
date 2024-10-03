import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const API_KEY = process.env.YOUTUBE_API_KEY || ''; // Replace with your YouTube API key
const CHANNEL_ID = 'UCvuBk9XEgxn1WUkVvKzTd7g'; // Replace with your channel ID
const MAX_RESULTS = 1;

// Helper function to fetch YouTube API data
const fetchYouTubeAPI = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from YouTube API:', error);
    throw new Error('API request failed');
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Fetch channel info
    const channelInfoURL = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
    const channelInfoResponse = await fetchYouTubeAPI(channelInfoURL);
    const channelInfo = channelInfoResponse.items[0].snippet;

    // Fetch latest video
    const latestVideoURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${API_KEY}`;
    const latestVideoResponse = await fetchYouTubeAPI(latestVideoURL);
    const videoInfo = latestVideoResponse.items[0].snippet;
    const videoId = latestVideoResponse.items[0].id.videoId;

    // Send JSON response with channel and latest video data
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
    res.status(500).json({ error: 'An error occurred while fetching data from YouTube API' });
  }
}
