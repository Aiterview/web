import { Check, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const freePlan = {
    features: [
      'Basic interview practice',
      '10 AI-generated questions per month',
      'Basic feedback analysis',
      'Role-specific questions',
    ],
  };

  const premiumPlan = {
    features: [
      'Unlimited interview practice',
      'Unlimited AI-generated questions',
      'Advanced feedback analysis',
      'Custom role requirements',
      'Interview performance tracking',
      'Sample answer suggestions',
      'Priority support',
      'Export interview history',
    ],
  };

  const { isAuthenticated } = useAuthStore()
  const destination = isAuthenticated ? "/dashboard" : "/auth"

  return (
    <section id="pricing" className="container mx-auto px-4 py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent" />
      
      <div className="text-center max-w-2xl mx-auto mb-16 relative">
        <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-4">
          Pricing
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, <span className="gradient-text">Transparent</span> Pricing
        </h2>
        <p className="text-xl text-gray-600">
          Start for free, upgrade when you need more features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="feature-card group">
          {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl -z-10" /> */}
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-600 mt-4">Perfect for getting started</p>
          </div>

          <ul className="space-y-4 mb-8">
            {freePlan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>

          <Link to={destination}>
            <button className="w-full px-6 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-semibold
                          hover:bg-indigo-50 transition-colors">
              Get Started
            </button>
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="feature-card group relative">
          {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur-xl -z-10" /> */}
          
          <div className="absolute -top-5 left-0 right-0 flex justify-center">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium
                        shadow-lg">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 mb-2">Premium Plan</h3>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">$19.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-600 mt-4">For serious interview preparation</p>
          </div>

          <ul className="space-y-4 mb-8">
            {premiumPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full button-primary">
            Upgrade Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;