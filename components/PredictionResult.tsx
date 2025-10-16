
import React from 'react';
import type { Prediction } from '../types';

interface PredictionResultProps {
  prediction: Prediction;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ShieldExclamationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  const isSpam = prediction.is_spam;
  const resultClasses = isSpam
    ? 'border-red-500 bg-red-900/20 text-red-300'
    : 'border-green-500 bg-green-900/20 text-green-300';
  const title = isSpam ? 'SPAM DETECTED' : 'NOT SPAM';
  const Icon = isSpam ? ShieldExclamationIcon : CheckIcon;

  return (
    <div className={`mt-6 w-full max-w-2xl rounded-lg border-2 ${resultClasses} p-6 shadow-lg transition-all duration-300 ease-in-out animate-fade-in`}>
      <div className="flex flex-col items-center text-center">
        <Icon />
        <h2 className={`mt-4 text-3xl font-bold ${isSpam ? 'text-red-400' : 'text-green-400'}`}>
          {title}
        </h2>
        <div className="mt-4 h-px w-1/2 bg-slate-600"></div>
        <p className="mt-4 text-lg font-semibold text-slate-300">AI's Reason:</p>
        <p className="mt-1 text-slate-400">{prediction.reason}</p>
      </div>
    </div>
  );
};

// Add fade-in animation keyframes to the global style
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default PredictionResult;
