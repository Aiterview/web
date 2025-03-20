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

  // Debug: Mostrar URL e hash no console para troubleshooting
  useEffect(() => {
    console.log('URL e parâmetros:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      href: window.location.href
    });
  }, [location]);

  // Verificar se temos um token de recuperação na URL
  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        console.log("URL atual:", window.location.href);
        
        // Extrair o token de recuperação (format #access_token=XXX)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        // Verificar se temos tokens de acesso e tipo de recuperação
        if (accessToken && type === 'recovery') {
          console.log("Token de recuperação encontrado na URL");
          
          // Configurar a sessão com o token de recuperação
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error("Erro ao configurar sessão de recuperação:", error);
            setErrorMessage("Link de recuperação inválido. Por favor, solicite um novo link.");
          } else {
            console.log("Sessão de recuperação configurada:", data);
            // Limpar a URL para remover os parâmetros sensíveis
            window.history.replaceState({}, document.title, window.location.pathname);
            setSessionVerified(true);
          }
        } else if (isAuthenticated) {
          // Se o usuário já está autenticado, permitir a atualização de senha
          setSessionVerified(true);
        } else {
          console.log("Sem token de recuperação na URL ou usuário não autenticado");
          navigate('/auth/login');
        }
      } catch (err) {
        console.error("Erro ao verificar o token de recuperação:", err);
        setErrorMessage("Erro ao verificar a sessão. Por favor, tente novamente.");
      }
    };
    
    checkRecoveryToken();
  }, [navigate, isAuthenticated]);

  // Limpar erros do store ao montar
  useEffect(() => {
    setAuthError(null);
    return () => {
      setAuthError(null);
    };
  }, [setAuthError]);

  // Atualizar mensagem de erro quando o authError mudar
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
    }
  }, [authError]);

  // Atualizar a força da senha conforme o usuário digita
  useEffect(() => {
    checkPasswordStrength(newPassword);
  }, [newPassword]);

  // Validar força da senha
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
    // Limpar mensagens anteriores
    setErrorMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("A senha deve ter pelo menos 8 caracteres.");
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setErrorMessage("A senha deve conter pelo menos uma letra maiúscula.");
      return false;
    }
    if (!/[a-z]/.test(newPassword)) {
      setErrorMessage("A senha deve conter pelo menos uma letra minúscula.");
      return false;
    }
    if (!/[0-9]/.test(newPassword)) {
      setErrorMessage("A senha deve conter pelo menos um número.");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setErrorMessage("A senha deve conter pelo menos um caractere especial.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionVerified) {
      setErrorMessage("É necessária uma sessão válida para atualizar a senha.");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccessMessage("Senha atualizada com sucesso! Redirecionando para login...");
      // Resetar o formulário
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirecionar para o login após atualização bem-sucedida
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      // O erro principal já deve ter sido capturado pelo effect do authError
      if (!authError) {
        setErrorMessage("Falha ao atualizar a senha. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 1) return "Fraca";
    if (passwordStrength <= 2) return "Média";
    return "Forte";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 space-y-6">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <BrainCog size={36} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Atualizar sua senha
          </h2>
          <p className="text-gray-600">Digite sua nova senha</p>
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
              Nova Senha
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Digite sua nova senha"
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
              Confirmar Senha
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Digite novamente sua senha"
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
            {isLoading ? "Atualizando..." : "Atualizar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
