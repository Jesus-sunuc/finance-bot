import { useEffect, useState } from "react";
import type { Budget } from "../models/Budget";

interface BudgetSidebarProps {
  budget: Budget | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BudgetSidebar({
  budget,
  isOpen,
  onClose,
}: BudgetSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!budget && !isOpen) return null;

  const getProgressColor = (percentage: number): string => {
    if (percentage < 70) return "bg-green-500";
    if (percentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBackgroundColor = (percentage: number): string => {
    if (percentage < 70) return "bg-green-50 border-green-200";
    if (percentage < 90) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getTextColor = (percentage: number): string => {
    if (percentage < 70) return "text-green-800";
    if (percentage < 90) return "text-yellow-800";
    return "text-red-800";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isVisible ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Budget Set!</h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors p-1"
                aria-label="Close sidebar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          {budget && (
            <div className="flex-1 overflow-y-auto p-6">
              <div
                className={`rounded-lg border-2 p-6 mb-6 ${getBackgroundColor(
                  budget.percentage
                )}`}
              >
                <h3
                  className={`text-xl font-semibold mb-2 ${getTextColor(
                    budget.percentage
                  )}`}
                >
                  {budget.category}
                </h3>
                <p className="text-gray-600 text-sm capitalize">
                  {budget.period} Budget
                </p>
              </div>

              {/* Budget Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Budget Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${budget.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spent:</span>
                  <span className="text-xl font-semibold text-gray-700">
                    ${budget.spent.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Remaining:</span>
                  <span
                    className={`text-xl font-semibold ${
                      budget.remaining >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${Math.abs(budget.remaining).toFixed(2)}
                    {budget.remaining < 0 && " over"}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress
                    </span>
                    <span
                      className={`text-sm font-semibold ${getTextColor(
                        budget.percentage || 0
                      )}`}
                    >
                      {(budget.percentage || 0).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                        budget.percentage || 0
                      )}`}
                      style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Status Message */}
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm text-blue-800">
                    {budget.percentage < 70
                      ? "Great job! You're well within your budget."
                      : budget.percentage < 90
                      ? "You're approaching your budget limit. Consider your spending carefully."
                      : "You've reached or exceeded your budget. Time to review your expenses!"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50">
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
