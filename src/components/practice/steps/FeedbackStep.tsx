import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, XCircle, RefreshCw, Award, RotateCw, BookOpen } from 'lucide-react';
import apiService from '../../../lib/api/api.service';
import GenerateConfirmModal from '../../shared/GenerateConfirmModal';
import { useCredits } from '../../../context/CreditsContext';

interface FeedbackStepProps {
  questions: string[];
  answers: Record<string, string>;
  onRetake: () => void;
  jobType: string;
  requirements: string;
}

interface FeedbackData {
  strengths: string[];
  improvements: string[];
  overallAssessment: string;
  score: number;
  learningResources?: string[] | Array<{
    name: string;
    url: string;
  }>;
}

// Global state to prevent concurrent API calls
let isApiCallInProgressGlobal = false;

const FeedbackStep: React.FC<FeedbackStepProps> = ({ questions, answers, onRetake, jobType, requirements }) => {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { credits, updateCreditsAfterUse } = useCredits();
  
  // Refs to manage API call state
  const [localApiCallInProgress, setLocalApiCallInProgress] = useState(false);
  const apiCallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef<string>('');

  useEffect(() => {
    getFeedbackFromAPI();
  }, []);

  const getFeedbackFromAPI = async () => {
    // Create a unique ID for this request
    const currentRequestId = Date.now().toString();
    requestIdRef.current = currentRequestId;
    
    // Triple protection against duplicate calls
    // 1. Local state check
    // 2. Global state check
    
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

    try {
      // Format the interview data for the API
      const interviewData = {
        questions,
        answers: Object.values(answers),
      };

      // Call API to analyze responses
      const result = await apiService.feedback.analyze(interviewData);
      
      if (result.success && result.data) {
        console.log('Feedback data received:', result.data);
        setFeedback(result.data);
        updateCreditsAfterUse();
      } else {
        setError('Failed to get feedback. Please try again later.');
        setFeedback({
          strengths: ['Answered all interview questions'],
          improvements: ['Continue practicing to improve your responses'],
          overallAssessment: 'Thank you for participating in the practice interview.',
          score: 50
        });
      }
    } catch (err) {
      console.error('Error getting feedback:', err);
      setError('Error analyzing responses. Please try again later.');
      setFeedback({
        strengths: ['Answered all interview questions'],
        improvements: ['Continue practicing to improve your responses'],
        overallAssessment: 'Thank you for participating in the practice interview.',
        score: 50
      });
    } finally {
      // Clear timeout
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
      
      // Add logs for debug
      console.log('API call completed, current request ID:', requestIdRef.current);
      console.log('Expected request ID:', currentRequestId);
      console.log('Are IDs matching?', requestIdRef.current === currentRequestId);
      
      // Always update the state, regardless of the request ID
      console.log('Setting isLoading to false');
      setIsLoading(false);
      setLocalApiCallInProgress(false);
      isApiCallInProgressGlobal = false;
    }
  };

  // Get score message based on score
  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  // Click handler when the user confirms the generation of new questions
  const handleConfirmNewGeneration = () => {
    setIsConfirmModalOpen(false);
    onRetake();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <Award className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 5 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Feedback</h2>
        <p className="text-gray-600">Here's how you performed in your practice interview</p>
        
        {/* Credits information */}
        {credits && (
          <div className="mt-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
            <p className="text-sm flex items-center">
              <span className="font-medium mr-1">Credits:</span> 
              {credits.balance} {credits.balance === 1 ? 'credit available' : 'credits available'}
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin mb-4">
            <RotateCw className="h-12 w-12 text-indigo-600" />
          </div>
          <p className="text-lg text-gray-600">Analyzing your responses...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      ) : feedback ? (
        <>
          {/* Error message if API failed */}
          {error && (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
              <p className="text-sm">{error}</p>
            </div>
          )}
        
          {/* Score */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white/70 backdrop-blur-sm shadow-sm rounded-full h-32 w-32 flex flex-col items-center justify-center border-4 border-indigo-100">
              <div className="text-2xl font-bold text-indigo-600">{feedback.score}%</div>
              <div className="text-sm text-gray-600 text-center">{getScoreMessage(feedback.score)}</div>
            </div>
          </div>
        
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <FeedbackSection
              title="Strengths"
              items={feedback?.strengths || []}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              gradient="from-green-50 to-emerald-50"
              border="border-green-200"
            />
            <FeedbackSection
              title="Areas for Improvement"
              items={feedback?.improvements || []}
              icon={<XCircle className="h-5 w-5 text-red-500" />}
              gradient="from-red-50 to-rose-50"
              border="border-red-200"
            />
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Overall Assessment</h3>
            <p className="text-gray-600 leading-relaxed">
              {feedback?.overallAssessment || "No assessment available."}
            </p>
          </div>
          
          {/* Learning Resources Section */}
          {feedback?.learningResources && feedback.learningResources.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-indigo-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                Learning Resources
              </h3>
              <ul className="space-y-3">
                {feedback.learningResources.map((resource, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-5 h-5 mt-1">
                      <BookOpen className="h-5 w-5 text-indigo-500" />
                    </div>
                    {typeof resource === 'string' ? (
                      <span className="text-gray-600">{resource}</span>
                    ) : (
                      <a 
                        href={resource.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {resource.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}

      <div className="flex justify-center gap-4">
        <button
          onClick={onRetake}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg border-2 border-indigo-500
                  text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>New interview topic</span>
        </button>
      </div>
      
      {/* Confirm Generation Modal */}
      <GenerateConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmNewGeneration}
      />
    </div>
  );
};

interface FeedbackSectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  gradient: string;
  border: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ title, items = [], icon, gradient, border }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-sm border ${border}`}>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <ul className="space-y-3">
      {Array.isArray(items) && items.length > 0 ? items.map((item, index) => (
        <li key={index} className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-5 h-5 mt-1">
            {icon}
          </div>
          <span className="text-gray-600">{item}</span>
        </li>
      )) : (
        <li className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-5 h-5 mt-1">
            {icon}
          </div>
          <span className="text-gray-600">No information available</span>
        </li>
      )}
    </ul>
  </div>
);

export default FeedbackStep;