import React, { useState, useEffect } from 'react';
import { getPrediction } from '../../api/api';

const SentimentAnalysis = () => {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPrediction(symbol, 30);
        setData(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Sentiment Analysis</h2>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        placeholder="Enter stock symbol"
        className="p-2 bg-gray-800 text-white rounded"
      />
      {data && (
        <div className="mt-4">
          <p>Sentiment Score: {data.sentiment.score}</p>
          <ul>
            {data.sentiment.top_headlines.map((headline, i) => (
              <li key={i} className="text-gray-300">{headline}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;