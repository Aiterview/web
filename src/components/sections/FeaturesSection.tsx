import React from 'react';
import { Brain, Target, MessageSquare, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description:
        'Get customized interview questions based on your specific role and experience level.',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Target,
      title: 'Real-time Feedback',
      description:
        'Receive instant feedback on your answers to improve your interview performance.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: MessageSquare,
      title: 'Role-specific Practice',
      description:
        'Practice with questions tailored to your industry, from tech to finance.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      description:
        'Get detailed analysis of your communication style, confidence, and technical accuracy.',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent" />
      
      <div className="text-center max-w-2xl mx-auto mb-16 relative">
        <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-4">
          Features
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Everything You Need to <span className="gradient-text">Succeed</span>
        </h2>
        <p className="text-xl text-gray-600">
          Our platform provides all the tools you need to practice and perfect your interview skills.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {features.map((feature, index) => (
          <div key={index} className="feature-card group">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl -z-10`} />
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6`}>
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;