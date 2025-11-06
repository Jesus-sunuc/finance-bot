const ReceiptScanner = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Receipt Scanner
        </h1>
        <p className="text-gray-400">
          Upload receipts for automatic expense tracking
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 p-12 text-center hover:border-primary-500 transition-colors cursor-pointer">
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
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-200 mb-2">
          Drop Receipt Here
        </h3>
        <p className="text-gray-400 mb-4">or click to browse files</p>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
          Choose File
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          How OCR Works
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <p className="text-gray-200 font-medium">Upload Receipt Image</p>
              <p className="text-sm text-gray-400">
                Take a photo or upload from your device
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <p className="text-gray-200 font-medium">AI Extracts Data</p>
              <p className="text-sm text-gray-400">
                Computer vision reads merchant, amount, and date
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <p className="text-gray-200 font-medium">Review & Save</p>
              <p className="text-sm text-gray-400">
                Confirm details and save to your expenses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
