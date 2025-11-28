import { useState } from "react";
import { useExpensesQuery } from "../hooks/ExpenseHooks";
import { useBudgets } from "../hooks/BudgetHooks";
import { useChatMessages, useDeleteChatHistory } from "../hooks/ChatHooks";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import type { Expense } from "../models/Expense";
import type { ChatMessage } from "../hooks/ChatHooks";

const Admin = () => {
  const { data: expenses = [], isLoading: expensesLoading } =
    useExpensesQuery();
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: chatMessages = [], isLoading: chatLoading } = useChatMessages();
  const deleteChatHistory = useDeleteChatHistory();

  const [showClearChatModal, setShowClearChatModal] = useState(false);

  const totalExpenses = expenses.length;
  const totalSpent = expenses.reduce(
    (sum: number, exp: { amount: number }) => sum + exp.amount,
    0
  );

  const totalBudgets = budgets.length;
  const totalBudgetAmount = budgets.reduce(
    (sum: number, b: { amount: number }) => sum + b.amount,
    0
  );

  const recentExpenses = [...expenses]
    .sort(
      (a: Expense, b: Expense) =>
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
    )
    .slice(0, 5);

  const recentChats = [...chatMessages]
    .sort(
      (a: ChatMessage, b: ChatMessage) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);

  const handleClearChatHistory = async () => {
    try {
      await deleteChatHistory.mutateAsync();
      showSuccessToast("Chat history cleared successfully");
      setShowClearChatModal(false);
    } catch {
      showErrorToast("Failed to clear chat history");
    }
  };

  const isLoading = expensesLoading || budgetsLoading || chatLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Admin Panel</h1>
        <p className="text-gray-400">System monitoring and management</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          System Overview
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-100">{totalExpenses}</p>
            <p className="text-xs text-gray-500 mt-1">
              ${totalSpent.toFixed(2)} spent
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Active Budgets</p>
            <p className="text-2xl font-bold text-gray-100">{totalBudgets}</p>
            <p className="text-xs text-gray-500 mt-1">
              ${totalBudgetAmount.toFixed(2)} allocated
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Chat Messages</p>
            <p className="text-2xl font-bold text-gray-100">
              {chatMessages.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total conversations</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100">
              Recent Expenses
            </h3>
          </div>
          <div className="p-4">
            {isLoading ? (
              <p className="text-center text-gray-400 py-4">Loading...</p>
            ) : recentExpenses.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No expenses yet</p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((exp: Expense) => (
                  <div
                    key={exp.id}
                    className="flex justify-between items-center p-3 bg-gray-700/50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-100">
                        {exp.merchant}
                      </p>
                      <p className="text-xs text-gray-400">{exp.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-100">
                        ${exp.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(exp.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-100">
              Recent Chat Activity
            </h3>
            <button
              onClick={() => setShowClearChatModal(true)}
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              disabled={chatMessages.length === 0}
            >
              Clear History
            </button>
          </div>
          <div className="p-4">
            {isLoading ? (
              <p className="text-center text-gray-400 py-4">Loading...</p>
            ) : recentChats.length === 0 ? (
              <p className="text-center text-gray-400 py-4">
                No chat messages yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentChats.map((msg: ChatMessage, idx: number) => (
                  <div
                    key={msg.id || idx}
                    className="p-3 bg-gray-700/50 rounded"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${
                          msg.role === "user"
                            ? "text-blue-400"
                            : "text-green-400"
                        }`}
                      >
                        {msg.role === "user" ? "User" : "Assistant"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showClearChatModal}
        onCancel={() => setShowClearChatModal(false)}
        onConfirm={handleClearChatHistory}
        title="Clear Chat History"
        message="Are you sure you want to clear all chat history? This action cannot be undone."
        confirmText="Clear History"
        variant="danger"
      />
    </div>
  );
};

export default Admin;
