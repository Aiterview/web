import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Github, 
  // Linkedin 
} from 'lucide-react';
import FormInput from './components/FormInput';
import SocialButton from './components/SocialButton';
import AuthDivider from './components/AuthDivider';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          id="login-email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={Mail}
        />

        <FormInput
          id="login-password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 px-4 rounded-lg
                 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Sign In
      </button>

      <AuthDivider text="Or continue with" />

      <div className="grid place-items-center"> {/** grid-cols-2 gap-4 */}
        <SocialButton icon={Github} label="GitHub" />
        {/* <SocialButton icon={Linkedin} label="LinkedIn" /> */}
      </div>
    </form>
  );
};

export default LoginForm;