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
      // Verificar se há hash de recuperação de senha na URL
      const checkHashForRecovery = () => {
        const hash = window.location.hash;
        // O hash de recuperação de senha do Supabase contém "type=recovery"
        if (hash && hash.includes('type=recovery')) {
          setIsPasswordRecovery(true);
          return true;
        }
        return false;
      };
      
      // Verificar primeiro se já há um hash na URL
      const hashExists = checkHashForRecovery();
      
      // Se não encontrou hash, observar eventos de autenticação
      if (!hashExists) {
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY') {
            setIsPasswordRecovery(true);
          }
          setLoading(false);
        });
        
        // Verificar se já existe uma sessão em estado de recuperação de senha
        supabase.auth.getSession().then(({ data }) => {
          // Algumas vezes o Supabase não dispara o evento PASSWORD_RECOVERY
          // mas a sessão tem um token de recuperação
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
        // Se já identificou pelo hash, não precisa esperar mais
        setLoading(false);
      }
    }, []);
  
    if (loading) {
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-indigo-700 rounded-full animate-spin"></div>
            <p className="ml-4 font-medium text-gray-700">Verificando autenticação...</p>
          </div>
        );
    }

    // Se não for um evento de recuperação de senha, redirecionar para a home
    if (!isPasswordRecovery) {
      console.log("Não é um evento de recuperação de senha. Redirecionando para /");
      return <Navigate to="/" replace />;
    }
  
    return children;
};