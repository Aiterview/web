import { useState, useEffect } from 'react';
import JobTypeStep from './steps/JobTypeStep';
import RequirementsStep from './steps/RequirementsStep';
import QuestionsStep from './steps/QuestionsStep';
import PracticeStep from './steps/PracticeStep';
import FeedbackStep from './steps/FeedbackStep';
import { checkApiConnection } from '../../lib/api/checkApiConnection';
import { useCredits } from '../../context/CreditsContext';

const PracticePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobType, setJobType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [apiStatus, setApiStatus] = useState<{
    isConnected: boolean;
    message: string;
  } | null>(null);
  
  // Track whether this is a new practice session
  const [isNewSession, setIsNewSession] = useState(true);
  const { fetchCredits } = useCredits();

  const steps = [
    { label: 'Job Type', component: JobTypeStep },
    { label: 'Requirements', component: RequirementsStep },
    { label: 'Questions', component: QuestionsStep },
    { label: 'Practice', component: PracticeStep },
    { label: 'Feedback', component: FeedbackStep },
  ];

  useEffect(() => {
    // Check API connection
    const verifyApiConnection = async () => {
      const status = await checkApiConnection();
      setApiStatus(status);
      
      if (!status.isConnected) {
        console.warn('API connection issue:', status.message);
      }
    };
    
    verifyApiConnection();
    fetchCredits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Track when a user completes the practice flow
  useEffect(() => {
    if (currentStep === steps.length - 1) {
      // User has reached the feedback step (completed the flow)
      setIsNewSession(false);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // If moving to the feedback step, check if all answers are complete
      if (currentStep === 3) {
        const answeredCount = Object.keys(answers).length;
        if (questions && questions.length > 0 && answeredCount < questions.length) {
          // Fill in empty answers to avoid errors
          const updatedAnswers = { ...answers };
          for (let i = 0; i < questions.length; i++) {
            if (!updatedAnswers[i]) {
              updatedAnswers[i] = "No answer provided";
            }
          }
          setAnswers(updatedAnswers);
        }
      }
    }
    
    // If moving from Feedback (last step) to Job Type (first step)
    // Reset the session state
    if (currentStep === steps.length - 1) {
      setIsNewSession(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setJobType('');
    setRequirements('');
    setQuestions([]);
    setAnswers({});
    setIsNewSession(true);
    
    // Refresh credits
    fetchCredits();
  };

  const CurrentStepComponent = steps[currentStep].component;

  // Calculate overall practice progress
  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-12 rounded-xl shadow-sm">
      <div className="container mx-auto px-4">
        {/* API Status Warning */}
        {apiStatus && !apiStatus.isConnected && currentStep === 2 && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
            <p className="font-medium">API Connection Issue</p>
            <p className="text-sm">{apiStatus.message}</p>
            <p className="text-sm mt-1">Default questions will be used.</p>
          </div>
        )}
      
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between mb-2">
            {steps.map(({ label }, index) => (
              <div
                key={index}
                className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        <CurrentStepComponent
          jobType={jobType}
          setJobType={setJobType}
          requirements={requirements}
          setRequirements={setRequirements}
          questions={questions}
          setQuestions={setQuestions}
          answers={answers}
          setAnswers={setAnswers}
          onNext={handleNext}
          onBack={handleBack}
          onRetake={handleRetake}
          apiStatus={apiStatus}
          isNewSession={isNewSession}
        />
      </div>
    </div>
  );
};

export default PracticePage;