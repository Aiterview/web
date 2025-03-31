/**
 * Types related to the credits module
 */

export interface CreditBalance {
  balance: number;
  userId: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string;
  package_size?: number;
  createdAt: Date;
}

export interface TransactionsResponse {
  data: CreditTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface ICreditPackage {
  size: number;
  unitPrice: number;
}

export interface PackagesResponse {
  availablePackages: number[];
  prices: ICreditPackage[];
}

export interface CheckoutResponse {
  url: string;
}

// Interfaces for components related to credits
export interface ICreditTransactionProps {
  date: string;
  amount: number;
  status: string;
  description: string;
  transactionId: string;
}

// Color themes for credit packages
export const packageThemes = {
  1: {
    bgColor: "bg-primary-50",
    textColor: "text-primary-600",
    buttonColor: "bg-primary-500 hover:bg-primary-600",
    iconColor: "text-primary-500",
  },
  5: {
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    buttonColor: "bg-green-500 hover:bg-green-600",
    iconColor: "text-green-500",
  },
  10: {
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    iconColor: "text-blue-500",
  },
  20: {
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    iconColor: "text-purple-500",
  },
}; 