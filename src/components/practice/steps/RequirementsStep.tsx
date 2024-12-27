import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';

interface RequirementsStepProps {
  requirements: string;
  setRequirements: (requirements: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const RequirementsStep: React.FC<RequirementsStepProps> = ({ requirements, setRequirements, onNext, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <FileText className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 2 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Role Requirements</h2>
        <p className="text-gray-600">Describe the key requirements and skills for your role</p>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm mb-8">
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Example: 5+ years of experience in React.js, strong knowledge of TypeScript, experience with cloud services..."
          className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-indigo-500 focus:border-transparent resize-none"
        />
        <div className="mt-4 text-sm text-gray-500">
          <p>Tips:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Include years of experience required</li>
            <li>List technical skills and tools</li>
            <li>Mention soft skills and qualifications</li>
            <li>Add any specific certifications needed</li>
          </ul>
        </div>
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
          disabled={!requirements.trim()}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Generate Questions</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default RequirementsStep;