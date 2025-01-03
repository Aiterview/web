import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Github, 
  //Linkedin 
} from 'lucide-react';
import FormInput from './components/FormInput';
import SocialButton from './components/SocialButton';
import AuthDivider from './components/AuthDivider';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          id="register-name"
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          icon={User}
        />

        <FormInput
          id="register-email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={Mail}
        />

        <div>
          <FormInput
            id="register-password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
          />
          <p className="mt-1 text-sm text-gray-500">
            Must be at least 8 characters long
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 px-4 rounded-lg
                 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Create Account
      </button>

      <AuthDivider text="Or sign up with" />

      <div className="grid place-items-center"> {/** grid-cols-2 gap-4 */}
        <SocialButton icon={Github} label="GitHub" />
        {/* <SocialButton icon={Linkedin} label="LinkedIn" /> */}
      </div>
    </form>
  );
};

export default RegisterForm;