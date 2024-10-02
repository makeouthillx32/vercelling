import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = 'UCvuBk9XEgxn1WUkVvKzTd7g'; // Replace with your channel ID
    const MAX_RESULTS = 1;

    // If no API key is set, return an error.
    if (!API_KEY) {
        return res.status(500).json({ error: 'YouTube API key is missing' });
    }

    // Get the query parameters
    const { type } = req.query;

    try {
        let response;

        if (type === 'channel') {
            // Fetch YouTube channel information
            response = await axios.get(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
            );
        } else if (type === 'latest-video') {
            // Fetch YouTube latest video information
            response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${API_KEY}`
            );
        } else {
            return res.status(400).json({ error: 'Invalid request type. Use "type=channel" or "type=latest-video".' });
        }

        // Send the successful response
        return res.status(200).json(response.data);

    } catch (error) {
        // Catch and return YouTube API errors
        console.error('YouTube API Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Error fetching data from YouTube API', details: error.message });
    }
}
