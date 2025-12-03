import { useState, useMemo } from "react";
import { useBudgets } from "../hooks/BudgetHooks";
import { useExpensesQuery } from "../hooks/ExpenseHooks";

type TimePeriod = "month" | "last-month" | "3-months" | "year";

const Analytics = () => {
  const { data: budgets } = useBudgets();
  const { data: expenses } = useExpensesQuery();
  const [period, setPeriod] = useState<TimePeriod>("month");

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();

      switch (period) {
        case "month":
          return expenseMonth === currentMonth && expenseYear === currentYear;
        case "last-month": {
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear =
            currentMonth === 0 ? currentYear - 1 : currentYear;
          return expenseMonth === lastMonth && expenseYear === lastMonthYear;
        }
        case "3-months": {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return expenseDate >= threeMonthsAgo;
        }
        case "year":
          return expenseYear === currentYear;
        default:
          return true;
      }
    });
  }, [expenses, period]);

  const analytics = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategory: Record<string, { total: number; count: number }> = {};
    filteredExpenses.forEach((expense) => {
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = { total: 0, count: 0 };
      }
      byCategory[expense.category].total += expense.amount;
      byCategory[expense.category].count += 1;
    });

    const categoryBreakdown = Object.entries(byCategory)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        percentage: total > 0 ? (data.total / total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const byDate: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      const dateKey = new Date(expense.date).toLocaleDateString();
      byDate[dateKey] = (byDate[dateKey] || 0) + expense.amount;
    });

    const dailySpending = Object.entries(byDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const average =
      filteredExpenses.length > 0 ? total / filteredExpenses.length : 0;
    const topCategory = categoryBreakdown[0]?.category || "N/A";

    return {
      total,
      count: filteredExpenses.length,
      average,
      topCategory,
      categoryBreakdown,
      dailySpending,
    };
  }, [filteredExpenses]);

  const hasData =
    (expenses && expenses.length > 0) || (budgets && budgets.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Analytics</h1>
        <p className="text-gray-400">Spending trends and insights</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setPeriod("month")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === "month"
              ? "bg-gray-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setPeriod("last-month")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === "last-month"
              ? "bg-gray-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Last Month
        </button>
        <button
          onClick={() => setPeriod("3-months")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === "3-months"
              ? "bg-gray-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Last 3 Months
        </button>
        <button
          onClick={() => setPeriod("year")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === "year"
              ? "bg-gray-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          This Year
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-gray-100">
            ${analytics.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Transactions</p>
          <p className="text-2xl font-bold text-gray-100">{analytics.count}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Avg per Transaction</p>
          <p className="text-2xl font-bold text-gray-100">
            ${analytics.average.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Top Category</p>
          <p className="text-2xl font-bold text-gray-100">
            {analytics.topCategory}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Spending Over Time
          </h3>
          {analytics.dailySpending.length > 0 ? (
            <div className="space-y-2">
              {analytics.dailySpending.slice(-10).map((item, idx) => {
                const maxAmount = Math.max(
                  ...analytics.dailySpending.map((d) => d.amount)
                );
                const width = (item.amount / maxAmount) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{item.date}</span>
                      <span>${item.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-6 bg-gray-900 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
              <p className="text-gray-500">No spending data for this period</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Category Breakdown
          </h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {analytics.categoryBreakdown.map((item, idx) => {
                const colors = [
                  "bg-blue-600",
                  "bg-green-600",
                  "bg-yellow-600",
                  "bg-red-600",
                  "bg-purple-600",
                  "bg-pink-600",
                  "bg-indigo-600",
                ];
                const color = colors[idx % colors.length];

                return (
                  <div key={item.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{item.category}</span>
                      <span className="text-gray-400">
                        ${item.total.toFixed(2)} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
              <p className="text-gray-500">No category data for this period</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          AI Insights
        </h3>
        <div className="space-y-3">
          {hasData ? (
            <>
              {budgets && budgets.length > 0 && (
                <div className="flex gap-3 items-start p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-100 font-medium mb-1">
                      {budgets.length} Active{" "}
                      {budgets.length === 1 ? "Budget" : "Budgets"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {budgets.filter((b) => b.percentage >= 90).length > 0
                        ? `${
                            budgets.filter((b) => b.percentage >= 90).length
                          } budget${
                            budgets.filter((b) => b.percentage >= 90).length > 1
                              ? "s"
                              : ""
                          } near or over limit`
                        : "All budgets are on track"}
                    </p>
                  </div>
                </div>
              )}
              {expenses && expenses.length > 0 && (
                <div className="flex gap-3 items-start p-4 bg-green-900/20 border border-green-800 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-100 font-medium mb-1">
                      {expenses.length} Tracked{" "}
                      {expenses.length === 1 ? "Expense" : "Expenses"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Total: $
                      {expenses
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-3 items-start p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-gray-100 font-medium mb-1">
                  Start tracking to get insights
                </p>
                <p className="text-sm text-gray-400">
                  Add your first expense to see personalized spending analysis
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
