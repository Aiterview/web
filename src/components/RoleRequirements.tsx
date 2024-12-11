import { ArrowLeft, ArrowRight } from 'lucide-react';

const RoleRequirements = ({
  requirements,
  onRequirementsChange,
  onNext,
  onPrevious,
}: {
  requirements: string;
  onRequirementsChange: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Role Requirements</h2>
        <p className="text-gray-600">
          Please describe the key requirements and skills for your role
        </p>
      </div>

      <textarea
        value={requirements}
        onChange={(e) => onRequirementsChange(e.target.value)}
        placeholder="Example: 5+ years of experience in React.js, strong knowledge of TypeScript, experience with cloud services..."
        className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                 focus:ring-indigo-500 focus:border-transparent resize-none"
      />

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
          disabled={!requirements.trim()}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg
                   hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Generate Questions</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default RoleRequirements;