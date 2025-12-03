import { useState, useMemo } from "react";
import {
  useBudgets,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from "../hooks/BudgetHooks";
import { useExpensesQuery } from "../hooks/ExpenseHooks";
import type { BudgetCreate } from "../models/Budget";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { useCurrency } from "../contexts/CurrencyContext";

const Budgets = () => {
  const { data: budgets, isLoading } = useBudgets();
  const { data: expenses } = useExpensesQuery();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const { formatCurrency } = useCurrency();

  const budgetsWithActualSpending = useMemo(() => {
    if (!budgets || !expenses) return budgets || [];

    return budgets.map((budget) => {
      const budgetStartDate = new Date(budget.startDate);
      const budgetMonth = budgetStartDate.getMonth();
      const budgetYear = budgetStartDate.getFullYear();

      const categoryExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const isSameMonth =
          expenseDate.getMonth() === budgetMonth &&
          expenseDate.getFullYear() === budgetYear;
        const isSameCategory =
          expense.category.toLowerCase() === budget.category.toLowerCase();
        return isSameMonth && isSameCategory;
      });

      const actualSpent = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const remaining = budget.amount - actualSpent;
      const percentage = budget.amount > 0 ? (actualSpent / budget.amount) * 100 : 0;

      return {
        ...budget,
        spent: actualSpent,
        remaining,
        percentage,
      };
    });
  }, [budgets, expenses]);

  const budgetsByMonth = useMemo(() => {
    if (!budgetsWithActualSpending) return {};

    const grouped: Record<string, typeof budgetsWithActualSpending> = {};

    budgetsWithActualSpending.forEach((budget) => {
      const date = new Date(budget.startDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(budget);
    });

    return grouped;
  }, [budgetsWithActualSpending]);

  const sortedMonthKeys = useMemo(() => {
    return Object.keys(budgetsByMonth).sort((a, b) => b.localeCompare(a));
  }, [budgetsByMonth]);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BudgetCreate>({
    category: "",
    amount: 0,
    period: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });

  const resetForm = () => {
    setFormData({
      category: "",
      amount: 0,
      period: "monthly",
      startDate: new Date().toISOString().split("T")[0],
    });
    setIsEditMode(false);
    setEditingBudgetId(null);
  };

  const handleEdit = (budgetId: string) => {
    const budget = budgetsWithActualSpending?.find((b) => b.id === budgetId);
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount,
        period: budget.period,
        startDate: new Date(budget.startDate).toISOString().split("T")[0],
      });
      setIsEditMode(true);
      setEditingBudgetId(budgetId);
      setShowModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || formData.amount <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isEditMode && editingBudgetId) {
        await updateBudget.mutateAsync({
          id: editingBudgetId,
          updates: formData,
        });
        toast.success("Budget updated successfully!");
      } else {
        await createBudget.mutateAsync(formData);
        toast.success("Budget created successfully!");
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? "update" : "create"} budget`
      );
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteBudget.mutateAsync(deleteTargetId);
        toast.success("Budget deleted successfully!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete budget"
        );
      }
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage < 70) return "bg-green-500";
    if (percentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage < 70) {
      return (
        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
          On Track
        </span>
      );
    } else if (percentage < 90) {
      return (
        <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full">
          Near Limit
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full">
          Over Budget
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Budgets</h1>
          <p className="text-gray-400">Manage your spending limits</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gray-600 text-gray-200 rounded-2xl hover:bg-gray-700 transition-colors cursor-pointer"
        >
          + Create Budget
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-gray-100 mb-4">
              {isEditMode ? "Edit Budget" : "Create Budget"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Dining, Transportation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        period: e.target.value as
                          | "monthly"
                          | "weekly"
                          | "yearly",
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBudget.isPending || updateBudget.isPending}
                  className="flex-1 px-4 py-2 text-gray-200 bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditMode
                    ? updateBudget.isPending
                      ? "Updating..."
                      : "Update"
                    : createBudget.isPending
                      ? "Creating..."
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        variant="danger"
      />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading budgets...</p>
        </div>
      ) : !budgetsWithActualSpending || budgetsWithActualSpending.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
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
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            No Budgets Yet
          </h3>
          <p className="text-gray-400 mb-4">
            Create your first budget or use AI: "Set my dining budget to $400
            this month"
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Create Budget
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedMonthKeys.map((monthKey) => {
            const monthBudgets = budgetsByMonth[monthKey];
            const [year, month] = monthKey.split("-");
            const monthDate = new Date(parseInt(year), parseInt(month) - 1);
            const monthLabel = monthDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            });

            return (
              <div key={monthKey}>
                {/* Month Header */}
                <h2 className="text-xl font-bold text-gray-100 mb-4">
                  {monthLabel}
                </h2>

                {/* Budget Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {monthBudgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {budget.category}
                  </h3>
                  <p className="text-sm text-gray-400 capitalize">
                    {new Date(budget.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    • {budget.period}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(budget.percentage)}
                  <button
                    onClick={() => handleEdit(budget.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    aria-label="Edit budget"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Delete budget"
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
                  </button>
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Spent:</span>
                  <span className="text-gray-200 font-medium">
                    {formatCurrency(budget.spent)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Limit:</span>
                  <span className="text-gray-200 font-medium">
                    {formatCurrency(budget.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Remaining:</span>
                  <span
                    className={`font-medium ${
                      budget.remaining >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatCurrency(Math.abs(budget.remaining))}
                    {budget.remaining < 0 && " over"}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-300 font-medium">
                    {(budget.percentage || 0).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                      budget.percentage || 0
                    )}`}
                    style={{
                      width: `${Math.min(budget.percentage || 0, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Budgets;
