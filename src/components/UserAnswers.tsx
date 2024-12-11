import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const UserAnswers = ({
  questions,
  answers,
  setAnswers,
  onNext,
  onPrevious,
}: {
  questions: string[];
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  onNext: () => void;
  onPrevious: () => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const canNavigateNext = currentQuestion < questions.length - 1;
  const canSubmit = currentQuestion === questions.length - 1 && answers[currentQuestion]?.trim();

  const handleNext = () => {
    if (canNavigateNext) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (canSubmit) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Answer</h2>
        <p className="text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {questions[currentQuestion]}
        </h3>
        <textarea
          value={answers[currentQuestion] || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
            } else {
              onPrevious();
            }
          }}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-300
                   hover:border-indigo-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion]?.trim()}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg
                   hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{canNavigateNext ? 'Next Question' : 'Submit Answers'}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center">
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
      </div>
    </div>
  );
};

export default UserAnswers;