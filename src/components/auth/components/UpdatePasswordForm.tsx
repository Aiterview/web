import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { BrainCog } from "lucide-react";

const UpdatePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const { updatePassword, error: authError, setError: setAuthError } = useAuthStore();
  const navigate = useNavigate();

  // Limpar erros do store ao montar
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  // Monitorar erros do store
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
    }
  }, [authError]);

  // Validar força da senha
  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength('');
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
    
    if (strength < 3) {
      setPasswordStrength('weak');
    } else if (strength < 5) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    checkPasswordStrength(password);
  };

  const validatePassword = () => {
    // Limpar mensagens anteriores
    setErrorMessage("");
    
    if (newPassword.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(newPassword)) {
      return "A senha deve conter pelo menos uma letra maiúscula.";
    }
    if (!/[a-z]/.test(newPassword)) {
      return "A senha deve conter pelo menos uma letra minúscula.";
    }
    if (!/[0-9]/.test(newPassword)) {
      return "A senha deve conter pelo menos um número.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return "A senha deve conter pelo menos um caractere especial.";
    }
    if (newPassword !== confirmPassword) {
      return "As senhas não coincidem.";
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
        "Senha atualizada com sucesso! Redirecionando para login..."
      );
      // Redirecionar para a página de autenticação após 3 segundos
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      // O erro principal já deve ter sido capturado pelo effect do authError
      if (!authError) {
        setErrorMessage("Falha ao atualizar a senha. Por favor, tente novamente.");
      }
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
              Atualizar sua senha
            </h2>
            <p className="text-gray-600">Digite sua nova senha</p>
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
                disabled={isLoading}
                autoComplete="new-password"
              />
              
              {passwordStrength && (
                <div className="mt-2 flex items-center">
                  <div className="flex w-full space-x-1">
                    <div 
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === 'weak' 
                          ? 'bg-red-500' 
                          : passwordStrength === 'medium' 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                    />
                    <div 
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === 'weak' 
                          ? 'bg-gray-200' 
                          : passwordStrength === 'medium' 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                    />
                    <div 
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {passwordStrength === 'weak'
                      ? 'Fraca'
                      : passwordStrength === 'medium'
                      ? 'Média'
                      : 'Forte'}
                  </span>
                </div>
              )}
              
              <p className="mt-1 text-xs text-gray-500">
                A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
              </p>
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite novamente sua senha"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg
          hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Atualizando..." : "Atualizar Senha"}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Lembrou sua senha?{" "}
              <Link to="/auth" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Faça login
              </Link>
            </p>
          </form>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">
                Inicie sua jornada de prática de entrevistas
              </h3>
              <p className="text-white/80">
                Junte-se a mais de 10.000 usuários que melhoraram suas habilidades
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
