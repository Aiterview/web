import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useCredits } from '../../context/CreditsContext';
import { useNavigate } from 'react-router-dom';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose }) => {
  const { credits } = useCredits();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBuyCredits = () => {
    onClose();
    navigate('/dashboard/billing');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No Credits Available</h3>
          <p className="text-gray-600 mt-2">
            You have used all of your available credits to generate questions.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Benefits of Credits:</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Customized question generation</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Advanced feedback on your answers</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Save and review past practice sessions</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={handleBuyCredits}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                     hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                     hover:scale-105 active:scale-95"
          >
            Buy Credits
          </button>
          <button 
            onClick={onClose}
            className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg
                     hover:border-indigo-600 hover:text-indigo-600 transition-colors"
          >
            Continue with Limitations
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitReachedModal; 