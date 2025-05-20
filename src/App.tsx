import React, { useState } from 'react';
import { getModel } from './ai/providers';

export default function App() {
  const [query, setQuery] = useState('');
  const [breadth, setBreadth] = useState(4);
  const [depth, setDepth] = useState(2);
  const [isReport, setIsReport] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3051/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          breadth,
          depth,
          isReport,
        }),
      });
      
      const data = await response.json();
      setResult(isReport ? data.answer : data.exactAnswer);
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Deep Research Assistant</h1>
          <p className="text-lg text-gray-600">Powered by {getModel().modelId}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to research?
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="breadth" className="block text-sm font-medium text-gray-700 mb-2">
                  Research Breadth (2-10)
                </label>
                <input
                  type="number"
                  id="breadth"
                  value={breadth}
                  onChange={(e) => setBreadth(Number(e.target.value))}
                  min="2"
                  max="10"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="depth" className="block text-sm font-medium text-gray-700 mb-2">
                  Research Depth (1-5)
                </label>
                <input
                  type="number"
                  id="depth"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  min="1"
                  max="5"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isReport}
                  onChange={(e) => setIsReport(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Generate detailed report (instead of specific answer)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Researching...' : 'Start Research'}
            </button>
          </form>

          {result && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}