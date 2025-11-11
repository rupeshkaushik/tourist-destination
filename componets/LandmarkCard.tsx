import React from 'react';
import { Landmark } from '../types';

interface LandmarkCardProps {
  landmark: Landmark;
}

export const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
      <img className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" src={landmark.imageUrl} alt={`Image of ${landmark.name}`} />
      <div className="p-6">
        <h3 className="font-bold text-2xl mb-2 text-teal-300">{landmark.name}</h3>
        <p className="text-gray-300 text-base leading-relaxed">
          {landmark.description}
        </p>
      </div>
    </div>
  );
};
