import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Github,
  // Linkedin
} from "lucide-react";
import FormInput from "./components/FormInput";
import SocialButton from "./components/SocialButton";
import AuthDivider from "./components/AuthDivider";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useGitHubSignIn } from "../../hooks/useGitHubSignIn";

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const { signInWithEmail, error: authError, setError: setAuthError } = useAuthStore();
  const { signIn, loading } = useGitHubSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Clear errors when the component mounts
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  // Monitor authentication errors from the store
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const validateForm = () => {
    if (!email) {
      setError("Please enter your email.");
      return false;
    }
    if (!password) {
      setError("Please enter your password.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      // The main error has already been captured by the authError effect
      if (!authError) {
        setError(
          err.message || "An error occurred during login. Please try again."
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
          id="login-email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={Mail}
          required
          disabled={isLoading}
          autoComplete="email"
        />

        <FormInput
          id="login-password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
          required
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Forgot password?
        </button>
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
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <AuthDivider text="Or continue with" />

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

export default LoginForm;
