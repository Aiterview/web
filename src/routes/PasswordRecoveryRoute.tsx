import { useState, useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase/supabaseClient";

interface PasswordRecoveryRouteProps {
    children: ReactNode;
}

export const PasswordRecoveryRoute = ({ children }: PasswordRecoveryRouteProps) => {
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Check if there is a password recovery hash in the URL
      const checkHashForRecovery = () => {
        const hash = window.location.hash;
        // The Supabase recovery hash contains "type=recovery"
        if (hash && hash.includes('type=recovery')) {
          setIsPasswordRecovery(true);
          return true;
        }
        return false;
      };
      
      // Check first if there is a hash in the URL
      const hashExists = checkHashForRecovery();
      
      // If there is no hash, observe authentication events
      if (!hashExists) {
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY') {
            setIsPasswordRecovery(true);
          }
          setLoading(false);
        });
        
        // Check if there is a password recovery session
        supabase.auth.getSession().then(({ data }) => {
          // Sometimes the Supabase does not trigger the PASSWORD_RECOVERY event
          // but the session has a recovery token
          if (data.session?.user?.aud === 'recovery') {
            setIsPasswordRecovery(true);
          }
          
          if (!hashExists) {
            setLoading(false);
          }
        });
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } else {
        // If you have identified by hash, do not wait anymore
        setLoading(false);
      }
    }, []);
  
    if (loading) {
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-indigo-700 rounded-full animate-spin"></div>
            <p className="ml-4 font-medium text-gray-700">Checking authentication...</p>
          </div>
        );
    }

    // If it is not a password recovery event, redirect to the home
    if (!isPasswordRecovery) {
      console.log("It is not a password recovery event. Redirecting to /");
      return <Navigate to="/" replace />;
    }
  
    return children;
};