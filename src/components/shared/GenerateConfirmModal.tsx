import React from 'react';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';
import { useCredits } from '../../context/CreditsContext';

interface GenerateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const GenerateConfirmModal: React.FC<GenerateConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const { credits } = useCredits();

  if (!isOpen) return null;

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
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Generate New Questions?</h3>
          <p className="text-gray-600 mt-2">
            This action will consume 1 credit from your available credits
            {credits && (
              <span className="block mt-2 font-medium">
                You have <span className="text-indigo-600">{credits.balance}</span> {credits.balance === 1 ? 'credit available' : 'credits available'}
              </span>
            )}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700">
            Your current questions will be replaced with new questions generated by AI.
            <span className="block mt-1 text-amber-600 font-medium">
              This will consume 1 credit and cannot be undone.
            </span>
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                     hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                     flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Confirm and spend 1 credit</span>
          </button>
          <button 
            onClick={onClose}
            className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg
                     hover:border-indigo-600 hover:text-indigo-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateConfirmModal; 