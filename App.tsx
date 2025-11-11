import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LocationInput } from './components/LocationInput';
import { BookingModal } from './components/BookingModal';
import { LandmarkCard } from './components/LandmarkCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { fetchLandmarks, planTrip } from './services/geminiService';
import { Landmark, BookingDetails } from './types';

const WelcomeMessage: React.FC = () => (
    <div className="text-center p-10 text-gray-400">
        <h2 className="text-2xl font-semibold mb-2 text-white">Welcome!</h2>
        <p>Enter a destination above to begin your historical journey.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-10 bg-red-900/20 border border-red-500 rounded-lg text-red-300 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-2">An Error Occurred</h2>
        <p>{message}</p>
    </div>
);


function App() {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleExplore = (destination: string) => {
    if (destination === selectedDestination && landmarks.length > 0) return;
    setSelectedDestination(destination);
    setLandmarks([]);
    setError(null);
  };
  
  const handleBookingRequest = (prompt: string): Promise<BookingDetails> => {
    if (!selectedDestination) {
        return Promise.reject(new Error("No destination selected."));
    }
    return planTrip(selectedDestination, prompt);
  };

  const getLandmarks = useCallback(async () => {
    if (!selectedDestination) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchLandmarks(selectedDestination);
      setLandmarks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setLandmarks([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDestination]);

  useEffect(() => {
    getLandmarks();
  }, [getLandmarks]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (landmarks.length > 0) {
      return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landmarks.map((landmark) => (
                <LandmarkCard key={landmark.name} landmark={landmark} />
            ))}
            </div>
            <div className="text-center mt-12">
                <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-sky-500 text-white font-bold py-3 px-8 rounded-full hover:bg-sky-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    Plan Your Trip to {selectedDestination}
                </button>
            </div>
        </>
      );
    }
    if (!selectedDestination) {
        return <WelcomeMessage />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <LocationInput
          onExplore={handleExplore}
          isLoading={isLoading}
        />
        <div className="mt-8">
            {renderContent()}
        </div>
      </main>
      {selectedDestination && (
        <BookingModal 
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            destination={selectedDestination}
            onBook={handleBookingRequest}
        />
      )}
    </div>
  );
}

export default App;
