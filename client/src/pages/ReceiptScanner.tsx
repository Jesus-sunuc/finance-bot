import { useState } from "react";
import { useAddExpenseFromText } from "../hooks/AgentHooks";
import {
  useUploadReceipt,
  useUploadAndSaveReceipt,
} from "../hooks/ReceiptHooks";
import { useQueryClient } from "@tanstack/react-query";
import { expenseKeys } from "../hooks/ExpenseHooks";

interface ExtractedReceiptData {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  items?: string[];
  description: string;
  confidence: number;
}

const ReceiptScanner = () => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] =
    useState<ExtractedReceiptData | null>(null);
  const [activeTab, setActiveTab] = useState<"text" | "image">("image");

  const addExpenseMutation = useAddExpenseFromText();
  const uploadReceiptMutation = useUploadReceipt();
  const uploadAndSaveMutation = useUploadAndSaveReceipt();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setExtractedData(null);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadReceipt = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadReceiptMutation.mutateAsync(selectedFile);
      if (result.success && result.expense_data) {
        setExtractedData(result.expense_data);
      }
    } catch (error) {
      console.error("Failed to upload receipt:", error);
    }
  };

  const handleUploadAndSave = async () => {
    if (!selectedFile) return;

    try {
      await uploadAndSaveMutation.mutateAsync(selectedFile);
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });

      setSelectedFile(null);
      setPreviewUrl(null);
      setExtractedData(null);

      const fileInput = document.getElementById(
        "receipt-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Failed to upload and save receipt:", error);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
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
          Receipt Scanner & AI Parser
        </h1>
        <p className="text-gray-400">
          Upload a receipt image or describe your expense in natural language
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-2 flex gap-2">
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "image"
              ? "bg-primary-600 text-gray-100"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          📸 Receipt Upload (OCR)
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "text"
              ? "bg-primary-600 text-gray-100"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          ✍️ Text Description
        </button>
      </div>

      {activeTab === "image" && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
          <div>
            <label
              htmlFor="receipt-upload"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Upload Receipt Image
            </label>
            <input
              id="receipt-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-gray-100 hover:file:bg-primary-700 cursor-pointer"
            />
            <p className="text-sm text-gray-400 mt-2">
              Supported formats: JPG, PNG, HEIC (max 10MB)
            </p>
          </div>

          {previewUrl && (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              <img
                src={previewUrl}
                alt="Receipt preview"
                className="max-h-96 mx-auto rounded-lg"
              />
            </div>
          )}

          {selectedFile && (
            <div className="flex gap-3">
              <button
                onClick={handleUploadReceipt}
                disabled={uploadReceiptMutation.isPending}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadReceiptMutation.isPending
                  ? "Processing..."
                  : "Extract Data (Preview)"}
              </button>
              <button
                onClick={handleUploadAndSave}
                disabled={uploadAndSaveMutation.isPending}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadAndSaveMutation.isPending
                  ? "Saving..."
                  : "Extract & Save Expense"}
              </button>
            </div>
          )}

          {extractedData && (
            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg space-y-2">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">
                ✓ Extracted Data
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Merchant:</span>
                  <p className="text-gray-100 font-medium">
                    {extractedData.merchant}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Amount:</span>
                  <p className="text-gray-100 font-medium">
                    ${extractedData.amount?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <p className="text-gray-100 font-medium">
                    {extractedData.category}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Date:</span>
                  <p className="text-gray-100 font-medium">
                    {extractedData.date}
                  </p>
                </div>
                {extractedData.items && extractedData.items.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-gray-400">Items:</span>
                    <p className="text-gray-100">
                      {extractedData.items.join(", ")}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-gray-400">Confidence:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(extractedData.confidence || 0) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-100 font-medium">
                      {((extractedData.confidence || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              📋 How OCR Works
            </h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>Upload a clear photo of your receipt</li>
              <li>AI vision model (Gemma3-27b) reads the text</li>
              <li>Extracts merchant, amount, date, and items</li>
              <li>Preview data or save directly to Notion</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "text" && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <form onSubmit={handleTextSubmit} className="space-y-4">
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
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      )}

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          How AI Expense Extraction Works
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-gray-100 text-sm font-bold">
                1
              </div>
              <div>
                <p className="text-gray-200 font-medium">Upload or Describe</p>
                <p className="text-sm text-gray-400">
                  Take a photo of your receipt or describe the expense in plain
                  English
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-gray-100 text-sm font-bold">
                2
              </div>
              <div>
                <p className="text-gray-200 font-medium">AI Extracts Details</p>
                <p className="text-sm text-gray-400">
                  Vision model reads the receipt or LLM parses text for amount,
                  merchant, category, date
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-gray-100 text-sm font-bold">
                3
              </div>
              <div>
                <p className="text-gray-200 font-medium">Validate & Save</p>
                <p className="text-sm text-gray-400">
                  Preview extracted data or save directly to your Notion
                  database
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-gray-100 text-sm font-bold">
                4
              </div>
              <div>
                <p className="text-gray-200 font-medium">Track & Analyze</p>
                <p className="text-sm text-gray-400">
                  View your expenses in the dashboard and generate insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
