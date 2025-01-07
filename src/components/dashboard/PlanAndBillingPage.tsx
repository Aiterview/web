import React from "react";
import {
  CreditCard,
  Clock,
  Shield,
  Package,
  Check,
  Settings,
  AlertCircle,
  ArrowRight,
  Download,
} from "lucide-react";

interface IBillingHistoryItemProps {
  date: string;
  amount: number;
  status: string;
  invoice: string;
}

interface IStatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  type: "success" | "warning" | "info";
}

const PlanAndBillingPage = () => {
  const plans = [
    {
      name: "Basic",
      price: "10",
      interval: "month",
      features: [
        "Up to 10 projects",
        "5GB storage",
        "Basic support",
        "Core features",
      ],
      current: false,
      color: "bg-blue-50",
      highlight: "border-blue-200",
    },
    {
      name: "Premium",
      price: "29",
      interval: "month",
      features: [
        "Unlimited projects",
        "100GB storage",
        "Priority support",
        "Advanced features",
        "API access",
      ],
      current: true,
      color: "bg-blue-100",
      highlight: "border-blue-500",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with gradient background */}
        <div className="px-8 py-8 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Plan & Billing</h1>
          <p className="text-gray-600 mt-2">
            Manage your subscription and billing details
          </p>
        </div>

        {/* Current Plan Overview */}
        <div className="px-8 py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-50">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Current Plan: <span className="text-blue-500">Premium</span>
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Billing cycle ends in 18 days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                Active
              </span>
              <button className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                <AlertCircle className="h-4 w-4 mr-2" />
                Cancel Plan
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Method
            </h2>
            <button className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-all gap-2 hover:gap-3">
              <Settings className="h-4 w-4" />
              <span>Manage</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-50">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Billing History
          </h2>
          <div className="space-y-4">
            <BillingHistoryItem
              date="Jan 1, 2024"
              amount={29.0}
              status="Paid"
              invoice="#INV-2024-001"
            />
            <BillingHistoryItem
              date="Dec 1, 2023"
              amount={29.0}
              status="Paid"
              invoice="#INV-2023-012"
            />
            <BillingHistoryItem
              date="Nov 1, 2023"
              amount={29.0}
              status="Paid"
              invoice="#INV-2023-011"
            />
          </div>
        </div>

        {/* Available Plans */}
        <div className="px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Available Plans
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg border-2 transition-all hover:shadow-lg ${
                  plan.color
                } ${plan.current ? `${plan.highlight}` : "border-gray-200"}`}
              >
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-blue-500 text-white font-semibold text-sm">
                      Current Plan
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-blue-500">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.interval}</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-green-100">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full mt-8 py-3 rounded-lg ${
                      plan.current
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Upgrade Plan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <StatCard
          icon={Clock}
          title="Next Billing Date"
          value="Jan 25, 2024"
          type="info"
        />
        <StatCard
          icon={Shield}
          title="Plan Status"
          value="Active"
          type="success"
        />
      </div>
    </div>
  );
};

const BillingHistoryItem: React.FC<IBillingHistoryItemProps> = ({
  date,
  amount,
  status,
  invoice,
}) => (
  <div className="border rounded-lg bg-white hover:shadow-md transition-shadow">
    <div className="flex flex-row items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-gray-50">
          <CreditCard className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{date}</p>
          <p className="text-sm text-gray-600">{invoice}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium text-lg">${amount.toFixed(2)}</span>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600">
          {status}
        </span>
        <button className="inline-flex items-center text-blue-500 hover:text-blue-600 gap-2 hover:gap-3 transition-all">
          Download
          <Download className="h-4 w-4" />
        </button>
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
          text: "text-blue-500",
          bg: "bg-blue-50",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${styles.bg}`}>
          <Icon className={`h-5 w-5 ${styles.text}`} />
        </div>
        <p className="text-gray-600 font-medium">{title}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default PlanAndBillingPage;
