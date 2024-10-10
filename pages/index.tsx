import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface ChannelData {
  items: Array<{
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
    };
  }>;
}

export default function Home() {
  const [channelData, setChannelData] = useState<ChannelData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios.get('/api/youtube?type=channel')
      .then(response => {
        setChannelData(response.data)
      })
      .catch(error => {
        console.error('Error:', error)
        setError('Failed to fetch data')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">YouTube Channel Info</h1>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : channelData ? (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">{channelData.items[0].snippet.title}</h2>
            <p className="text-gray-600 mb-4">{channelData.items[0].snippet.description}</p>
            <img 
              src={channelData.items[0].snippet.thumbnails.medium.url} 
              alt={channelData.items[0].snippet.title}
              className="w-full rounded-lg shadow-sm"
            />
          </div>
        ) : (
          <p className="text-gray-500">Loading channel data...</p>
        )}
      </div>
    </div>
  )
}