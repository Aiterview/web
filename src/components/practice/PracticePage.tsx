import { useState } from 'react';
import JobTypeStep from './steps/JobTypeStep';
import RequirementsStep from './steps/RequirementsStep';
import QuestionsStep from './steps/QuestionsStep';
import PracticeStep from './steps/PracticeStep';
import FeedbackStep from './steps/FeedbackStep';

const PracticePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobType, setJobType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const steps = [
    { label: 'Job Type', component: JobTypeStep },
    { label: 'Requirements', component: RequirementsStep },
    { label: 'Questions', component: QuestionsStep },
    { label: 'Practice', component: PracticeStep },
    { label: 'Feedback', component: FeedbackStep },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-white pt-20 pb-12 rounded-xl shadow-sm">
      <div className="container mx-auto px-4">
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
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
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
        />
      </div>
    </div>
  );
};

export default PracticePage;