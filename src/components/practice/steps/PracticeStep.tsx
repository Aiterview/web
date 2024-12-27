import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mic, Headphones } from 'lucide-react';

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

  const handleAnswerChange = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Placeholder for speech-to-text functionality
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <Mic className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 4 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Practice Interview</h2>
        <p className="text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm mb-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800">Question:</h3>
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
          <p className="text-gray-700 text-lg">{questions[currentQuestion]}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800">Your Answer:</h3>
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
          <textarea
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here or click the microphone to speak..."
            className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                     focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-300
                   hover:border-indigo-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentQuestion
                  ? 'bg-indigo-600'
                  : answers[index]
                  ? 'bg-indigo-200'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion]?.trim()}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Answers'}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PracticeStep;