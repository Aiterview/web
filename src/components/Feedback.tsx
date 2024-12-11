import React from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const Feedback = ({
  answers,
  onRetake,
}: {
  answers: Record<string, string>;
  onRetake: () => void;
}) => {
  const strengths = [
    'Clear communication style',
    'Detailed examples provided',
    'Structured responses',
  ];

  const improvements = [
    'Add more specific metrics',
    'Elaborate on technical details',
    'Include more context about team collaboration',
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Feedback</h2>
        <p className="text-gray-600">Here's how you performed in your practice interview</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeedbackSection
          title="Strengths"
          items={strengths}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        />
        <FeedbackSection
          title="Areas for Improvement"
          items={improvements}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Overall Assessment</h3>
        <p className="text-gray-600 leading-relaxed">
          Your responses demonstrate good communication skills and a solid understanding of your
          role. To improve further, focus on quantifying your achievements and providing more
          specific technical details in your answers. Consider using the STAR method
          (Situation, Task, Action, Result) to structure your responses.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRetake}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-8 py-3 rounded-lg
                   hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Retake Interview</span>
        </button>
      </div>
    </div>
  );
};

const FeedbackSection = ({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start space-x-2">
          {icon}
          <span className="text-gray-600">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Feedback;