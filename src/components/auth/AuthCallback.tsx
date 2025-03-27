import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash and parameters from the URL for processing
        const { hash, search } = window.location;

        // Check if it's a recovery link
        if (hash && hash.includes('type=recovery')) {
          // Redirect to the password update page
          navigate('/update-password', { replace: true });
          return;
        }

        // If accessed directly without parameters, check the current session
        // instead of throwing an error
        if (!hash && !search) {
          // Check if it's a recovery session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data.session) {
            // Check if it's a recovery session
            if (data.session.user?.aud === 'recovery') {
              navigate('/update-password', { replace: true });
              return;
            }
            
            // If already authenticated, redirect to the dashboard
            navigate('/dashboard', { replace: true });
          } else {
            // If not authenticated, redirect to the login page
            navigate('/auth', { replace: true });
          }
          return;
        }

        // Process the regular authentication response
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          // Check again if this is a recovery session
          if (data.session.user?.aud === 'recovery') {
            navigate('/update-password', { replace: true });
            return;
          }
          
          // If we have a normal session, the login was successful
          // Redirect to the dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // If we don't have a session, but also don't have an error,
          // something strange happened
          navigate('/auth', { replace: true });
        }
      } catch (err) {
        console.error('Error during authentication callback:', err);
        setError(err instanceof Error ? err.message : 'Error during authentication');
        // Redirect to the login page after a few seconds
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // Show a loading screen while processing the callback
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700">{error}</p>
          <p className="mt-4 text-sm text-gray-500">Redirecting to the login page...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-indigo-700 rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing authentication</h2>
          <p className="text-gray-600">Please wait while we verify your credentials...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback; 