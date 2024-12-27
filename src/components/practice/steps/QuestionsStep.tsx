import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';

interface QuestionsStepProps {
  questions: string[];
  setQuestions: (questions: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ questions, setQuestions, onNext, onBack }) => {
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <MessageSquare className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 3 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Questions</h2>
        <p className="text-gray-600">Review your personalized interview questions</p>
      </div>

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

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-gray-300
                   hover:border-indigo-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95"
        >
          <span>Start Answering</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default QuestionsStep;