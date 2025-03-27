import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { BrainCog } from "lucide-react";
import { supabase } from "../../../lib/supabase/supabaseClient";

const UpdatePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { updatePassword, error: authError, setError: setAuthError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionVerified, setSessionVerified] = useState(false);

  // Debug: Show URL and hash in console for troubleshooting
  useEffect(() => {
    console.log('URL and parameters:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      href: window.location.href
    });
  }, [location]);

  // Check if we have a recovery token in the URL
  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        console.log("URL atual:", window.location.href);
        
        // Extract the recovery token (format #access_token=XXX)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        // Check if we have access tokens and recovery type
        if (accessToken && type === 'recovery') {
          console.log("Recovery token found in URL");
          
          // Configure the session with the recovery token
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error("Error configuring recovery session:", error);
            setErrorMessage("Invalid recovery link. Please request a new link.");
          } else {
            console.log("Recovery session configured:", data);
            // Clear the URL to remove sensitive parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            setSessionVerified(true);
          }
        } else if (isAuthenticated) {
          // If the user is already authenticated, allow password update
          setSessionVerified(true);
        } else {
          console.log("No recovery token in URL or user not authenticated");
          navigate('/auth/login');
        }
      } catch (err) {
        console.error("Error verifying recovery token:", err);
        setErrorMessage("Error verifying session. Please try again.");
      }
    };
    
    checkRecoveryToken();
  }, [navigate, isAuthenticated]);

  // Clear errors from the store when mounting
  useEffect(() => {
    setAuthError(null);
    return () => {
      setAuthError(null);
    };
  }, [setAuthError]);

  // Update error message when authError changes
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
    }
  }, [authError]);

  // Update password strength as the user types
  useEffect(() => {
    checkPasswordStrength(newPassword);
  }, [newPassword]);

  // Validate password strength
  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength(0);
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
    
    setPasswordStrength(Math.min(Math.floor(strength / 5 * 4), 3));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setErrorMessage('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrorMessage('');
  };

  const validateForm = (): boolean => {
    // Clear previous messages
    setErrorMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("The password must be at least 8 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setErrorMessage("The password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[a-z]/.test(newPassword)) {
      setErrorMessage("The password must contain at least one lowercase letter.");
      return false;
    }
    if (!/[0-9]/.test(newPassword)) {
      setErrorMessage("The password must contain at least one number.");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setErrorMessage("The password must contain at least one special character.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionVerified) {
      setErrorMessage("A valid session is required to update the password.");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccessMessage("Password updated successfully! Redirecting to login...");
      // Reset the form
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login after successful update
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      console.error('Error updating password:', err);
      // The error should already have been captured by the authError effect
      if (!authError) {
        setErrorMessage("Failed to update password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Medium";
    return "Strong";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 space-y-6">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <BrainCog size={36} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Update your password
          </h2>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={isLoading || !!successMessage}
              autoComplete="new-password"
            />
            
            {newPassword && (
              <div className="mt-2 flex items-center">
                <div className="flex w-full space-x-1">
                  <div 
                    className={`h-1 flex-1 rounded-full ${
                      passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200'
                    }`}
                  />
                  <div 
                    className={`h-1 flex-1 rounded-full ${
                      passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-gray-200'
                    }`}
                  />
                  <div 
                    className={`h-1 flex-1 rounded-full ${
                      passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  {getPasswordStrengthLabel()}
                </span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Enter your new password again"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={isLoading || !!successMessage}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMessage || !sessionVerified}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg
         hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
         ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
