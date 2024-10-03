import axios from 'axios';

// Access the Bearer Token from environment variables
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

if (!BEARER_TOKEN) {
  console.error("Bearer Token is missing. Ensure it's set in the environment variables.");
  throw new Error("Missing Bearer Token.");
}

// Example function to get user data from Twitter API
const fetchLastTweet = async () => {
  try {
    const url = `https://api.twitter.com/2/users/by/username/unenterLIVE`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,  // Correctly using Bearer Token here
      },
    });

    console.log('User data:', response.data);
  } catch (error) {
    console.error('Error fetching user data:', error.response ? error.response.data : error.message);
  }
};

fetchLastTweet();
