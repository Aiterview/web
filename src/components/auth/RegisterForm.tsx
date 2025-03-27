import React, { useState, useEffect } from "react";
import {
  //User,
  Mail,
  Lock,
  Github,
  //Linkedin
} from "lucide-react";
import FormInput from "./components/FormInput";
import SocialButton from "./components/SocialButton";
import AuthDivider from "./components/AuthDivider";
import { useAuthStore } from "../../store/authStore";
import { useGitHubSignIn } from "../../hooks/useGitHubSignIn";
import { useNavigate } from "react-router";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');

  const { signUpWithEmail, error: authError } = useAuthStore();
  const { signIn, loading } = useGitHubSignIn();
  const navigate = useNavigate();

  // Monitor authentication errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Validate password strength
  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = 
      (hasLowerCase ? 1 : 0) + 
      (hasUpperCase ? 1 : 0) + 
      (hasNumber ? 1 : 0) + 
      (hasSpecial ? 1 : 0) + 
      (password.length >= 8 ? 1 : 0);
    
    if (strength < 3) {
      setPasswordStrength('weak');
    } else if (strength < 5) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password.length < 8) {
      setError("The password must be at least 8 characters long.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signUpWithEmail(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      // The main error has already been captured by the authError effect
      if (!authError) {
        setError(
          err.message || 
          "An error occurred during registration. Please try again."
        );
      }
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
          required
          disabled={isLoading}
        />

        <div>
          <FormInput
            id="register-password"
            type="password"
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            icon={Lock}
            required
            disabled={isLoading}
          />
          {passwordStrength && (
            <div className="mt-1 flex items-center">
              <div className="flex w-full space-x-1">
                <div 
                  className={`h-1 flex-1 rounded-full ${
                    passwordStrength === 'weak' 
                      ? 'bg-red-500' 
                      : passwordStrength === 'medium' 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                />
                <div 
                  className={`h-1 flex-1 rounded-full ${
                    passwordStrength === 'weak' 
                      ? 'bg-gray-200' 
                      : passwordStrength === 'medium' 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                />
                <div 
                  className={`h-1 flex-1 rounded-full ${
                    passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {passwordStrength === 'weak'
                  ? 'Weak'
                  : passwordStrength === 'medium'
                  ? 'Medium'
                  : 'Strong'}
              </span>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Must be at least 8 characters
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
          I agree to the{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 px-4 rounded-lg
                 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                 transform hover:scale-[1.02] active:scale-[0.98]
                 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      <AuthDivider text="Or sign up with" />

      <div className="grid place-items-center">
        {" "}
        {/** grid-cols-2 gap-4 */}
        <SocialButton
          icon={Github}
          label="GitHub"
          onClick={signIn}
          disabled={loading || isLoading}
        />
        {/* <SocialButton icon={Linkedin} label="LinkedIn" /> */}
      </div>
    </form>
  );
};

export default RegisterForm;
