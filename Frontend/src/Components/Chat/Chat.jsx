import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPaperPlane,
  FaUserMd,
  FaUser,
  FaEllipsisV,
  FaCalendarAlt,
} from "react-icons/fa";
import { Socket } from "socket.io-client";
import { GetSocket } from "../../socket";

function Chat() {
  const { user } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const socket = GetSocket();

  const newMessageListener = (message) => {
    "newMessage", message;
    "selectedConversation", selectedConversation;
    if (message.conversationId === selectedConversation?._id) {
      setMessages((prevMessages) => [...prevMessages, message?.message]);
    }
  };

  // Fetch user's conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    socket.on("newMessage", newMessageListener);
    return () => {
      socket.off("newMessage", newMessageListener);
    };
  });

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setConversationsLoading(true);

      // TEMPORARY: Use sample data until API is connected
      // setConversations(sampleConversations);
      // if (sampleConversations.length > 0 && !selectedConversation) {
      //   setSelectedConversation(sampleConversations[0]);
      // }

      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}api/conversations/my`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setConversations(data.conversation);
        // Auto-select the first conversation if none is selected
        if (data.conversation.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversation[0]);
        }
      } else {
        toast.error(data.message || "Failed to fetch conversations");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching conversations");
    } finally {
      setConversationsLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);

      // TEMPORARY: Use sample data until API is connected
      // setMessages(sampleMessages[conversationId] || []);

      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}api/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    // Create a temporary message ID
    socket.emit("sendMessage", {
      conversationId: selectedConversation?._id,
      members: [selectedConversation?.members, user?._id],
      message: newMessage,
    });
    setNewMessage("");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getConversationName = (conversation) => {
    if (!conversation) return "";

    const otherPerson = conversation.name;

    return user?.role === "user" ? `Dr. ${otherPerson}` : otherPerson;
  };

  const renderConversationList = () => (
    <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 h-[85vh]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <p className="text-sm text-gray-500">Your doctor conversations</p>
      </div>

      {conversationsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 mb-4">No conversations yet</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <FaCalendarAlt className="inline mr-2" />
            View your appointments
          </button>
        </div>
      ) : (
        <div className="overflow-y-auto h-[calc(80vh-80px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                selectedConversation?._id === conversation._id
                  ? "bg-blue-50"
                  : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  {user?.role === "doctor" ? (
                    <FaUserMd className="text-blue-600 text-xl" />
                  ) : (
                    <FaUser className="text-blue-600 text-xl" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate">
                      {getConversationName(conversation)}
                    </h3>
                    {/* <span className="text-xs text-gray-500">
                      {conversation.lastMessage
                        ? formatDate(conversation.lastMessage.createdAt)
                        : ""}
                    </span> */}
                  </div>
                  {/* <p className="text-sm text-gray-500 truncate">
                    {getLastMessage(conversation)}
                  </p> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderChatWindow = () => (
    <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col h-[85vh]">
      {selectedConversation ? (
        <>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                {user?.role === "user" ? (
                  <FaUserMd className="text-blue-600" />
                ) : (
                  <FaUser className="text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {getConversationName(selectedConversation)}
                </h3>
                <p className="text-xs text-gray-500">
                  {user?.role === "user" ? "Doctor" : "Patient"}
                </p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <FaEllipsisV />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
            style={{ height: "calc(80vh - 160px)" }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-10 h-10 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start the conversation by sending a message
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const isSender = message.senderId._id === user?._id; // Fallback for sample data
                  const showDate =
                    index === 0 ||
                    new Date(message.createdAt).toDateString() !==
                      new Date(messages[index - 1].createdAt).toDateString();

                  return (
                    <div key={message._id}>
                      {showDate && (
                        <div className="text-center my-4">
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg px-4 py-2 ${
                            isSender
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{message?.message}</p>
                          <p
                            className={`text-xs mt-1 text-right ${
                              isSender ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-gray-200 bg-white"
          >
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg py-2 px-4 transition-colors"
                disabled={!newMessage.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPaperPlane className="text-blue-500 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your Messages
            </h3>
            <p className="text-gray-500 mb-6">
              Select a conversation to view messages
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              onClick={() => (window.location.href = "/userdashboard")}
            >
              <FaCalendarAlt className="inline mr-2" />
              View your appointments
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 h-[92vh] p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {renderConversationList()}
        {renderChatWindow()}
      </div>
    </div>
  );
}

export default Chat;
