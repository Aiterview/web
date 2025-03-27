import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { CiMail } from "react-icons/ci";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { resetPassword, error: authError, setError: setAuthError } = useAuthStore();

  // Clean errors from the store when mounting
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  // Monitor errors from the store
  useEffect(() => {
    if (authError) {
      setMessage(authError);
    }
  }, [authError]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }
    
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await resetPassword(email);
      setMessage("Password reset link sent! Please check your email.");
    } catch (err) {
      // The error should already have been captured by the authError effect
      if (!authError) {
        setMessage("Failed to send password reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`border-l-4 p-4 ${
            message.includes("sent") 
              ? "bg-blue-50 border-blue-500 text-blue-700" 
              : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex items-center mb-4">
        <span className="mr-3 text-gray-500">
          <CiMail className="w-6 h-6" />
        </span>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          autoComplete="email"
        />
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
        {isLoading ? "Sending..." : "Send Password Reset Link"}
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
      >
        Back to Login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;