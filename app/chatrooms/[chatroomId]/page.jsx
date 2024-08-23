"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuthState } from "@/app/utils/AuthContext";
import Spinner from "@/app/components/Spinner";
import Image from "next/image";
import { useParams } from "next/navigation";
import WithAuth from "@/app/utils/WithAuth";
import { format } from "date-fns";
import Link from "next/link";
import { IoMdMore } from "react-icons/io";

const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

const ChatRoom = () => {
  const { user } = useAuthState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const { chatroomId } = useParams();
  const [chatRoomDetails, setChatRoomDetails] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  const sendMessage = () => {
    if (socket && /^[a-zA-Z]+$/.test(newMessage)) {
      const messageData = {
        roomId: chatroomId,
        message: newMessage.trim(),
        sender: user.user._id,
      };

      setMessages(prevMessages => [
        ...prevMessages,
        {
          _id: Date.now(), // Temporary ID until the server assigns one
          message: newMessage.trim(),
          sender: {
            _id: user.user._id,
            fullName: user.user.fullName,
            avatar: user.user.avatar,
          },
          createdAt: new Date().toISOString(),
        },
      ]);

      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  const handleEditMessage = messageId => {
    if (socket) {
      socket.emit("editMessage", { messageId, roomId: chatroomId, updatedMessage: editedMessage });
      setMessages(prevMessages =>
        prevMessages.map(msg => (msg._id === messageId ? { ...msg, message: editedMessage } : msg))
      );
      setEditingMessage(null);
    }
  };

  const handleDeleteMessage = messageId => {
    if (socket) {
      socket.emit("deleteMessage", { messageId, roomId: chatroomId });
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (!event.target.closest(".message-options") && !event.target.closest(".more-options")) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user && user.token) {
      const socket = io(BACKEND_URL, {
        transports: ["websocket"],
        query: { token: user.token },
      });
      setSocket(socket);

      socket.on("connect", () => {
        socket.emit("joinRoom", chatroomId, user.user._id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      const fetchMessages = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/room/message/${chatroomId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          });
          const data = await response.json();
          setMessages(data.messages || []);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const getRoomDetails = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/room/get-room/${chatroomId}`);
          const data = await response.json();
          setChatRoomDetails(data.room);
          setInstructor(data.room.course.instructor);
        } catch (error) {
          console.error("Failed to fetch room details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      getRoomDetails();
      fetchMessages();

      socket.on("roomMessages", updatedMessages => {
        setMessages(updatedMessages);
      });

      socket.on("error", error => {
        console.error("Socket error:", error);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [chatroomId, user?.token]);

  const formatTime = date => format(new Date(date), "h:mm a");

  const handleKeyPress = e => {
    if (e.key === "Enter" && newMessage.trim()) {
      sendMessage();
    }
  };

  const isValidMessage = /^[a-zA-Z]+$/.test(newMessage);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container px-3 mx-auto pb-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <img src={chatRoomDetails.course.thumbnail} className="w-20 h-20 rounded-full object-cover" />
        </div>
        <div>
          <Link href={`/course/detail/${chatRoomDetails.course._id}`} className="text-xl font-semibold hover:underline">
            {chatRoomDetails.course.title}
          </Link>
        </div>
        <div>
          <Link href={`/instructor/profile/${instructor._id}`} className="hover:underline">
            {instructor.fullName}
            <span className="text-gray-500">(Instructor)</span>
          </Link>
        </div>

        <small className="text-xs ">{chatRoomDetails.users.length} members</small>
      </div>
      <div className="bg-gray-100 rounded-lg shadow-lg py-3">
        <div className="overflow-y-auto h-96 border-b-2 border-gray-300 pb-4 px-1.5 mb-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const messageTime = isNaN(new Date(msg.createdAt).getTime())
                ? formatTime(new Date())
                : formatTime(msg.createdAt);

              return (
                <div
                  key={index}
                  className={`relative flex items-start mb-4 ${msg.sender._id === user.user._id ? "justify-end" : ""}`}>
                  {msg.sender._id !== user.user._id && (
                    <div className="flex items-start space-x-3">
                      {msg.sender.avatar ? (
                        <Image
                          src={msg.sender.avatar}
                          alt={`${msg.sender.fullName}'s avatar`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      )}
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="font-semibold text-gray-800">{msg.sender.fullName || "Unknown Sender"}</p>
                        <p className="text-sm text-gray-700">{msg.message}</p>
                        <small className="text-xs text-gray-500">{messageTime}</small>
                      </div>
                    </div>
                  )}
                  {msg.sender._id === user.user._id && (
                    <div className="relative flex items-start mb-4">
                      {editingMessage === msg._id ? (
                        <div className="flex flex-col bg-gray-100 p-2 rounded-lg shadow-sm border border-gray-300">
                          <input
                            type="text"
                            value={editedMessage}
                            onChange={e => setEditedMessage(e.target.value)}
                            className="text-sm bg-gray-200 p-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <div className="flex space-x-2 mt-2">
                            <span
                              onClick={() => handleEditMessage(msg._id)}
                              className="text-sm text-blue-500 px-3 py-1 hover:underline hover:cursor-pointer">
                              Save
                            </span>
                            <span
                              onClick={() => setEditingMessage(null)}
                              className="text-sm text-red-500 px-3 py-1 hover:underline hover:cursor-pointer">
                              Cancel
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-2 rounded-lg shadow-sm border border-gray-300">
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      )}
                      <div className="mt-1 text-gray-400">
                        <IoMdMore
                          className="more-options cursor-pointer"
                          onClick={() => setSelectedMessage(msg._id === selectedMessage ? null : msg._id)}
                        />
                        {selectedMessage === msg._id && (
                          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 shadow-lg rounded-md py-1 w-32 z-10 message-options">
                            <button
                              onClick={() => {
                                setEditingMessage(msg._id);
                                setEditedMessage(msg.message);
                                setSelectedMessage(null);
                              }}
                              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No messages yet. Start the conversation!</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            className={`ml-2 px-4 py-2 text-white rounded-lg ${
              isValidMessage ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={sendMessage}
            disabled={!isValidMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(ChatRoom);
