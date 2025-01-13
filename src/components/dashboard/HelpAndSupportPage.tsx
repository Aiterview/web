import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  MessageCircle, 
  Mail, 
  AlertCircle,
  Clock,
  Send
} from "lucide-react";

const HelpAndSupportPage = () => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  });

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address and follow the instructions sent to your inbox.",
    },
    {
      question: "How can I upgrade my subscription?",
      answer: "You can upgrade your subscription by going to the Plan & Billing section in your account settings. Choose your desired plan and follow the payment process.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with gradient background */}
        <div className="px-6 sm:px-8 py-6 sm:py-8 bg-indigo-50 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Help & Support
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Get help with your account and services
          </p>
        </div>

        {/* FAQ Section */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="border rounded-lg hover:shadow-md transition-shadow">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                  onClick={() => setActiveQuestion(
                    activeQuestion === item.question ? null : item.question
                  )}
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  {activeQuestion === item.question ? (
                    <ChevronDown className="h-5 w-5 text-indigo-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-indigo-500" />
                  )}
                </button>
                {activeQuestion === item.question && (
                  <div className="px-4 py-3 border-t bg-indigo-50">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="px-6 sm:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Mail className="h-6 w-6 text-indigo-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Support
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="absolute right-3 top-3">
                  {getPriorityIcon(formData.priority)}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Support Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupportPage;