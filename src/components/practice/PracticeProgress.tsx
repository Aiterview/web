import { useLocation } from 'react-router-dom';

const PracticeProgress = () => {
  const location = useLocation();
  const steps = [
    { path: 'job-type', label: 'Job Type' },
    { path: 'requirements', label: 'Requirements' },
    { path: 'questions', label: 'Questions' },
    { path: 'practice', label: 'Practice' },
    { path: 'feedback', label: 'Feedback' },
  ];

  const currentStepIndex = steps.findIndex(step => 
    location.pathname.includes(step.path)
  );

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="flex justify-between mb-2">
        {steps.map(({ label }, index) => (
          <div
            key={index}
            className={`text-sm font-medium ${
              index <= currentStepIndex ? 'text-gray-800' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PracticeProgress;