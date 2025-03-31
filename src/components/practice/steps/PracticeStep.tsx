import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Mic, Headphones, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface PracticeStepProps {
  questions: string[];
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PracticeStep: React.FC<PracticeStepProps> = ({ questions, answers, setAnswers, onNext, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<"saving" | "saved" | "not_saved" | null>(null);
  
  // Start timer when component mounts
  useEffect(() => {
    setIsTimerActive(true);
    return () => setIsTimerActive(false);
  }, []);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);
  
  // Analyze current answer for real-time feedback
  useEffect(() => {
    const currentAnswer = answers[currentQuestion] || '';
    
    if (currentAnswer.length === 0) {
      setAnswerFeedback(null);
      return;
    }
    
    // Simple real-time feedback
    if (currentAnswer.length < 50) {
      setAnswerFeedback("Your answer is short. Try to elaborate more.");
    } else if (currentAnswer.length < 100) {
      setAnswerFeedback("Good answer, consider adding specific examples.");
    } else {
      setAnswerFeedback("Excellent answer! Rich in details and content.");
    }
    
    // Simulate auto-save
    setSavedStatus("saving");
    const saveTimeout = setTimeout(() => {
      setSavedStatus("saved");
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSavedStatus(null);
      }, 3000);
    }, 1000);
    
    return () => clearTimeout(saveTimeout);
  }, [answers[currentQuestion]]);

  const handleAnswerChange = (answer: string) => {
    setSavedStatus("not_saved");
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (questions && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  const togglePlayQuestion = () => {
    setIsPlaying(!isPlaying);
    // Placeholder for text-to-speech functionality
    alert("Text-to-speech functionality will be implemented soon!");
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Placeholder for speech-to-text functionality
    alert("Speech-to-text functionality will be implemented soon!");
  };
  
  // Format elapsed time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Check if all questions have been answered
  const allQuestionsAnswered = (): boolean => {
    if (!questions || !questions.length) return false;
    return questions.every((_, index) => answers[index]?.trim?.());
  };

  // Total progress (percentage of answered questions)
  const calculateProgress = (): number => {
    if (!questions || !questions.length) return 0;
    const answeredCount = Object.values(answers).filter(answer => answer?.trim()).length;
    return Math.round((answeredCount / questions.length) * 100);
  };
  
  // Move to next question when pressing Enter + Shift
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (answers[currentQuestion]?.trim()) {
        handleNext();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <Mic className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 4 of 5</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Practice Your Interview</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-2">
          Question {currentQuestion + 1} of {questions ? questions.length : 0}
        </p>
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        
        {/* Timer */}
        <div className="mt-2 flex justify-center items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatTime(timer)}</span>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-4 shadow-sm mb-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800 sm:text-lg">Question:</h3>
            <button
              onClick={togglePlayQuestion}
              className={`p-2 rounded-full transition-all ${
                isPlaying
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'
              }`}
              title="Listen to question"
            >
              <Headphones className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-700 text-lg sm:text-base">{questions[currentQuestion]}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800 sm:text-lg">Your Answer:</h3>
            <div className="flex items-center">
              {savedStatus === "saving" && (
                <span className="text-gray-500 text-sm mr-2">Saving...</span>
              )}
              {savedStatus === "saved" && (
                <span className="text-green-500 text-sm flex items-center mr-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Saved
                </span>
              )}
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all ${
                  isListening
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'
                }`}
                title="Record your answer"
              >
                <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
          <textarea
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here or click the microphone to speak..."
            className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          
          {/* Real-time feedback */}
          {answerFeedback && (
            <div className="mt-2 text-sm flex items-start justify-center">
              <AlertCircle className={`h-4 w-4 mr-1 ${
                answers[currentQuestion]?.length < 50 
                  ? 'text-amber-500' 
                  : answers[currentQuestion]?.length < 100 
                  ? 'text-blue-500' 
                  : 'text-green-500'
              }`} />
              <span className={`${
                answers[currentQuestion]?.length < 50 
                  ? 'text-amber-600' 
                  : answers[currentQuestion]?.length < 100 
                  ? 'text-blue-600' 
                  : 'text-green-600'
              }`}>
                {answerFeedback}
              </span>
            </div>
          )}
          
          <div className="mt-2 text-xs text-center text-gray-500">
            {answers[currentQuestion]?.length || 0} characters
            {answers[currentQuestion]?.length > 0 && (
              <span className="hidden sm:inline ml-2"> · Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">Enter</kbd> for next question</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="w-full sm:w-auto flex justify-center">
          {currentQuestion > 0 ? (
            <button
              onClick={handleBack}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-300
                       hover:border-indigo-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              disabled={true}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 rounded-lg border-2 text-gray-200 border-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>
          )}
        </div>

        <div className="flex justify-center w-full sm:w-auto order-first sm:order-none mb-4 sm:mb-0">
          {questions && questions.length > 1 && questions.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 mx-1 rounded-full transition-all ${
                index === currentQuestion
                  ? 'bg-indigo-600 scale-125'
                  : answers[index]
                  ? 'bg-indigo-200'
                  : 'bg-gray-200'
              }`}
              onClick={() => setCurrentQuestion(index)}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>

        <div className="w-full sm:w-auto flex justify-center">
          <button
            onClick={handleNext}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                     hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                     hover:scale-105 active:scale-95"
          >
            <span>{questions && currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Answers'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Tip to complete all questions */}
      {questions && currentQuestion === questions.length - 1 && !allQuestionsAnswered() && (
        <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            You haven't answered all questions yet. It's recommended to answer all questions for a more accurate feedback analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default PracticeStep;