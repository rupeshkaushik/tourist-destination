import React, { useState } from 'react';
import { BookingDetails } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { sendBookingConfirmationEmail } from '../services/geminiService';

interface BookingModalProps {
  destination: string;
  isOpen: boolean;
  onClose: () => void;
  onBook: (prompt: string) => Promise<BookingDetails>;
}

export const BookingModal: React.FC<BookingModalProps> = ({ destination, isOpen, onClose, onBook }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  // Email state
  const [email, setEmail] = useState('example@gmail.com');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleBook = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setBookingResult(null);
    try {
      const result = await onBook(prompt);
      setBookingResult(result);
      // Simulate booking confirmation
      setTimeout(() => {
          setIsBooked(true);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendConfirmation = async () => {
      if (!email.trim() || !bookingResult) return;
      setIsSendingEmail(true);
      setEmailError(null);
      try {
          await sendBookingConfirmationEmail(destination, bookingResult, email);
          setEmailSent(true);
      } catch (err) {
          setEmailError(err instanceof Error ? err.message : "Failed to send email.");
      } finally {
          setIsSendingEmail(false);
      }
  };
  
  const resetAndClose = () => {
      setPrompt('');
      setIsLoading(false);
      setBookingResult(null);
      setError(null);
      setIsBooked(false);
      setEmail('');
      setIsSendingEmail(false);
      setEmailSent(false);
      setEmailError(null);
      onClose();
  }

  if (!isOpen) return null;

  const renderContent = () => {
    if (isBooked && bookingResult) {
        return (
            <div className="text-center">
                <h3 className="text-2xl font-bold text-teal-300 mb-2">Trip Confirmed!</h3>
                <p className="text-gray-300 mb-6">Your trip to {destination} is booked. Pack your bags!</p>
                
                <div className="space-y-4 my-4 text-left">
                    <label htmlFor="email-input" className="block text-sm font-medium text-gray-300">
                        Send confirmation to:
                    </label>
                    <input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full p-2 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                    />
                    <button
                        onClick={handleSendConfirmation}
                        disabled={isSendingEmail || emailSent || !email.trim()}
                        className="w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isSendingEmail ? 'Sending...' : emailSent ? 'Sent!' : 'Send Confirmation to Gmail'}
                    </button>
                    {emailError && <p className="text-red-400 mt-2 text-sm text-center">{emailError}</p>}
                </div>

                <button
                    onClick={resetAndClose}
                    className="mt-4 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
                >
                    Done
                </button>
            </div>
        );
    }
    if (isLoading) return <LoadingSpinner />;
    if (bookingResult) {
        return (
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Confirming your trip details...</h3>
                <pre className="text-left bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(bookingResult, null, 2)}
                </pre>
                 <LoadingSpinner />
            </div>
        )
    }
    return (
        <>
            <p className="text-gray-400 mb-4">
                Describe your ideal trip. For example: "Find a 5-star hotel and first-class flights for 2 people next month."
            </p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Your travel plans..."
                className="w-full p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
            <button
                onClick={handleBook}
                disabled={isLoading || !prompt.trim()}
                className="mt-4 w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-gray-500 transition-colors"
            >
                Plan My Trip
            </button>
        </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={resetAndClose} role="dialog" aria-modal="true">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative transform transition-all" onClick={(e) => e.stopPropagation()}>
        <button onClick={resetAndClose} className="absolute top-3 right-3 text-gray-400 hover:text-white" aria-label="Close modal">
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-1">Plan Your Trip</h2>
        <h3 className="text-lg font-semibold text-teal-400 mb-4">to {destination}</h3>
        {renderContent()}
      </div>
    </div>
  );
};
