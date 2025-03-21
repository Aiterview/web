import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Clock,
  Shield,
  Coins,
  AlertCircle,
  Package,
  PlusCircle,
  RefreshCw,
  MousePointer,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { apiService } from "../../lib/api/api.service";
import { useAuthStore } from "../../store/authStore";
import { 
  ICreditPackage, 
  type CreditTransaction, 
  packageThemes,
  ICreditTransactionProps
} from "../../types/credits";

interface IStatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  type: "success" | "warning" | "info";
}

// Componente de pacote de crédito
const CreditPackageCard: React.FC<{
  packageData: ICreditPackage;
  isLoading: boolean;
  onBuy: (size: number) => void;
}> = ({ packageData, isLoading, onBuy }) => {
  const { size, unitPrice } = packageData;
  const theme = packageThemes[size as keyof typeof packageThemes] || packageThemes[1];
  
  return (
    <div 
      onClick={() => !isLoading && onBuy(size)}
      className={`p-4 border-2 rounded-lg shadow hover:shadow-xl transition-all bg-white flex flex-col cursor-pointer transform hover:scale-105 hover:border-${theme.textColor.replace('text-', '')} relative h-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <div className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 z-10 w-6 h-6 flex items-center justify-center">
        <MousePointer className="h-3 w-3" />
      </div>
      
      <div className={`p-4 rounded-full ${theme.bgColor} self-center mb-3 transition-transform hover:rotate-3`}>
        <Package className={`h-8 w-8 ${theme.iconColor}`} />
      </div>
      
      <h3 className="font-medium text-center text-gray-900 text-lg">
        {size} {size === 1 ? 'Crédito' : 'Créditos'}
      </h3>
      
      <p className={`text-center ${theme.textColor} font-bold text-2xl mt-2`}>
        R$ {(unitPrice * size).toFixed(2)}
      </p>
      
      <p className="text-center text-gray-500 text-sm">
        (R$ {unitPrice.toFixed(2)} por crédito)
      </p>
      
      {size > 5 && (
        <div className="mt-2 mb-2">
          <p className="text-center text-sm bg-yellow-50 text-yellow-700 py-1 px-2 rounded-md">
            Economize {(((10.00 - unitPrice) / 10.00 * 100).toFixed(0))}% por crédito
          </p>
        </div>
      )}
      
      {isLoading ? (
        <div className={`mt-auto w-full py-2 px-4 ${theme.buttonColor} text-white rounded-lg flex items-center justify-center gap-2`}>
          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
          <span>Processando...</span>
        </div>
      ) : (
        <div className={`mt-auto w-full py-2 px-4 ${theme.buttonColor} text-white rounded-lg flex items-center justify-center gap-2`}>
          <PlusCircle className="h-4 w-4" />
          <span>Comprar Agora</span>
        </div>
      )}
    </div>
  );
};

// Componente principal
const CreditsPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [creditBalance, setCreditBalance] = useState(0);
  const [transactions, setTransactions] = useState<ICreditTransactionProps[]>([]);
  const [packages, setPackages] = useState<ICreditPackage[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Array de pacotes padrão
  const defaultPackages: ICreditPackage[] = [
    { size: 1, unitPrice: 10.00 },
    { size: 5, unitPrice: 9.00 },
    { size: 10, unitPrice: 8.00 },
    { size: 20, unitPrice: 7.00 }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      console.log('Buscando dados de créditos para o usuário:', user.id);
      
      // Buscar saldo de créditos
      try {
        const balanceResponse = await apiService.credits.getBalance(user.id);
        console.log('Resposta do saldo:', balanceResponse);
        setCreditBalance(balanceResponse.balance);
      } catch (error) {
        console.error('Erro ao buscar saldo de créditos:', error);
        setCreditBalance(0);
      }
      
      // Buscar histórico de transações
      try {
        const transactionsResponse = await apiService.credits.getTransactions(user.id, 10, 1);
        console.log('Resposta das transações:', transactionsResponse);
        
        // Verificar se a resposta contém dados antes de processar
        if (!transactionsResponse || !transactionsResponse.data) {
          console.error('Resposta de transações inválida:', transactionsResponse);
          setTransactions([]);
          return;
        }
        
        // Formatar as transações
        const formattedTransactions = transactionsResponse.data.map((tx: CreditTransaction) => ({
          date: new Date(tx.created_at).toLocaleDateString(),
          amount: tx.amount,
          status: tx.amount > 0 ? "Concluído" : "Utilizado",
          description: tx.description || 
            (tx.type === 'purchase' ? `Compra de ${tx.package_size} créditos` : 
             tx.type === 'usage' ? 'Utilização de serviço' : 
             tx.type === 'monthly_free' ? 'Créditos mensais gratuitos' : 
             tx.type === 'initial_free' ? 'Créditos iniciais gratuitos' : 
             'Transação de créditos'),
          transactionId: tx.id
        }));
        
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Erro ao buscar histórico de transações:', error);
        setTransactions([]);
      }
      
      // Buscar pacotes disponíveis
      try {
        const packagesResponse = await apiService.credits.getPackages();
        console.log('Resposta dos pacotes:', packagesResponse);
        
        // Garantir que sempre teremos 4 pacotes
        const ensureFourPackages = (pkgs: ICreditPackage[]): ICreditPackage[] => {
          if (!pkgs || pkgs.length === 0) return defaultPackages;
          
          if (pkgs.length < 4) {
            const missingPackages = defaultPackages.filter(
              defaultPkg => !pkgs.some(p => p.size === defaultPkg.size)
            ).slice(0, 4 - pkgs.length);
            
            return [...pkgs, ...missingPackages];
          }
          
          if (pkgs.length > 4) return pkgs.slice(0, 4);
          
          return pkgs;
        };
        
        setPackages(ensureFourPackages(packagesResponse.prices));
      } catch (error) {
        console.error('Erro ao buscar pacotes disponíveis:', error);
        setPackages(defaultPackages);
      }
      
    } catch (error) {
      console.error("Erro ao carregar dados de créditos:", error);
      setCreditBalance(0);
      setTransactions([]);
      setPackages(defaultPackages);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleBuyCredits = async (packageSize: number) => {
    try {
      if (!user?.id || !user?.email) return;
      
      setCheckoutLoading(packageSize);
      
      const checkoutResponse = await apiService.credits.createCheckoutSession(
        user.id,
        user.email,
        packageSize
      );
      
      // Redireciona para a URL de checkout se disponível
      if (checkoutResponse && checkoutResponse.url) {
        window.location.href = checkoutResponse.url;
      } else {
        console.error("URL de checkout não encontrada na resposta");
      }
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-8 py-6 sm:py-8 bg-primary-50 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Créditos
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Gerencie seus créditos e realize recargas
          </p>
        </div>

        {/* Saldo */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3 rounded-full bg-primary-50">
                <Wallet className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Saldo Atual: <span className="text-primary-600">{creditBalance} créditos</span>
                </h2>
                <p className="text-gray-600 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" /> Atualizado em {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm ${refreshing ? 'opacity-50 cursor-not-allowed' : ''} w-full sm:w-auto justify-center`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>
          </div>
        </div>

        {/* Pacotes de Créditos */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Pacotes de Créditos
            </h2>
          </div>
          
          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg mb-5 flex items-start sm:items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-yellow-700 text-sm">
              Clique diretamente em um dos pacotes abaixo para comprar e ser redirecionado ao checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <CreditPackageCard 
                key={pkg.size}
                packageData={pkg}
                isLoading={checkoutLoading === pkg.size}
                onBuy={handleBuyCredits}
              />
            ))}
          </div>
          
          <div className="mt-5 sm:mt-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
            <p className="text-blue-700 text-sm flex items-start sm:items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Após o pagamento, seus créditos serão adicionados automaticamente à sua conta e poderão ser usados imediatamente.</span>
            </p>
          </div>
        </div>

        {/* Histórico de Transações */}
        <div className="px-4 sm:px-8 py-4 sm:py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Histórico de Transações
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <CreditTransaction
                  key={transaction.transactionId || index}
                  date={transaction.date}
                  amount={transaction.amount}
                  status={transaction.status}
                  description={transaction.description}
                  transactionId={transaction.transactionId}
                />
              ))
            ) : (
              <div className="text-center p-6 sm:p-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <Coins className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p>Nenhuma transação encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8 w-full max-w-4xl">
        <StatCard
          icon={Clock}
          title="Última Recarga"
          value={transactions && transactions.length > 0 ? 
            transactions.filter(t => t.amount > 0)[0]?.date || "Nenhuma" : 
            "Nenhuma"}
          type="info"
        />
        <StatCard
          icon={TrendingUp}
          title="Total de Créditos"
          value={transactions ? transactions.reduce((total, t) => total + t.amount, 0) : 0}
          type="success"
        />
      </div>
    </div>
  );
};

