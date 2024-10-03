import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const API_KEY = process.env.YOUTUBE_API_KEY || '';
const CHANNEL_ID = 'UCvuBk9XEgxn1WUkVvKzTd7g';
const MAX_RESULTS = 1;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end(); // Handle CORS preflight with 204 No Content
    }

    try {
        // Fetch channel info
        const channelInfoURL = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
        const channelInfoResponse = await axios.get(channelInfoURL);
        const channelInfo = channelInfoResponse.data.items[0]?.snippet;

        // Fetch latest video
        const latestVideoURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${API_KEY}`;
        const latestVideoResponse = await axios.get(latestVideoURL);
        const videoInfo = latestVideoResponse.data.items[0]?.snippet;
        const videoId = latestVideoResponse.data.items[0]?.id?.videoId;

        // Check for null responses
        if (!channelInfo || !videoInfo || !videoId) {
            return res.status(404).json({ error: 'Channel or video data not found' });
        }

        // Send JSON response
        res.status(200).json({
            channel: {
                title: channelInfo.title,
                description: channelInfo.description,
                thumbnail: channelInfo.thumbnails.high.url,
                link: `https://www.youtube.com/channel/${CHANNEL_ID}`
            },
            latestVideo: {
                title: videoInfo.title,
                description: videoInfo.description,
                thumbnail: videoInfo.thumbnails.high.url,
                link: `https://www.youtube.com/watch?v=${videoId}`
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        res.status(500).json({ error: 'An error occurred while fetching data from YouTube API' });
    }
}
