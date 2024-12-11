import React, { useState } from 'react';
import { Code, Palette, TestTube } from 'lucide-react';

const JobTypeSelection = ({
  selectedJob,
  onSelectJob,
  onNext,
}: {
  selectedJob: string;
  onSelectJob: (job: string) => void;
  onNext: () => void;
}) => {
  const [customJob, setCustomJob] = useState('');

  const jobTypes = [
    { title: 'Developer', icon: Code },
    { title: 'Designer', icon: Palette },
    { title: 'QA', icon: TestTube },
  ];

  const handleCustomJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomJob(e.target.value);
    onSelectJob(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Job Type</h2>
        <p className="text-gray-600">Select your role or enter a custom job title</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {jobTypes.map(({ title, icon: Icon }) => (
          <button
            key={title}
            onClick={() => onSelectJob(title)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedJob === title
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <Icon className="h-8 w-8 mx-auto mb-3 text-indigo-600" />
            <span className="block text-gray-800 font-medium">{title}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-500">
            or enter custom role
          </span>
        </div>
      </div>

      <input
        type="text"
        value={customJob}
        onChange={handleCustomJobChange}
        placeholder="Enter your job title"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />

      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!selectedJob && !customJob}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold
                   hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default JobTypeSelection;