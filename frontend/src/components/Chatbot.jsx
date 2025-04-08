import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

export const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { backendURL, token } = useContext(AppContext);
  const [newChat, setNewChat] = useState(true);
  const [isVisible, setIsVisible] = useState(false); // State for chat box visibility

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { text: message, sender: 'user' };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data } = await axios.post( backendURL + '/api/user/chat-bot',  { message : message } , 
        { headers: { token } }
      );

      setNewChat(false)
                                                      
      if (data.success === true) {
        // Add AI response to chat
        const aiMessage = { text: data.response, sender: 'ai' };
        setConversation(prev => [...prev, aiMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className = ''>
      <button 
        onClick={() => setIsVisible(!isVisible)} 
        className="fixed bottom-4 right-4 bg-blue-500 rounded-full p-3 text-white shadow-lg">
        {/* Ball icon can be added here */}
        Chat
      </button>
      
      {isVisible && (
        <div className="bg-cyan-200 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto fixed bottom-16 right-4">
          <button onClick={() => { setNewChat(true) ; setConversation([]); }} className="text-2xl font-bold text-orange-300 mb-4 text-center bg-primary rounded-full px-2 py-2">
            New Chat
          </button>
          
          {/* Chat conversation container */}
          <div className="mb-4 h-80 overflow-y-auto p-3 bg-green-200 rounded-lg">
            {conversation.length === 0 ? (
              <div className="text-center text-green-600 mt-10 text-xl">
                Start a conversation with the AI assistant
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div key={index} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-orange-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message input form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              className="bg-green-200 flex-1 p-3 text-gray-700 placeholder-gray-500 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim() || isLoading}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
