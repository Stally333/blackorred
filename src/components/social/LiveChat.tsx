'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  walletAddress: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate some initial messages
  useEffect(() => {
    const demoMessages: ChatMessage[] = [
      { id: '1', user: 'Player1', message: 'gl everyone! 🎰', timestamp: new Date(), walletAddress: '0x1234...5678' },
      { id: '2', user: 'CryptoWhale', message: 'Just won 100 SOL! 🎉', timestamp: new Date(), walletAddress: '0x8765...4321' },
    ];
    setMessages(demoMessages);
  }, []);

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date(),
      walletAddress: '0x1234...5678'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <>
      {/* Chat Icon Button */}
      <motion.button
        className="fixed right-6 bottom-6 p-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg hover:shadow-xl transition-all z-30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0);
        }}
      >
        <div className="relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-6 bottom-20 w-80 h-[500px] bg-gradient-to-b from-zinc-900/95 to-black/95 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl z-30"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-bold">Live Chat</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">{msg.user}</span>
                        <span className="text-white/40 text-xs">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white/80 mt-1 text-sm">{msg.message}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 