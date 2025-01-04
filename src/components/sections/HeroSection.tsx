import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const HeroSection = () => {
  const { isAuthenticated } = useAuthStore();
  const destination = isAuthenticated ? '/dashboard' : '/auth';

  return (
    <div className="relative pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            
            <div className="relative">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm mb-6">
                <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-indigo-600">AI-Powered Interview Practice</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Ace Your Next Job Interview with{' '}
                <span className="gradient-text">Confidence!</span>
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Practice mock interviews tailored to your role and get real-time feedback.
              Perfect your answers and boost your chances of landing your dream job.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link to={destination}>
                <button className="button-primary group">
                  <span className="flex items-center">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center">
                See How It Works
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur-3xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-r p-1 from-indigo-200 via-purple-200 to-pink-200 rounded-[2rem] shadow-2xl animate-float">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Person practicing interview"
                className="rounded-[1.95rem] w-full"
              />
            </div>
            
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-4 glass-card">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/32?img=${i}`}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Join 10,000+ users</p>
                  <p className="text-gray-500">who improved their skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;