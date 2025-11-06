const Reports = () => {
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
          <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            Generate →
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
          <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            Generate →
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
          <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            Generate →
          </button>
        </div>
      </div>

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
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-200 mb-2">
          AI-Powered Reports Coming Soon
        </h3>
        <p className="text-gray-400">
          Generate detailed PDFs and get spending insights
        </p>
      </div>
    </div>
  );
};

export default Reports;
