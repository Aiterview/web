import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, RotateCw, AlertCircle } from 'lucide-react';
import { usePractice } from '../../../context/PracticeContext';
import { useAuthStore } from '../../../store/authStore';
import { useUsageStore } from '../../../store/usageStore';
import apiService from '../../../lib/api/api.service';
import LimitReachedModal from '../../shared/LimitReachedModal';

interface QuestionsStepProps {
  questions: string[];
  setQuestions: (questions: string[]) => void;
  jobType: string;
  requirements: string;
  onNext: () => void;
  onBack: () => void;
  apiStatus?: {
    isConnected: boolean;
    message: string;
  } | null;
  isNewSession?: boolean;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ 
  questions, 
  setQuestions, 
  jobType,
  requirements,
  onNext, 
  onBack,
  apiStatus,
  isNewSession
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();
  const { usage, hasLimitReached, fetchUsage, setUsage } = useUsageStore();
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  
  // Fetch usage stats on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsage();
    }
  }, [isAuthenticated]);
  
  const generateQuestions = async (force = false) => {
    // Prevent unnecessary API calls if questions already exist and force is not set
    if (questions.length > 0 && hasGeneratedQuestions && !force) {
      return;
    }
    
    // Check if usage limit is reached
    if (hasLimitReached) {
      setError('You have reached your monthly limit for generating questions. Upgrade to premium for unlimited access.');
      setIsLimitModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Check if API is connected
    if (apiStatus && !apiStatus.isConnected) {
      setError(`API connection issue: ${apiStatus.message}. Using default questions.`);
      setDefaultQuestions();
      setIsLoading(false);
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Authentication required. Please log in again.');
      setDefaultQuestions();
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Generating questions for:', jobType);
      console.log('With requirements:', requirements);
      
      const result = await apiService.questions.generate(jobType, requirements, 5);
      
      if (result.success) {
        console.log('Questions generated successfully:', result.data.questions);
        setQuestions(result.data.questions);
        setHasGeneratedQuestions(true);
        
        // Update usage stats
        if (result.data.usage) {
          setUsage(result.data.usage);
        }
      } else {
        console.error('Failed to generate questions:', result);
        setError('Failed to generate questions. Please try again.');
        setDefaultQuestions();
      }
    } catch (err: any) {
      console.error('Error generating questions:', err);
      
      // Check if error is due to limit reached
      if (err.response && err.response.status === 403 && err.response.data?.data?.limitReached) {
        setError('You have reached your monthly limit for generating questions. Upgrade to premium for unlimited access.');
        setHasGeneratedQuestions(true); // Prevent further attempts
      } else {
        setError(`Failed to generate questions: ${err instanceof Error ? err.message : 'Unknown error'}. Using default questions.`);
        setDefaultQuestions();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const setDefaultQuestions = () => {
    setQuestions([
      'Can you describe a challenging project you worked on and how you handled it?',
      'How do you stay updated with the latest industry trends and technologies?',
      'What is your approach to solving complex technical problems?',
      'How do you handle disagreements with team members?',
      'Where do you see yourself professionally in 5 years?',
    ]);
    setHasGeneratedQuestions(true);
  };

  useEffect(() => {
    if (jobType && requirements) {
      // If API is disconnected, set default questions directly
      if (apiStatus && !apiStatus.isConnected) {
        console.warn('API not connected, using default questions');
        setDefaultQuestions();
        setError(`API connection issue: ${apiStatus.message}. Using default questions.`);
      } else if (isNewSession && !hasGeneratedQuestions) {
        // Only generate questions if it's a new session and questions haven't been generated yet
        generateQuestions();
      }
    } else if (questions.length === 0) {
      setDefaultQuestions();
    }
  }, [jobType, requirements, isNewSession]);

  // Verificar o limite quando o componente é montado ou quando usage muda
  useEffect(() => {
    if (hasLimitReached) {
      setError('You have reached your monthly limit for generating questions. Upgrade to premium for unlimited access.');
    }
  }, [hasLimitReached]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <MessageSquare className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 3 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Questions</h2>
        <p className="text-gray-600">Review your personalized interview questions</p>
        
        {/* Usage limit information */}
        {usage && (
          <div className="mt-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
            {usage.isPremium ? (
              <p className="text-sm flex items-center">
                <span className="font-medium mr-1">Premium Account:</span> Unlimited question generations
              </p>
            ) : (
              <p className="text-sm flex items-center">
                <span className="font-medium mr-1">Usage:</span> 
                {usage.current} of {usage.limit} generations used this month 
                ({usage.remaining} remaining)
              </p>
            )}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin">
            <RotateCw className="h-10 w-10 text-indigo-600" />
          </div>
          <p className="mt-4 text-gray-600">Generating personalized questions...</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-800 text-lg">{question}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-300
                   hover:border-indigo-600 hover:text-indigo-600 transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <button
          onClick={() => generateQuestions(true)} // Force new generation
          className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-indigo-500
                  text-indigo-600 hover:bg-indigo-50 transition-colors"
          disabled={isLoading || (apiStatus ? !apiStatus.isConnected : false) || hasLimitReached}
          title={hasLimitReached ? "Monthly question generation limit reached" : ""}
        >
          <RotateCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Generate New</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95"
          disabled={isLoading || questions.length === 0}
        >
          <span>Start Answering</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal 
        isOpen={isLimitModalOpen} 
        onClose={() => setIsLimitModalOpen(false)} 
      />
    </div>
  );
};

export default QuestionsStep;