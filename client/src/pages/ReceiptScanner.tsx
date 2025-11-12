import { useState } from "react";
import { useAddExpenseFromText } from "../hooks/AgentHooks";
import { useQueryClient } from "@tanstack/react-query";
import { expenseKeys } from "../hooks/ExpenseHooks";

const ReceiptScanner = () => {
  const [text, setText] = useState("");
  const addExpenseMutation = useAddExpenseFromText();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addExpenseMutation.mutateAsync({ text });
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      setText("");
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const examples = [
    "I spent $45 on groceries at Whole Foods",
    "Bought coffee for $5.50 at Starbucks this morning",
    "$120 for dinner at Italian restaurant last night",
    "Gas station fill up $60 on November 10th",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          AI Expense Parser
        </h1>
        <p className="text-gray-400">
          Describe your expense in natural language and let AI extract the
          details
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your expense
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="E.g., I spent $45 on groceries at Whole Foods"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              disabled={addExpenseMutation.isPending}
            />
          </div>

          <button
            type="submit"
            disabled={addExpenseMutation.isPending || !text.trim()}
            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addExpenseMutation.isPending
              ? "Parsing..."
              : "Parse & Add Expense"}
          </button>
        </form>

        {addExpenseMutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-400 font-medium">
              ✓ Expense added successfully!
            </p>
            {addExpenseMutation.data.reasoning && (
              <p className="text-sm text-gray-400 mt-1">
                💭 {addExpenseMutation.data.reasoning}
              </p>
            )}
          </div>
        )}

        {addExpenseMutation.isError && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 font-medium">
              ✗ Failed to parse expense
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Please try rephrasing your expense description.
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          How AI Parsing Works
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <p className="text-gray-200 font-medium">Describe Expense</p>
              <p className="text-sm text-gray-400">
                Type your expense in plain English
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <p className="text-gray-200 font-medium">AI Extracts Details</p>
              <p className="text-sm text-gray-400">
                LLM parses amount, merchant, category, and date
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <p className="text-gray-200 font-medium">Auto-Save</p>
              <p className="text-sm text-gray-400">
                Expense is validated and saved to Notion
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            Try these examples:
          </h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setText(example)}
                className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
