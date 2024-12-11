import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { BrainCog } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden
                    border border-white/20 hover:shadow-2xl transition-shadow duration-500">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl">
                <BrainCog className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue your practice' : 'Join thousands of job seekers'}
            </p>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 hover:text-indigo-500 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">Start Your Interview Practice Journey</h3>
              <p className="text-white/80">Join over 10,000+ users who improved their skills</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;