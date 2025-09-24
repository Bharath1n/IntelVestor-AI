import { useState, useEffect } from 'react';
import { getPrediction } from '../api/api';
import { useAuth } from '@clerk/clerk-react';

interface Prediction {
  symbol: string;
  prediction: number[];
  sentiment: { score: number; headlines: string[] };
  shap: { feature: string; value: number }[];
  explanation: string;
}

const Predictions: React.FC = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState<Prediction | null>(null);
  const [symbol, setSymbol] = useState('AXISBANK');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No auth token');
        const result = await getPrediction(symbol, 30, token);
        setData(result);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      }
    };
    fetchData();
  }, [getToken, symbol]);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">Stock Predictions</h1>
        <div className="mb-4">
          <label htmlFor="symbol-input" className="text-lg font-semibold text-blue-400">
            Stock Symbol:
          </label>
          <input
            id="symbol-input"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="ml-2 p-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="e.g., AXISBANK"
          />
        </div>
        {data ? (
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <p className="text-lg">Sentiment Score: <span className="font-semibold">{data.sentiment.score}</span></p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Headlines</h3>
            <ul className="list-disc pl-5">
              {data.sentiment.headlines.map((headline: string, i: number) => (
                <li key={i} className="mb-1">{headline}</li>
              ))}
            </ul>
            <p className="mt-4">Explanation: <span className="italic">{data.explanation}</span></p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Predictions;