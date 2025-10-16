
import React, { useState, useCallback } from 'react';
import { detectSpam } from './services/geminiService';
import type { Prediction } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import PredictionResult from './components/PredictionResult';

const App: React.FC = () => {
  const [emailContent, setEmailContent] = useState<string>('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailContent.trim()) {
      setError("Email content cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await detectSpam(emailContent);
      setPrediction(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [emailContent]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-slate-900 p-4 pt-10 text-white sm:p-6 md:p-10">
      <header className="text-center">
        <h1 className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          AI Spam Mail Detection
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-slate-400">
          Paste any email content below and let Gemini analyze if it's spam.
        </p>
      </header>

      <main className="mt-8 w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="group relative">
            <textarea
              id="email-content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter email subject and body here..."
              className="w-full h-64 resize-none rounded-lg border-2 border-slate-700 bg-slate-800 p-4 text-slate-200 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !emailContent}
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Analyzing...</span>
              </>
            ) : (
              'Detect Spam'
            )}
          </button>
        </form>

        <div className="mt-6 flex w-full flex-col items-center">
            {error && <ErrorAlert message={error} />}
            {prediction && !error && <PredictionResult prediction={prediction} />}
        </div>
      </main>

      <footer className="mt-auto pt-8 text-center text-slate-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
