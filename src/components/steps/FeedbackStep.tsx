import React from 'react';
import { CheckCircle, XCircle, RefreshCw, Award } from 'lucide-react';

const FeedbackStep = ({ onRetake }) => {
  const strengths = [
    'Clear communication style',
    'Detailed examples provided',
    'Structured responses',
    'Strong technical knowledge',
  ];

  const improvements = [
    'Add more specific metrics',
    'Elaborate on technical details',
    'Include more context about team collaboration',
    'Quantify achievements',
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <Award className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 5 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Interview Feedback</h2>
        <p className="text-gray-600">Here's how you performed in your practice interview</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <FeedbackSection
          title="Strengths"
          items={strengths}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          gradient="from-green-50 to-emerald-50"
          border="border-green-200"
        />
        <FeedbackSection
          title="Areas for Improvement"
          items={improvements}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          gradient="from-red-50 to-rose-50"
          border="border-red-200"
        />
      </div>

      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm mb-8">
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
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Retake Interview</span>
        </button>
      </div>
    </div>
  );
};

const FeedbackSection = ({ title, items, icon, gradient, border }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-sm border ${border}`}>
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

export default FeedbackStep;