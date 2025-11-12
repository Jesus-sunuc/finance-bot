import { useAgentDecisions } from "../hooks/AgentHooks";

const Admin = () => {
  const { data: decisions = [], isLoading } = useAgentDecisions(50);

  // Calculate statistics
  const totalRequests = decisions.length;
  const successfulRequests = decisions.filter(
    (d: { action_taken?: string }) =>
      d.action_taken && d.action_taken !== "error"
  ).length;
  const successRate =
    totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
  const errors = decisions.filter(
    (d: { action_taken?: string }) => d.action_taken === "error"
  ).length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Admin Panel</h1>
        <p className="text-gray-400">Agent logs and system monitoring</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-gray-100">{totalRequests}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-green-400">
            {successRate.toFixed(0)}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Successful</p>
          <p className="text-2xl font-bold text-blue-400">
            {successfulRequests}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Errors</p>
          <p className="text-2xl font-bold text-red-400">{errors}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">
            Agent Decision Logs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Function
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Input
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Loading agent logs...
                  </td>
                </tr>
              ) : decisions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No agent logs yet
                  </td>
                </tr>
              ) : (
                decisions.map(
                  (
                    decision: {
                      id?: number;
                      created_at?: string;
                      action_taken?: string;
                      user_message?: string;
                      llm_reasoning?: string;
                    },
                    idx: number
                  ) => (
                    <tr key={decision.id || idx} className="hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {decision.created_at
                          ? new Date(decision.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            decision.action_taken === "error"
                              ? "bg-red-900/30 text-red-400"
                              : decision.action_taken === "add_expense"
                              ? "bg-green-900/30 text-green-400"
                              : decision.action_taken === "delete_transaction"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : decision.action_taken === "generate_report"
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {decision.action_taken || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-md truncate">
                        {decision.user_message || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`${
                            decision.action_taken === "error"
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {decision.action_taken === "error"
                            ? "Failed"
                            : "Success"}
                        </span>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
