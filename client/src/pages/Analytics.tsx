const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Analytics</h1>
        <p className="text-gray-400">Spending trends and insights</p>
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          This Month
        </button>
        <button className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-medium transition-colors">
          Last Month
        </button>
        <button className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-medium transition-colors">
          Last 3 Months
        </button>
        <button className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-medium transition-colors">
          This Year
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Spending Over Time
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
            <p className="text-gray-500">Line chart coming soon</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Category Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-900 rounded-lg">
            <p className="text-gray-500">Pie chart coming soon</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          AI Insights
        </h3>
        <div className="space-y-3">
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
        </div>
      </div>
    </div>
  );
};

export default Analytics;
