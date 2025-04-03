import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI Crop Assistant.", 
      sender: "bot" 
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("https://ai-based-crop-disease.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Server error!");

      const data = await response.json();
      setIsTyping(false);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            text: data.reply || "Not answer plese ", 
            sender: "bot" 
          },
        ]);
      }, 800);
      
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { 
          text: "  Connection error. try again.", 
          sender: "bot" 
        },
      ]);
    }
  };

  const handlePress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed   bg-white rounded-xl  right-5 w-96 shadow-2xl max-w-[90vw] border border-gray-200 overflow-hidden z-50 bottom-20"
      style={{
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
    
      <div className="flex   items-center  bg-gradient-to-r text-white justify-between from-green-600 p-4 to-green-800  ">
        <div className="flex   items-center space-x-2">
          <div className="p-2  bg-opacity-20 rounded-full bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className=" font-semibold text-lg">Crop Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1  hover:bg-white transition rounded-full hover:bg-opacity-20 "
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      
      <div className="h-80 p-4 overflow-y-auto   bg-gray-50 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex space-x-1 px-4 py-2"
          >
            <div className="w-2 h-2 bg-gray-400 animate-bounce  rounded-full" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

     
      <div className="p-3  border-gray-200 border-t bg-white">
        <div className="flex  space-x-2 items-center">
          <input
            type="text"
            className="flex-1 border  p-3 rounded-xl text-gray-800 focus:outline-none  focus:ring-green-500 border-gray-300 focus:border-transparent transition duration-200  placeholder-gray-400 focus:ring-2"
            placeholder="Ask about crops, diseases..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handlePress}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={input.trim() === ""}
            className={`p-3 rounded-xl ${
              input.trim() === ""
                ? "bg-gray-200 text-gray-400"
                : "bg-green-600 text-white hover:bg-green-700"
            } transition duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Ask about plant diseases, or crop management
        </p>
      </div>
    </motion.div>
  );
};

export default ChatPopup;
