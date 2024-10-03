import axios from 'axios';

// Access the Bearer Token from the Vercel environment variables
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

if (!BEARER_TOKEN) {
  console.error("Bearer Token is missing. Make sure it's set as an environment variable in Vercel.");
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

    console.log('Fetched User ID:', response.data.data.id);
    return response.data.data.id;
  } catch (error) {
    console.error('Error fetching user ID:', error.response ? error.response.data : error.message);
    throw error;
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
    throw error;
  }
};

// Main function to fetch the last tweet from @unenterLIVE
const fetchLastPostFromUnenterLIVE = async () => {
  const username = 'unenterLIVE';

  try {
    console.log(`Fetching user ID for ${username}...`);
    const userId = await getUserIdByUsername(username);

    if (!userId) {
      console.error('Failed to fetch User ID for @unenterLIVE');
      return;
    }

    console.log('Fetching last post for user ID:', userId);
    const lastPost = await getLastPost(userId);

    console.log('Last post from @unenterLIVE:', JSON.stringify(lastPost, null, 2));
  } catch (error) {
    console.error('An error occurred during execution:', error.message);
    throw error;  // Ensure that the error is propagated to Vercel logs
  }
};

// Execute the main function
fetchLastPostFromUnenterLIVE();