const CreditTransaction: React.FC<ICreditTransactionProps> = ({
  date,
  amount,
  status,
  description,
  transactionId,
}) => (
  <div className="border rounded-lg bg-white hover:shadow-md transition-shadow">
    <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
      {/* Informações principais */}
      <div className="flex items-start gap-3 w-full sm:w-auto">
        <div className="p-2 rounded-lg bg-primary-50 flex-shrink-0 mt-0.5 sm:mt-0">
          <CreditCard className="h-5 w-5 text-primary-500" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{date}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>

      {/* Valor, status */}
      <div className="flex flex-row sm:flex-col md:flex-row items-center justify-between sm:justify-end gap-3 md:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
        <span className={`font-medium text-base sm:text-lg ${amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {amount > 0 ? '+' : ''}{amount} {Math.abs(amount) === 1 ? 'crédito' : 'créditos'}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm text-center whitespace-nowrap
          ${amount > 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {status}
        </span>
      </div>
    </div>
  </div>
);

const StatCard: React.FC<IStatCardProps> = ({
  icon: Icon,
  title,
  value,
  type,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          text: "text-green-500",
          bg: "bg-green-50",
        };
      case "warning":
        return {
          text: "text-yellow-500",
          bg: "bg-yellow-50",
        };
      default:
        return {
          text: "text-primary-500",
          bg: "bg-primary-50",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="border rounded-lg p-4 sm:p-6 bg-white hover:shadow-md transition-shadow">
      <div className="flex flex-row sm:flex-col items-center gap-3 mb-2 sm:mb-4">
        <div className={`p-3 rounded-full ${styles.bg}`}>
          <Icon className={`h-6 w-6 ${styles.text}`} />
        </div>
        <p className="text-gray-600 font-medium">{title}</p>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
        {value}
      </p>
    </div>
  );
};

export default CreditsPage;
