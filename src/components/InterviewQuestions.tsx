import { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const InterviewQuestions = ({
  questions,
  setQuestions,
  onNext,
  onPrevious,
}: {
  questions: string[];
  setQuestions: (questions: string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}) => {
  // Simulating question generation
  useEffect(() => {
    if (questions.length === 0) {
      setQuestions([
        'Can you describe a challenging project you worked on and how you handled it?',
        'How do you stay updated with the latest industry trends and technologies?',
        'What is your approach to solving complex technical problems?',
        'How do you handle disagreements with team members?',
        'Where do you see yourself professionally in 5 years?',
      ]);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Questions</h2>
        <p className="text-gray-600">Here are your personalized interview questions</p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-indigo-600 font-semibold">Q{index + 1}:</span>
            <p className="text-gray-800 mt-1">{question}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-300
                   hover:border-indigo-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg
                   hover:bg-indigo-700 transition-colors"
        >
          <span>Start Answering</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InterviewQuestions;