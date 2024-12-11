import React, { useState } from 'react';
import { Code, Palette, TestTube, ArrowRight, ArrowLeft, Brain, Sparkles } from 'lucide-react';

const JobTypeStep = ({ jobType, setJobType, onNext, onBack }) => {
  const [customJob, setCustomJob] = useState('');

  const handleJobSelect = (selectedJob: string) => {
    setJobType(selectedJob);
    setCustomJob('');
  };

  const handleCustomJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomJob(value);
    setJobType(value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-4">
          <Brain className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-600">Step 1 of 5</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Job Type</h2>
        <p className="text-gray-600">Select your role or enter a custom job title</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'Developer', icon: Code },
          { title: 'Designer', icon: Palette },
          { title: 'QA Engineer', icon: TestTube }
        ].map(({ title, icon: Icon }) => (
          <button
            key={title}
            onClick={() => handleJobSelect(title)}
            className={`p-6 rounded-xl border-2 transition-all group
              ${jobType === title ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
          >
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon className="h-8 w-8 text-indigo-600" />
            </div>
            <span className="block text-gray-800 font-medium text-center">{title}</span>
          </button>
        ))}
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-500">
            or enter custom role
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={customJob}
            onChange={handleCustomJobChange}
            placeholder="Enter your job title"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     bg-white/70 backdrop-blur-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
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
          disabled={!jobType.trim()}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg
                   hover:from-indigo-700 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl
                   hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next Step</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default JobTypeStep;