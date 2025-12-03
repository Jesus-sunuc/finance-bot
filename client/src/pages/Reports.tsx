import { useState } from "react";
import { useGenerateReport } from "../hooks/AgentHooks";
import type { ChatResponse } from "../models/Agent";
import { useCurrency } from "../contexts/CurrencyContext";

interface ReportData {
  success: boolean;
  reportType: string;
  totalSpent: number;
  transactionCount: number;
  categoryBreakdown: Array<{
    category: string;
    total: number;
    count: number;
    percentage: number;
  }>;
  topCategory: string;
  startDate?: string;
  endDate?: string;
  navigateTo?: string;
  dailyAverage?: number;
  periodDescription?: string;
  totalCategories?: number;
  trendData?: Array<{
    date: string;
    amount: number;
  }>;
  trendDirection?: string;
}

const Reports = () => {
  const [generatedReport, setGeneratedReport] = useState<ChatResponse | null>(
    null
  );
  const generateReportMutation = useGenerateReport();
  const { formatCurrency } = useCurrency();

  const handleGenerateReport = async (reportType: string) => {
    try {
      const response = await generateReportMutation.mutateAsync({
        report_type: reportType as "monthly" | "category" | "trends",
      });
      console.log("Report response:", response);
      console.log("Report data:", response.data);
      setGeneratedReport(response);
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Reports</h1>
        <p className="text-gray-400">Analytics and spending insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            Monthly Summary
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Overview of your spending this month
          </p>
          <button
            onClick={() => handleGenerateReport("monthly")}
            disabled={generateReportMutation.isPending}
            className="text-primary-400 bg-gray-300 px-3 py-1 rounded hover:text-primary-300 text-sm font-medium disabled:opacity-50"
          >
            {generateReportMutation.isPending ? "Generating..." : "Generate →"}
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            Category Breakdown
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            See where your money goes
          </p>
          <button
            onClick={() => handleGenerateReport("category")}
            disabled={generateReportMutation.isPending}
            className="text-primary-400 bg-gray-300 px-3 py-1 rounded hover:text-primary-300 text-sm font-medium disabled:opacity-50"
          >
            {generateReportMutation.isPending ? "Generating..." : "Generate →"}
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            Trends Analysis
          </h3>
          <p className="text-sm text-gray-400 mb-4">Track spending over time</p>
          <button
            onClick={() => handleGenerateReport("trends")}
            disabled={generateReportMutation.isPending}
            className="text-primary-400 bg-gray-300 px-3 py-1 rounded  hover:text-primary-300 text-sm font-medium disabled:opacity-50"
          >
            {generateReportMutation.isPending ? "Generating..." : "Generate →"}
          </button>
        </div>
      </div>

      {generatedReport && generatedReport.data && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Generated Report
              </h3>
              <p className="text-gray-400">{generatedReport.message}</p>
            </div>
            <button
              onClick={() => setGeneratedReport(null)}
              className="text-gray-400 hover:text-gray-300"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-100">
                $
                {(generatedReport.data as unknown as ReportData).totalSpent !==
                undefined
                  ? Number(
                      (generatedReport.data as unknown as ReportData).totalSpent
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Transactions</p>
              <p className="text-2xl font-bold text-gray-100">
                {String(
                  (generatedReport.data as unknown as ReportData)
                    .transactionCount ?? 0
                )}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Top Category</p>
              <p className="text-2xl font-bold text-gray-100">
                {String(
                  (generatedReport.data as unknown as ReportData).topCategory ??
                    "N/A"
                )}
              </p>
            </div>
          </div>

          {/* Report Type Specific Information */}
          {(() => {
            const reportData = generatedReport.data as unknown as ReportData;
            const reportType = reportData.reportType;

            if (reportType === "monthly" && reportData.dailyAverage) {
              return (
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">
                    📊 Monthly Insights
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Daily Average</p>
                      <p className="text-lg font-bold text-gray-100">
                        {formatCurrency(reportData.dailyAverage)}/day
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Period</p>
                      <p className="text-lg font-bold text-gray-100">
                        {reportData.periodDescription || "This Month"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            if (reportType === "category" && reportData.totalCategories) {
              return (
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-green-300 mb-2">
                    🏷️ Category Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Total Categories</p>
                      <p className="text-lg font-bold text-gray-100">
                        {reportData.totalCategories}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Sorted By</p>
                      <p className="text-lg font-bold text-gray-100">
                        Category Name
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            if (
              reportType === "trends" &&
              reportData.trendData &&
              reportData.trendData.length > 0
            ) {
              const trendIcon =
                reportData.trendDirection === "increasing"
                  ? "📈"
                  : reportData.trendDirection === "decreasing"
                  ? "📉"
                  : "➡️";
              const trendColor =
                reportData.trendDirection === "increasing"
                  ? "text-red-300"
                  : reportData.trendDirection === "decreasing"
                  ? "text-green-300"
                  : "text-gray-300";

              return (
                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-purple-300 mb-3">
                    {trendIcon} Spending Trend (
                    {reportData.periodDescription || "Last 7 Days"})
                  </h4>
                  <div className="mb-4">
                    <p className={`text-sm font-semibold ${trendColor}`}>
                      Trend:{" "}
                      {reportData.trendDirection?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {reportData.trendData.map((day, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-400">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (day.amount /
                                    Math.max(
                                      ...reportData.trendData!.map(
                                        (d) => d.amount
                                      )
                                    )) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-200">
                          {formatCurrency(day.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })()}

          {(() => {
            const breakdown = (generatedReport.data as unknown as ReportData)
              .categoryBreakdown;
            if (!breakdown || !Array.isArray(breakdown)) return null;

            return (
              <div>
                <h4 className="text-md font-semibold text-gray-200 mb-3">
                  Category Breakdown
                </h4>
                <div className="space-y-2">
                  {(
                    breakdown as Array<{
                      category: string;
                      total: number;
                      count: number;
                      percentage: number;
                    }>
                  ).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-900 rounded-lg p-3"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-200">
                            {item.category}
                          </span>
                          <span className="text-sm text-gray-400">
                            {formatCurrency(item.total)} ({item.count} transactions)
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Reports;
