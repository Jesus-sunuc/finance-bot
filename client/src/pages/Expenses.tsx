import { useState } from "react";
import {
  useExpensesQuery,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
} from "../hooks/ExpenseHooks";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "../models/Expense";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import toast from "react-hot-toast";
import { useCurrency } from "../contexts/CurrencyContext";
import TextInput from "../components/ui/TextInput";
import NumberInput from "../components/ui/NumberInput";
import SelectInput from "../components/ui/SelectInput";
import DateInput from "../components/ui/DateInput";

const Expenses = () => {
  const { data: expenses } = useExpensesQuery();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const { formatCurrency } = useCurrency();
  const deleteExpense = useDeleteExpense();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExpenseCreate>({
    amount: 0,
    category: "",
    merchant: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const resetForm = () => {
    setFormData({
      amount: 0,
      category: "",
      merchant: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateExpense.mutateAsync({
          id: editingId,
          data: formData as ExpenseUpdate,
        });
        toast.success("Expense updated successfully!");
      } else {
        await createExpense.mutateAsync(formData);
        toast.success("Expense created successfully!");
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save expense"
      );
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      merchant: expense.merchant,
      date: expense.date.toISOString().split("T")[0],
      description: expense.description,
    });
    setEditingId(expense.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteExpense.mutateAsync(deleteTargetId);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete expense"
        );
      }
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Other",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
            Expenses
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Track all your transactions
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-3 py-2 text-gray-200 bg-gray-600 rounded-2xl cursor-pointer"
        >
          <span className="hidden sm:inline">+ Add Expense</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      <div className="hidden md:block bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {expenses.length === 0 ? (
          <div className="text-center py-16">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              No Expenses Yet
            </h3>
            <p className="text-gray-400">
              Start tracking by adding your first expense
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {expense.date.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    {expense.merchant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full text-gray-100">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {expense.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-100">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      style={{ cursor: "pointer" }}
                      className="bg-gray-200 text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      style={{ cursor: "pointer" }}
                      className="bg-red-900/30 text-red-400 hover:bg-red-900/50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {expenses.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <svg
              className="w-12 h-12 text-gray-600 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              No Expenses Yet
            </h3>
            <p className="text-gray-400 text-sm">
              Start tracking by adding your first expense
            </p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-100 text-lg">
                    {expense.merchant}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {expense.date.toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-100">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-gray-200 font-medium">
                    {expense.category}
                  </span>
                </div>
                {expense.description && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Description:</span>
                    <span className="text-gray-200 text-right flex-1 ml-2">
                      {expense.description}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-700">
                <button
                  onClick={() => handleEdit(expense)}
                  className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-100 px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="flex-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">
              {editingId ? "Edit Expense" : "Add Expense"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Merchant"
                value={formData.merchant}
                onChange={(e) =>
                  setFormData({ ...formData, merchant: e.target.value })
                }
                required
              />

              <NumberInput
                label="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                prefix="$"
                step="0.01"
                required
              />

              <SelectInput
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                options={[
                  { value: "", label: "Select category" },
                  ...categories.map((cat) => ({ value: cat, label: cat })),
                ]}
                required
              />

              <DateInput
                label="Date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
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
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium rounded-lg transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

export default Expenses;
