import axios from 'axios';

// Access the API credentials from Vercel's environment variables
const API_KEY = process.env.TWITTER_API_KEY;
const API_KEY_SECRET = process.env.TWITTER_API_KEY_SECRET;
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

if (!API_KEY || !API_KEY_SECRET || !BEARER_TOKEN) {
  throw new Error("Missing Twitter API credentials in environment variables.");
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

    console.log('Fetched User ID:', response.data.data.id); // Log the User ID
    return response.data.data.id;
  } catch (error) {
    console.error('Error fetching user ID:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Function to get the last tweet for a given user ID
const getLastPost = async (userId: string) => {
  try {
    const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=1`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    console.log('Last post fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching last post:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Main function to fetch the last tweet from @unenterLIVE
const fetchLastPostFromUnenterLIVE = async () => {
  const username = 'unenterLIVE';
  const userId = await getUserIdByUsername(username);

  if (!userId) {
    console.error('Failed to fetch User ID for @unenterLIVE');
    return;
  }

  const lastPost = await getLastPost(userId);

  console.log('Last post from @unenterLIVE:', JSON.stringify(lastPost, null, 2));
};

fetchLastPostFromUnenterLIVE();
