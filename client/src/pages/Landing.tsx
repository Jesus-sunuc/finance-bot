import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

const Landing = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [auth.isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-600 rounded-2xl mb-6 shadow-xl">
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            FinanceBot
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your AI-Powered Personal Finance Assistant
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Chat with AI to track expenses, manage budgets, and get financial
            insights
          </p>
          <button
            onClick={() => void auth.signinRedirect()}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2"
          >
            Get Started
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Expense Tracking
            </h3>
            <p className="text-gray-400">
              AI automatically categorizes and organizes your expenses
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Natural Chat Interface
            </h3>
            <p className="text-gray-400">
              Just talk to your financial assistant like a friend
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
            <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Receipt OCR Scanning
            </h3>
            <p className="text-gray-400">
              Snap a photo and let AI extract all the details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
