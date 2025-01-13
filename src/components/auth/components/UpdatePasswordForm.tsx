import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { BrainCog } from "lucide-react";

const UpdatePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuthStore();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (newPassword.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(newPassword)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(newPassword)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(newPassword)) {
      return "Password must contain at least one number.";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validatePassword();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccessMessage(
        "Password updated successfully! Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setErrorMessage("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div
        className="max-w-md w-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden
                    border border-white/20 hover:shadow-2xl transition-shadow duration-500"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl">
                <Link to="/">
                  <BrainCog className="h-8 w-8 text-white" />
                </Link>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Update your password
            </h2>
            <p className="text-gray-600">Type your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 p-4 text-green-700 rounded">
                {successMessage}
              </div>
            )}

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
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg
          hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">
                Start Your Interview Practice Journey
              </h3>
              <p className="text-white/80">
                Join over 10,000+ users who improved their skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
