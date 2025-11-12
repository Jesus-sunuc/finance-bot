import { useBudgets } from "../hooks/BudgetHooks";
import { useExpensesQuery } from "../hooks/ExpenseHooks";
import { useMemo } from "react";

const Dashboard = () => {
  const { data: budgets } = useBudgets();
  const { data: expenses } = useExpensesQuery();

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses =
      expenses?.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      }) || [];

    const totalSpent = monthlyExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const transactionCount = monthlyExpenses.length;

    const totalBudget =
      budgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
    const totalBudgetSpent =
      budgets?.reduce((sum, budget) => sum + budget.spent, 0) || 0;
    const budgetRemaining = totalBudget - totalBudgetSpent;

    return {
      totalSpent,
      budgetRemaining,
      transactionCount,
      totalBudget,
    };
  }, [expenses, budgets]);

  const topBudgets = useMemo(() => {
    if (!budgets) return [];
    return [...budgets].sort((a, b) => b.amount - a.amount).slice(0, 3);
  }, [budgets]);

  const getProgressColor = (percentage: number): string => {
    if (percentage < 70) return "bg-green-500";
    if (percentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = (percentage: number): string => {
    if (percentage < 70) return "text-green-400";
    if (percentage < 90) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Spent</h3>
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-100">
            ${stats.totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Budget Left</h3>
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
          <p
            className={`text-3xl font-bold ${
              stats.budgetRemaining >= 0 ? "text-gray-100" : "text-red-400"
            }`}
          >
            ${Math.abs(stats.budgetRemaining).toFixed(2)}
            {stats.budgetRemaining < 0 && " over"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalBudget > 0 ? "Available" : "No budget set"}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Transactions</h3>
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-100">
            {stats.transactionCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Budget</h3>
            <svg
              className="w-5 h-5 text-purple-400"
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
          <p className="text-3xl font-bold text-gray-100">
            ${stats.totalBudget.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {budgets?.length || 0} budgets
          </p>
        </div>
      </div>

      {/* Budget Progress Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">Budget Overview</h2>
          <span className="text-sm text-gray-400">
            {budgets?.length || 0} active budgets
          </span>
        </div>

        {!budgets || budgets.length === 0 ? (
          <div className="text-center py-8">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              No Budgets Yet
            </h3>
            <p className="text-gray-400">
              Set your first budget by chatting with the AI: "Set my dining
              budget to $400 this month"
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topBudgets.map((budget) => (
              <div
                key={budget.id}
                className="bg-gray-700 rounded-lg p-5 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-100">
                    {budget.category}
                  </h3>
                  <span className="text-xs text-gray-400 capitalize">
                    {budget.period}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Budget:</span>
                    <span className="font-medium text-gray-200">
                      ${budget.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Spent:</span>
                    <span className="font-medium text-gray-200">
                      ${budget.spent.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining:</span>
                    <span
                      className={`font-medium ${
                        budget.remaining >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      ${Math.abs(budget.remaining).toFixed(2)}
                      {budget.remaining < 0 && " over"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span
                      className={`text-xs font-semibold ${getTextColor(
                        budget.percentage
                      )}`}
                    >
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                        budget.percentage
                      )}`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
