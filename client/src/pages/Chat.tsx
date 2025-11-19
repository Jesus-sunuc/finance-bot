import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSendMessage } from "../hooks/AgentHooks";
import BudgetSidebar from "../components/BudgetSidebar";
import type { ChatMessage } from "../models/Agent";
import type { Budget } from "../models/Budget";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [budgetSidebarOpen, setBudgetSidebarOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendMessage();
  const navigate = useNavigate();

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

    setMessages((prev) => [...prev, userMessage]);
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

      setMessages((prev) => [...prev, assistantMessage]);

      // Check for budget data and show sidebar
      if (response.action_taken === "set_budget" && response.data?.budget) {
        setCurrentBudget(response.data.budget as Budget);
        setBudgetSidebarOpen(true);
      }

      // Check if agent wants to navigate somewhere
      if (response.data?.navigate_to) {
        setTimeout(() => {
          navigate(response.data!.navigate_to as string);
        }, 1500); // Brief delay to show the message
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-8rem)]">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
          AI Chat
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Talk to your financial assistant
        </p>
      </div>

      <BudgetSidebar
        budget={currentBudget}
        isOpen={budgetSidebarOpen}
        onClose={() => setBudgetSidebarOpen(false)}
      />

      <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 p-3 md:p-6 overflow-y-auto mb-4">
        {messages.length === 0 ? (
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
          </div>
        ) : (
          <div className="space-y-4">
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
