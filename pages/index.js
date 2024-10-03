import React, { useEffect, useState } from 'react'

export default function Home() {
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/youtube?type=channel')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setChannelData(data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Failed to fetch data');
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Welcome to my Next.js site!</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : channelData ? (
        <div>
          <h2 style={{ color: '#666' }}>Channel Info:</h2>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(channelData, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading channel data...</p>
      )}
    </div>
  )
}