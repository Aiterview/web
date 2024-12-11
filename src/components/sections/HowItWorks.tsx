import React from 'react';
import { ClipboardList, MessageSquare, LineChart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Choose Your Role',
      description: 'Select your job type or enter a custom role to get started.',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      icon: MessageSquare,
      title: 'Practice Questions',
      description: 'Get AI-generated questions specific to your role and experience.',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      icon: LineChart,
      title: 'Receive Feedback',
      description: 'Get detailed feedback and suggestions to improve your answers.',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <section id="how-it-works" className="container mx-auto px-4 relative py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-50" />
      
      <div className="text-center max-w-2xl mx-auto mb-16 relative">
        <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-4">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Three Simple <span className="gradient-text">Steps</span>
        </h2>
        <p className="text-xl text-gray-600">
          Get started with three simple steps and begin improving your interview skills today.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {steps.map((step, index) => (
          <div key={index} className="relative group">
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gradient-to-r from-indigo-100 to-purple-100" />
            )}
            <div className="feature-card">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${step.gradient} rounded-2xl blur-xl -z-10`} />
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.gradient} p-0.5 mb-6`}>
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <step.icon className="h-10 w-10 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-lg">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;