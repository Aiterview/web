import React, { useState } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
} from "lucide-react";

interface IFaqItem {
  question: string;
  answer: string;
  category: string;
}

interface ISupportTicket {
  id: string;
  subject: string;
  status: "open" | "closed" | "pending";
  lastUpdate: string;
  priority: "high" | "medium" | "low";
}

const HelpAndSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const faqItems: IFaqItem[] = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address and follow the instructions sent to your inbox.",
      category: "Account",
    },
    {
      question: "How can I upgrade my subscription?",
      answer:
        "You can upgrade your subscription by going to the Plan & Billing section in your account settings. Choose your desired plan and follow the payment process.",
      category: "Billing",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions.",
      category: "Billing",
    },
  ];

  const recentTickets: ISupportTicket[] = [
    {
      id: "TCK-001",
      subject: "Integration Issue",
      status: "open",
      lastUpdate: "2 hours ago",
      priority: "high",
    },
    {
      id: "TCK-002",
      subject: "Billing Question",
      status: "closed",
      lastUpdate: "1 day ago",
      priority: "medium",
    },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-600";
      case "closed":
        return "bg-gray-100 text-gray-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          How can we help you?
        </h1>
        <div className="max-w-2xl relative">
          <input
            type="text"
            placeholder="Search for help articles, FAQs, and more..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Quick Links & Resources */}
        <div className="col-span-2 space-y-8">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard
              icon={BookOpen}
              title="Documentation"
              description="Browse detailed guides and documentation"
              link="#"
            />
            <QuickActionCard
              icon={Video}
              title="Video Tutorials"
              description="Watch step-by-step video guides"
              link="#"
            />
            <QuickActionCard
              icon={MessageCircle}
              title="Community Forum"
              description="Connect with other users and share solutions"
              link="#"
            />
            <QuickActionCard
              icon={Mail}
              title="Email Support"
              description="Get help from our support team"
              link="#"
            />
          </div>

          {/* FAQs Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="border rounded-lg">
                  <button
                    className="w-full px-4 py-3 flex items-center justify-between text-left"
                    onClick={() =>
                      setActiveQuestion(
                        activeQuestion === item.question ? null : item.question
                      )
                    }
                  >
                    <span className="font-medium">{item.question}</span>
                    {activeQuestion === item.question ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {activeQuestion === item.question && (
                    <div className="px-4 py-3 border-t bg-gray-50">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Support Options & Recent Tickets */}
        <div className="space-y-8">
          {/* Contact Options */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-sm text-gray-600">
                    Available Mon-Fri, 9am-5pm
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-gray-600">24/7 Support</p>
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    support@example.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Support Tickets */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Tickets</h2>
              <button className="text-blue-500 text-sm hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm text-gray-500">{ticket.id}</span>
                      <h3 className="font-medium">{ticket.subject}</h3>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusStyles(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Last updated: {ticket.lastUpdate}</span>
                    <div className="flex items-center gap-2">
                      <span>Priority:</span>
                      {getPriorityIcon(ticket.priority)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create New Ticket Button */}
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Create New Support Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string;
}) => (
  <a
    href={link}
    className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
  >
    <div className="flex items-start gap-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center gap-1 text-blue-500 text-sm mt-2 group">
          <span>Learn more</span>
          <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </a>
);

export default HelpAndSupportPage;
