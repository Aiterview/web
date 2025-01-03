import React, { useState } from 'react';
import { 
  //User, 
  Mail, 
  Lock, 
  Github, 
  //Linkedin 
} from 'lucide-react';
import FormInput from './components/FormInput';
import SocialButton from './components/SocialButton';
import AuthDivider from './components/AuthDivider';
import { register } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
  
      try {
        await register({ email, password });
        
        //localStorage.setItem('token', response.data.token);
        
        navigate('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(
          err.response?.data?.message || 
          'An error occurred during login. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
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
        {isLoading ? 'Creating Account...' : 'Create Account'}
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