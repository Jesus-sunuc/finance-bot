const Budgets = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Budgets</h1>
          <p className="text-gray-400">Manage your spending limits</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
          + Create Budget
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                Food & Dining
              </h3>
              <p className="text-sm text-gray-400">Monthly budget</p>
            </div>
            <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
              On Track
            </span>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">$0 spent</span>
              <span className="text-gray-400">$0 limit</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-200 mb-2">
          Budget Management Coming Soon
        </h3>
        <p className="text-gray-400">
          Create and track spending limits by category
        </p>
      </div>
    </div>
  );
};

export default Budgets;
