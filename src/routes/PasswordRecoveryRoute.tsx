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
      const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }
        setLoading(false);
      });
  
      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);
  
    if (loading) {
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-indigo-700 rounded-full animate-spin"></div>
          </div>
        );
    }

    if (!isPasswordRecovery) return <Navigate to="/" replace />;
  
    return children;
};