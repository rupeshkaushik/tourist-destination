import React from 'react';

const LandmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        <path d="M18 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
        <path d="M18 16v-2.3"/>
        <path d="M18 20v.01"/>
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center p-6 md:p-8 bg-gray-900 text-white">
        <div className="flex justify-center items-center gap-4 mb-2">
            <LandmarkIcon />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-400">
                Explore Historical Landmarks
            </h1>
        </div>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
        Select a destination to uncover its iconic historical sites with the help of AI.
      </p>
    </header>
  );
};
