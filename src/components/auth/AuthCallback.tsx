import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Pega o hash da URL para processamento do Supabase
        const { hash, search } = window.location;

        // Se acessou diretamente a página sem parâmetros, verificamos a sessão atual
        // em vez de lançar um erro
        if (!hash && !search) {
          // Verifica se já existe uma sessão autenticada
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data.session) {
            // Se já está autenticado, redireciona para o dashboard
            navigate('/dashboard', { replace: true });
          } else {
            // Se não está autenticado, redireciona para a página de login
            navigate('/auth', { replace: true });
          }
          return;
        }

        // Processa a resposta da autenticação
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          // Se temos uma sessão, o login foi bem-sucedido
          // Redirecionar para o dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // Se não temos uma sessão, mas também não temos um erro,
          // algo estranho aconteceu
          navigate('/auth', { replace: true });
        }
      } catch (err) {
        console.error('Erro durante callback de autenticação:', err);
        setError(err instanceof Error ? err.message : 'Erro durante autenticação');
        // Redirecionar para a página de login após alguns segundos
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // Mostrar uma tela de carregamento enquanto processamos o callback
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro de Autenticação</h2>
          <p className="text-gray-700">{error}</p>
          <p className="mt-4 text-sm text-gray-500">Redirecionando para a página de login...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-indigo-700 rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processando autenticação</h2>
          <p className="text-gray-600">Por favor, aguarde enquanto verificamos suas credenciais...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback; 