import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSendMessage, useDeleteTransaction } from "../hooks/AgentHooks";
import { useChatMessages, useDeleteChatHistory } from "../hooks/ChatHooks";
import BudgetSidebar from "../components/BudgetSidebar";
import ConfirmationModal, {
  type Transaction,
} from "../components/ConfirmationModal";
import type { ChatMessage } from "../models/Agent";
import type { Budget } from "../models/Budget";
import toast from "react-hot-toast";

const Chat = () => {
  const [message, setMessage] = useState("");
  const { data: savedMessages = [], isLoading, error } = useChatMessages();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [budgetSidebarOpen, setBudgetSidebarOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<{
    query: string;
    transaction: Transaction | null;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendMessage();
  const deleteTransactionMutation = useDeleteTransaction();
  const deleteChatHistory = useDeleteChatHistory();
  const navigate = useNavigate();

  const messages = useMemo(
    () => [...savedMessages, ...localMessages],
    [savedMessages, localMessages]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: currentMessage,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
        reasoning: response.reasoning,
      };

      setLocalMessages((prev) => [...prev, assistantMessage]);

      if (
        response.actionTaken === "delete_transaction" &&
        response.data?.needsConfirmation &&
        response.data?.transactionToDelete
      ) {
        setPendingDeletion({
          query: currentMessage,
          transaction: response.data.transactionToDelete as Transaction,
        });
        setConfirmationModalOpen(true);
      }

      if (response.actionTaken === "set_budget" && response.data?.budget) {
        setCurrentBudget(response.data.budget as Budget);
        setBudgetSidebarOpen(true);
      }

      if (response.data?.navigate_to) {
        setTimeout(() => {
          navigate(response.data!.navigate_to as string);
        }, 1500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleConfirmDeletion = async () => {
    if (!pendingDeletion) return;

    try {
      const response = await deleteTransactionMutation.mutateAsync({
        query: pendingDeletion.query,
        confirmed: true,
        transaction_id: pendingDeletion.transaction?.id,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
        reasoning: response.reasoning,
      };

      setLocalMessages((prev) => [...prev, assistantMessage]);
      toast.success("Transaction deleted successfully");
      setConfirmationModalOpen(false);
      setPendingDeletion(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
      setConfirmationModalOpen(false);
      setPendingDeletion(null);
    }
  };

  const handleCancelDeletion = () => {
    setConfirmationModalOpen(false);
    setPendingDeletion(null);
  };

  const clearHistory = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all chat history? This cannot be undone."
      )
    ) {
      try {
        await deleteChatHistory.mutateAsync();
        setLocalMessages([]);
        toast.success("Chat history cleared successfully");
      } catch (error) {
        console.error("Error clearing chat history:", error);
        toast.error("Failed to clear chat history");
      }
    }
  };

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-8rem)]">
      <div className="mb-4 md:mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
            AI Chat
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Talk to your financial assistant
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
            title="Clear chat history"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:inline">Clear History</span>
          </button>
        )}
      </div>

      <BudgetSidebar
        budget={currentBudget}
        isOpen={budgetSidebarOpen}
        onClose={() => setBudgetSidebarOpen(false)}
      />

      <ConfirmationModal
        isOpen={confirmationModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        transaction={pendingDeletion?.transaction || undefined}
        onConfirm={handleConfirmDeletion}
        onCancel={handleCancelDeletion}
      />

      <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 p-3 md:p-6 overflow-y-auto mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-primary-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading chat history...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-red-400 mb-2">
                Error Loading Chat History
              </h3>
              <p className="text-gray-400 max-w-md text-sm">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Check browser console for details
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg
              className="w-16 h-16 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-400 max-w-md">
              Try: "I spent $45 on groceries" or "Show me my budget"
            </p>
            <p className="text-xs text-gray-500 mt-4">
              💡 Your chat history will be saved automatically
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length > 0 && (
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                  {messages.length} message{messages.length !== 1 ? "s" : ""} in
                  history
                </span>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.reasoning && (
                    <p className="text-xs mt-2 opacity-70 italic border-t border-gray-600 pt-2">
                      💭 {msg.reasoning}
                    </p>
                  )}
                  {msg.timestamp && (
                    <p className="text-xs mt-1 opacity-50">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={sendMessageMutation.isPending}
          className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 text-sm md:text-base"
        />
        <button
          onClick={sendMessage}
          disabled={sendMessageMutation.isPending || !message.trim()}
          className="px-4 md:px-6 py-2.5 md:py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base min-w-[70px] md:min-w-20"
        >
          {sendMessageMutation.isPending ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
