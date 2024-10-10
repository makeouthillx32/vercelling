import React, { useEffect, useState } from 'react';

export default function Home() {
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    fetch('/api/youtube?type=channel')
      .then((response) => response.json())
      .then((data) => setChannelData(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to my Next.js site!</h1>
      {channelData ? (
        <div>
          <h2>Channel Info:</h2>
          <pre>{JSON.stringify(channelData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading channel data...</p>
      )}
    </div>
  );
}
