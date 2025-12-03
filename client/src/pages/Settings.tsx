import { useState } from "react";
import { useExpensesQuery } from "../hooks/ExpenseHooks";
import { useBudgets } from "../hooks/BudgetHooks";
import { useDeleteChatHistory } from "../hooks/ChatHooks";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import toast from "react-hot-toast";
import { useCurrency, type Currency } from "../contexts/CurrencyContext";
import SelectInput from "../components/ui/SelectInput";

const Settings = () => {
  const { data: expenses } = useExpensesQuery();
  const { data: budgets } = useBudgets();
  const deleteChatHistory = useDeleteChatHistory();
  const { currency, setCurrency, formatCurrency } = useCurrency();

  const [showClearDataModal, setShowClearDataModal] = useState(false);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    toast.success(`Currency set to ${newCurrency}`);
  };

  const handleExportPDF = () => {
    try {
      const totalExpenses = (expenses || []).reduce(
        (sum, e) => sum + e.amount,
        0
      );
      const totalBudgets = (budgets || []).reduce(
        (sum, b) => sum + b.amount,
        0
      );

      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Finance Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
              h2 { color: #374151; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
              th { background-color: #f3f4f6; font-weight: 600; color: #1f2937; }
              tr:hover { background-color: #f9fafb; }
              .summary { display: flex; gap: 20px; margin: 20px 0; }
              .summary-card { flex: 1; padding: 20px; background: #f3f4f6; border-radius: 8px; }
              .summary-card h3 { margin: 0 0 10px 0; color: #6b7280; font-size: 14px; }
              .summary-card p { margin: 0; font-size: 24px; font-weight: bold; color: #1f2937; }
              .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>Finance Report</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

            <div class="summary">
              <div class="summary-card">
                <h3>Total Expenses</h3>
                <p>${formatCurrency(totalExpenses)}</p>
              </div>
              <div class="summary-card">
                <h3>Total Budgets</h3>
                <p>${formatCurrency(totalBudgets)}</p>
              </div>
              <div class="summary-card">
                <h3>Transactions</h3>
                <p>${(expenses || []).length}</p>
              </div>
            </div>

            <h2>Expenses (${(expenses || []).length})</h2>
            ${
              (expenses || []).length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  ${(expenses || [])
                    .map(
                      (e) => `
                    <tr>
                      <td>${new Date(e.date).toLocaleDateString()}</td>
                      <td>${e.merchant}</td>
                      <td>${e.category}</td>
                      <td>${formatCurrency(e.amount)}</td>
                      <td>${e.description || "-"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
                : "<p>No expenses recorded.</p>"
            }

            <h2>Budgets (${(budgets || []).length})</h2>
            ${
              (budgets || []).length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Spent</th>
                    <th>Remaining</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  ${(budgets || [])
                    .map(
                      (b) => `
                    <tr>
                      <td>${b.category}</td>
                      <td>${formatCurrency(b.amount)}</td>
                      <td>${formatCurrency(b.spent)}</td>
                      <td>${formatCurrency(b.remaining)}</td>
                      <td>${b.percentage.toFixed(1)}%</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
                : "<p>No budgets set.</p>"
            }

            <div class="footer">
              <p>Finance Bot Report • Generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();

        printWindow.onload = () => {
          printWindow.print();
        };

        toast.success("PDF export opened - use Print to save as PDF");
      } else {
        toast.error("Please allow popups to export PDF");
      }
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error(error);
    }
  };

  const handleClearAllData = async () => {
    try {
      await deleteChatHistory.mutateAsync();
      localStorage.clear();
      toast.success("All data cleared successfully. Refreshing page...");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Failed to clear data");
      console.error(error);
    }
    setShowClearDataModal(false);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Settings</h1>
        <p className="text-gray-400">Manage your preferences</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Display Preferences
          </h3>
          <div className="space-y-4">
            <SelectInput
              label="Currency"
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
              options={[
                { value: "USD", label: "USD ($)" },
                { value: "EUR", label: "EUR (€)" },
                { value: "GBP", label: "GBP (£)" },
                { value: "CAD", label: "CAD ($)" },
                { value: "AUD", label: "AUD ($)" },
              ]}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Data Management
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleExportPDF}
              className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium rounded-lg transition-colors text-left px-4 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Export Report (PDF)
            </button>
            <button
              onClick={() => setShowClearDataModal(true)}
              className="w-full py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 font-medium rounded-lg transition-colors text-left px-4 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear All Data
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">About</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <span className="font-medium text-gray-300">Version:</span> 1.0.0
            </p>
            <p>
              <span className="font-medium text-gray-300">Last Updated:</span>{" "}
              November 2025
            </p>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showClearDataModal}
        title="Clear All Data"
        message="This will permanently delete ALL your data including expenses, budgets, and chat history. This action cannot be undone. Are you absolutely sure?"
        confirmText="Delete Everything"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleClearAllData}
        onCancel={() => setShowClearDataModal(false)}
      />
    </div>
  );
};

export default Settings;
