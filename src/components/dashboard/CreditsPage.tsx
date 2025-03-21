import React, { useState, useEffect, Suspense } from "react";
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

// Componente de transação
const CreditTransaction: React.FC<ICreditTransactionProps> = ({
  date,
  amount,
  status,
  description,
  transactionId,
}) => {
  // Verificação de segurança para os dados
  const safeDate = date || "Data indisponível";
  const safeAmount = typeof amount === 'number' ? amount : 0;
  const safeStatus = status || (safeAmount > 0 ? "Concluído" : "Utilizado");
  const safeDescription = description || "Transação de crédito";
  
  return (
    <div className="border rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        {/* Informações principais */}
        <div className="flex items-start gap-3 w-full sm:w-auto">
          <div className="p-2 rounded-lg bg-primary-50 flex-shrink-0 mt-0.5 sm:mt-0">
            <CreditCard className="h-5 w-5 text-primary-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{safeDate}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{safeDescription}</p>
          </div>
        </div>

        {/* Valor, status */}
        <div className="flex flex-row sm:flex-col md:flex-row items-center justify-between sm:justify-end gap-3 md:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
          <span className={`font-medium text-base sm:text-lg ${safeAmount > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {safeAmount > 0 ? '+' : ''}{safeAmount} {Math.abs(safeAmount) === 1 ? 'crédito' : 'créditos'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm text-center whitespace-nowrap
            ${safeAmount > 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            {safeStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente de estatísticas
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

// Skeleton loaders
const PackageSkeleton = () => (
  <div className="p-4 border-2 rounded-lg shadow bg-white flex flex-col animate-pulse h-full">
    <div className="w-12 h-12 bg-gray-200 rounded-full self-center mb-3"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4 self-center mb-2"></div>
    <div className="h-7 bg-gray-200 rounded w-1/2 self-center mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 self-center mb-5"></div>
    <div className="mt-auto w-full h-10 bg-gray-200 rounded-lg"></div>
  </div>
);

const TransactionSkeleton = () => (
  <div className="border rounded-lg bg-white animate-pulse">
    <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
      <div className="flex items-start gap-3 w-full">
        <div className="p-2 rounded-lg bg-gray-200 h-9 w-9"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="flex flex-row sm:flex-col md:flex-row items-center justify-between sm:justify-end gap-3 md:gap-4 w-full sm:w-auto">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

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

  // Adicionando skeleton states para melhorar UX durante carregamento
  const [packagesLoaded, setPackagesLoaded] = useState(false);
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    
    // Paralelizar as requisições para melhorar performance
    if (user?.id) {
      Promise.allSettled([
        fetchBalance(),
        fetchTransactions(),
        fetchPackages()
      ]).finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
    } else {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Separar as chamadas para permitir carregamento parcial
  const fetchBalance = async () => {
    try {
      if (!user?.id) return;
      
      const balanceResponse = await apiService.credits.getBalance(user.id);
      setCreditBalance(balanceResponse.balance);
    } catch (error) {
      console.error('Erro ao buscar saldo de créditos:', error);
      setCreditBalance(0);
    } finally {
      setBalanceLoaded(true);
    }
  };

  const fetchTransactions = async () => {
    try {
      if (!user?.id) return;
      
      const limit = 10;
      const page = 1;
      
      const response = await apiService.credits.getTransactions(user.id, limit, page);
      
      if (!response || !Array.isArray(response)) {
        setTransactions([]);
        setTransactionsLoaded(true);
        return;
      }
      
      // Mapear transações para o formato necessário
      const formattedTransactions = response.map((tx: CreditTransaction) => {
        // Garantir formato de data válido
        let formattedDate = "Data indisponível";
        try {
          // Verificar se a data é válida antes de formatá-la
          const date = new Date(tx.created_at);
          if (!isNaN(date.getTime())) {
            formattedDate = new Intl.DateTimeFormat('pt-BR', { 
              day: '2-digit', 
              month: '2-digit',
              year: 'numeric'
            }).format(date);
          }
        } catch (e) {
          console.error('Erro ao formatar data:', e);
        }
        
        return {
          date: formattedDate,
          amount: tx.amount,
          status: tx.amount > 0 ? "Concluído" : "Utilizado",
          description: tx.description || 
            (tx.type === 'purchase' ? `Compra de ${tx.package_size} créditos` : 
             tx.type === 'usage' ? 'Utilização de serviço' : 
             tx.type === 'monthly_free' ? 'Créditos mensais gratuitos' : 
             tx.type === 'initial_free' ? 'Créditos iniciais gratuitos' : 
             'Transação de créditos'),
          transactionId: tx.id
        };
      });
      
      // Ordenar por data mais recente primeiro
      const sortedTransactions = formattedTransactions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setTransactions(sortedTransactions);
      
    } catch (error) {
      console.error('Erro ao buscar histórico de transações:', error);
      setTransactions([]);
    } finally {
      setTransactionsLoaded(true);
    }
  };

  const fetchPackages = async () => {
    try {
      const packagesResponse = await apiService.credits.getPackages();
      
      if (!packagesResponse || !packagesResponse.prices || !Array.isArray(packagesResponse.prices)) {
        setPackages(defaultPackages);
        return;
      }
      
      // Garantir que sempre teremos pacotes
      setPackages(packagesResponse.prices.length > 0 ? packagesResponse.prices : defaultPackages);
    } catch (error) {
      console.error('Erro ao buscar pacotes disponíveis:', error);
      setPackages(defaultPackages);
    } finally {
      setPackagesLoaded(true);
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

  // Renderização condicional para Loading State
  if (loading && !balanceLoaded && !packagesLoaded && !transactionsLoaded && !refreshing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Formatar a data da última recarga
  let lastRechargeDate = "Nenhuma";
  const lastRecharge = transactions.find(t => t.amount > 0);
  if (lastRecharge && lastRecharge.date && lastRecharge.date !== "Data indisponível") {
    lastRechargeDate = lastRecharge.date;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-8 py-6 sm:py-8 bg-primary-50 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
            Créditos
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base text-center sm:text-left">
            Gerencie seus créditos e realize recargas
          </p>
        </div>

        {/* Saldo */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="flex items-center sm:items-start gap-4">
              <div className="p-3 rounded-full bg-primary-50">
                <Wallet className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-center sm:text-left">
                {balanceLoaded ? (
                  <>
                    <h2 className="font-semibold text-gray-900">
                      Saldo Atual: <span className="text-primary-600">{creditBalance} créditos</span>
                    </h2>
                    <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 text-sm">
                      <Clock className="h-4 w-4" /> Atualizado em {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-5 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm ${refreshing ? 'opacity-50 cursor-not-allowed' : ''} w-full sm:w-auto`}
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
            <h2 className="text-lg font-semibold text-gray-900 text-center sm:text-left">
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
            {packagesLoaded ? (
              packages && packages.length > 0 ? (
                packages.map((pkg) => (
                  <CreditPackageCard 
                    key={pkg.size}
                    packageData={pkg}
                    isLoading={checkoutLoading === pkg.size}
                    onBuy={handleBuyCredits}
                  />
                ))
              ) : (
                // Fallback para pacotes padrão caso o array esteja vazio
                defaultPackages.map((pkg) => (
                  <CreditPackageCard 
                    key={pkg.size}
                    packageData={pkg}
                    isLoading={checkoutLoading === pkg.size}
                    onBuy={handleBuyCredits}
                  />
                ))
              )
            ) : (
              // Skeleton loading para pacotes
              Array(4).fill(0).map((_, index) => (
                <PackageSkeleton key={index} />
              ))
            )}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">
            Histórico de Transações
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {transactionsLoaded ? (
              transactions && transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <CreditTransaction
                    key={transaction.transactionId || index}
                    date={transaction.date}
                    amount={transaction.amount}
                    status={transaction.status}
                    description={transaction.description || "Transação de crédito"}
                    transactionId={transaction.transactionId || `tx-${index}`}
                  />
                ))
              ) : (
                <div className="text-center p-6 sm:p-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  <Coins className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              )
            ) : (
              // Skeleton loading para transações
              Array(3).fill(0).map((_, index) => (
                <TransactionSkeleton key={index} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <Suspense fallback={<div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8 w-full max-w-4xl">
          <StatCard
            icon={Clock}
            title="Última Recarga"
            value={lastRechargeDate}
            type="info"
          />
          <StatCard
            icon={TrendingUp}
            title="Total de Créditos"
            value={creditBalance || 0}
            type="success"
          />
        </div>
      </Suspense>
    </div>
  );
};

export default CreditsPage;
