import axios from 'axios';

// Access the API credentials from Vercel's environment variables
const API_KEY = process.env.TWITTER_API_KEY;
const API_KEY_SECRET = process.env.TWITTER_API_KEY_SECRET;
const USER_ID = process.env.TWITTER_USER_ID;

if (!API_KEY || !API_KEY_SECRET || !USER_ID) {
  throw new Error("Missing Twitter API credentials or User ID. Make sure they're set in environment variables.");
}

const getBearerToken = async () => {
  try {
    const response = await axios.post(
      'https://api.twitter.com/oauth2/token',
      new URLSearchParams({ 'grant_type': 'client_credentials' }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_KEY_SECRET}`).toString('base64')}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching bearer token:', error);
    return null;
  }
};

const getUserData = async (bearerToken: string) => {
  try {
    const url = `https://api.twitter.com/2/users/${USER_ID}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const getLastPost = async (bearerToken: string) => {
  try {
    const url = `https://api.twitter.com/2/users/${USER_ID}/tweets?max_results=1`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching last post:', error);
    return null;
  }
};

const fetchTwitterData = async () => {
  const bearerToken = await getBearerToken();
  if (!bearerToken) {
    console.error('Failed to get Bearer Token.');
    return;
  }

  const userData = await getUserData(bearerToken);
  const lastPost = await getLastPost(bearerToken);

  const result = {
    user: userData,
    lastPost: lastPost,
  };

  console.log(JSON.stringify(result, null, 2));
};

fetchTwitterData();