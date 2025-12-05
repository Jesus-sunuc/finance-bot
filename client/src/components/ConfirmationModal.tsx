import { useEffect, useState } from "react";

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category?: string;
  date?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  transaction?: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  transaction,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 z-50 ${
          isVisible ? "bg-opacity-60" : "bg-opacity-0"
        }`}
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-200 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-100">{title}</h3>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-300 mb-4">{message}</p>

            {transaction && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Amount:</span>
                    <span className="text-xl font-bold text-gray-100">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Merchant:</span>
                    <span className="text-gray-100 font-medium">
                      {transaction.merchant}
                    </span>
                  </div>
                  {transaction.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Category:</span>
                      <span className="text-gray-100">
                        {transaction.category}
                      </span>
                    </div>
                  )}
                  {transaction.date && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Date:</span>
                      <span className="text-gray-100">
                        {typeof transaction.date === "string"
                          ? transaction.date
                          : new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-900/50 rounded-b-lg flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
