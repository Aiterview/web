import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, RotateCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useCredits } from '../../../context/CreditsContext';
import apiService from '../../../lib/api/api.service';
import LimitReachedModal from '../../shared/LimitReachedModal';

// Global token to prevent multiple API calls
let isApiCallInProgressGlobal = false;

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
  const { credits, fetchCredits, updateCreditsAfterUse } = useCredits();
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [localApiCallInProgress, setLocalApiCallInProgress] = useState(false);
  const apiCallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef<string>("");
  
  // Clear timeout when unmounting
  useEffect(() => {
    return () => {
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
    };
  }, []);
  
  // Fetch credits on component mount only if needed
  useEffect(() => {
    if (isAuthenticated && isNewSession) {
      try {
        // Cache control implemented in fetchCredits
        fetchCredits();
      } catch (error) {
        console.error('Error fetching credits:', error);
        // Allow continuing even with credit API error
        setError('Error checking credits. Continuing with default questions.');
        setDefaultQuestions();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [isAuthenticated, isNewSession]);
  
  const generateQuestions = async () => {
    // Create a unique ID for this request
    const currentRequestId = Date.now().toString();
    requestIdRef.current = currentRequestId;
    
    // Triple protection against duplicate calls
    // 1. Local state check
    // 2. Global state check
    // 3. Debounce to prevent rapid clicks
    
    // Check if there is a local call in progress
    if (localApiCallInProgress) {
      console.log('API call already in progress locally, skipping...');
      return;
    }
    
    // Check if there is a global call in progress
    if (isApiCallInProgressGlobal) {
      console.log('API call already in progress globally, skipping...');
      return;
    }
    
    // If we already have questions, don't generate again
    if (questions && questions.length > 0 && hasGeneratedQuestions) {
      console.log('Questions already generated, skipping...');
      return;
    }
    
    // Ensure you have updated credit data before generating questions
    // Use forceUpdate=false to allow cache usage, avoiding unnecessary calls
    await fetchCredits(false);
    
    // Check if credits are available
    if (!credits.hasCredits) {
      setError('You do not have any credits available. Purchase more credits to continue.');
      setIsLimitModalOpen(true);
      return;
    }
    
    // Set local and global locks
    setLocalApiCallInProgress(true);
    isApiCallInProgressGlobal = true;
    
    // Set timeout to release locks after 30 seconds (in case of error)
    apiCallTimeoutRef.current = setTimeout(() => {
      if (requestIdRef.current === currentRequestId) {
        console.log('Safety timeout reached, releasing API call lock');
        setLocalApiCallInProgress(false);
        isApiCallInProgressGlobal = false;
      }
    }, 30000);
    
    setIsLoading(true);
    setError(null);
    
    // Check if API is connected
    if (apiStatus && !apiStatus.isConnected) {
      setError(`Problema de conexão com a API: ${apiStatus.message}. Usando perguntas padrão.`);
      setDefaultQuestions();
      setIsLoading(false);
      setLocalApiCallInProgress(false);
      isApiCallInProgressGlobal = false;
      
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
      
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Autenticação necessária. Por favor, faça login novamente.');
      setDefaultQuestions();
      setIsLoading(false);
      setLocalApiCallInProgress(false);
      isApiCallInProgressGlobal = false;
      
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
      
      return;
    }
    
    try {
      console.log('Generating questions for:', jobType);
      console.log('With requirements:', requirements);
      console.log('Request ID:', currentRequestId);
      
      // Ensure this is still the latest request
      if (requestIdRef.current !== currentRequestId) {
        console.log('Request superseded by newer request, aborting');
        return;
      }
      
      const result = await apiService.questions.generate(jobType, requirements, 5);
      
      // Verify again if this is still the latest request
      if (requestIdRef.current !== currentRequestId) {
        console.log('Request completed but superseded by newer request, discarding results');
        return;
      }
      
      console.log('API response:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('Questions generated successfully:', result.data);
        
        // Check if questions exists in the response
        if (result.data && result.data.questions && Array.isArray(result.data.questions)) {
          console.log('Questions array found directly in data:', result.data.questions.length);
          setQuestions(result.data.questions);
          setHasGeneratedQuestions(true);
        } 
        // Check if there is a nested structure result.data.data.questions
        else if (result.data && result.data.data && result.data.data.questions && Array.isArray(result.data.data.questions)) {
          console.log('Questions array found in nested data:', result.data.data.questions.length);
          setQuestions(result.data.data.questions);
          setHasGeneratedQuestions(true);
        }
        else {
          console.error('Response format changed: questions array not found in:', result.data);
          setError('Invalid server response format. Using default questions.');
          setDefaultQuestions();
        }
      } else {
        console.error('Failed to generate questions:', result);
        setError('Failed to generate questions. Please try again.');
        setDefaultQuestions();
      }
    } catch (err: any) {
      console.error('Error generating questions:', err);
      
      // Verify if this is still the latest request
      if (requestIdRef.current !== currentRequestId) {
        return;
      }
      
      // Check if error is due to limit reached
      if (err.response && err.response.status === 403 && err.response.data?.data?.limitReached) {
        setError('You do not have enough credits to generate questions. Purchase more credits to continue.');
        setIsLimitModalOpen(true);
        setHasGeneratedQuestions(true); // Prevent further attempts
      } else {
        setError(`Failed to generate questions: ${err instanceof Error ? err.message : 'Unknown error'}. Using default questions.`);
        setDefaultQuestions();
      }
    } finally {
      // Clear timeout
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
      
      // Verify if this is still the latest request
      if (requestIdRef.current === currentRequestId) {
        setIsLoading(false);
        setLocalApiCallInProgress(false);
        isApiCallInProgressGlobal = false;
      }
    }
  };
  
  const setDefaultQuestions = () => {
    const defaultQuestions = [
      'Can you describe a challenging project you worked on and how you approached it?',
      'How do you stay updated with the latest trends and technologies in your industry?',
      'What is your approach to solving complex technical problems?',
      'How do you handle disagreements with team members?',
      'Where do you see yourself professionally in 5 years?',
    ];
    
    setQuestions(defaultQuestions);
    setHasGeneratedQuestions(true);
  };

  // Use a debounce for question generation via effect
  useEffect(() => {
    // Avoid race condition
    let isMounted = true;
    let debounceTimeout: NodeJS.Timeout | null = null;
    
    const debouncedGenerate = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      
      debounceTimeout = setTimeout(() => {
        // Only generate automatically if it's a new session and never generated questions before
        // isNewSession indicates first time on the screen and not returning to the screen later
        if (isMounted && jobType && requirements && isNewSession && !hasGeneratedQuestions && !localApiCallInProgress && !isApiCallInProgressGlobal) {
          console.log('Triggering debounced question generation');
          generateQuestions();
        }
      }, 500); // 500ms debounce
    };
    
    // Only generate automatically if it's a new session and never generated questions before
    if (jobType && requirements && isNewSession && !hasGeneratedQuestions && !localApiCallInProgress && !isApiCallInProgressGlobal) {
      console.log('Conditions met for question generation, debouncing...');
      debouncedGenerate();
    } else if (!questions || questions.length === 0) {
      setDefaultQuestions();
    }
    
    // Cleanup
    return () => {
      isMounted = false;
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [jobType, requirements, isNewSession, hasGeneratedQuestions, localApiCallInProgress]);

  // Check limit when component mounts or when usage changes
  useEffect(() => {
    if (!credits.hasCredits) {
      setError('You do not have any credits available. Purchase more credits to continue.');
    }
  }, [credits.hasCredits]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <MessageSquare className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 3 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Questions</h2>
        <p className="text-gray-600">Review your customized questions for the interview</p>
        
        {/* Credits information */}
        {credits && (
          <div className="mt-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
            <p className="text-sm flex items-center">
              <span className="font-medium mr-1">Credits:</span> 
              {credits.balance} {credits.balance === 1 ? 'credit available' : 'credits available'}
            </p>
          </div>
        )}
        
        {/* API Call Status
        {localApiCallInProgress && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <p className="text-sm flex items-center">
              <span className="font-medium mr-1">API Status:</span> 
              API call in progress. Please wait...
            </p>
          </div>
        )} */}
        
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
          <p className="mt-4 text-gray-600">Generating customized questions...</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {questions && questions.length > 0 ? questions.map((question, index) => (
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
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No questions available.</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          // onClick={onBack}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-200 text-gray-200 cursor-not-allowed relative group"
          disabled={true}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95"
          disabled={isLoading || localApiCallInProgress || !questions || questions.length === 0}
        >
          <span>Start answering</span>
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