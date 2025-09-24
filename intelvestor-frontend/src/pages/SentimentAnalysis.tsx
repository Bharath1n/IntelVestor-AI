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

const SentimentAnalysis: React.FC = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState<Prediction | null>(null);
  const [symbol, setSymbol] = useState('AXISBANK');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Authentication failed. Please sign in again.');
        }
        const result = await getPrediction(symbol, 30, token);
        setData(result);
      } catch (error: any) {
        console.error('Error fetching sentiment:', error);
        setError(error.message || 'Failed to fetch sentiment data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken, symbol]);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">Sentiment Analysis</h1>
        <div className="mb-4">
          <label htmlFor="symbol-input" className="text-lg font-semibold text-blue-400">
            Stock Symbol:
          </label>
          <input
            id="symbol-input"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="ml-2 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AXISBANK"
          />
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : data ? (
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <p className="text-lg">
              Sentiment Score: <span className="font-semibold">{data.sentiment.score}</span>
            </p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Headlines</h3>
            <ul className="list-disc pl-5">
              {data.sentiment.headlines.map((headline: string, i: number) => (
                <li key={i} className="mb-1">{headline}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalysis;