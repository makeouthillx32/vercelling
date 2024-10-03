import axios from 'axios';

// Access the Bearer Token from the Vercel environment variable
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

if (!BEARER_TOKEN) {
  console.error("Bearer Token is missing. Make sure it's set in Vercel's environment variables.");
  throw new Error("Missing Bearer Token. Check environment variables.");
}

// Function to get the user ID for @unenterLIVE
const getUserIdByUsername = async (username: string) => {
  try {
    const url = `https://api.twitter.com/2/users/by/username/${username}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    console.log('Fetched User ID:', response.data.data.id); // Log the User ID for debugging
    return response.data.data.id;
  } catch (error) {
    console.error('Error fetching user ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to get the last tweet for a given user ID
const getLast