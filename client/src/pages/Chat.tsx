import { useState } from "react";

const Chat = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">AI Chat</h1>
        <p className="text-gray-400">Talk to your financial assistant</p>
      </div>

      <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 p-6 overflow-y-auto mb-4">
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
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
