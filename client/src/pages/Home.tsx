import { useFinanceQuery } from "../hooks/FinanceHooks";

const Home = () => {
  const { data: finances } = useFinanceQuery();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here's your financial overview.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {finances?.map((finance, index) => (
          <div
            key={finance.id || index}
            className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              {finance.name}
            </h2>
            <p className="text-sm text-gray-400">
              Created:{" "}
              {finance.createdAt instanceof Date
                ? finance.createdAt.toLocaleString()
                : new Date(finance.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      {(!finances || finances.length === 0) && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-500"
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
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            No finances yet
          </h3>
          <p className="text-gray-400">
            Start tracking your expenses to see them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
