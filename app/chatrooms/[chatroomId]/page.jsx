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

  const sendMessage = () => {
    if (socket && /^[a-zA-Z]+$/.test(newMessage)) {
      const messageData = {
        roomId: chatroomId,
        message: newMessage.trim(),
        sender: user.user._id,
      };

      // Update local state immediately
      setMessages(prevMessages => [
        ...prevMessages,
        {
          message: newMessage.trim(),
          sender: {
            _id: user.user._id,
            fullName: user.user.fullName,
            avatar: user.user.avatar,
          },
          createdAt: new Date().toISOString(), // Set the current time
        },
      ]);

      // Emit the message to the server
      socket.emit("sendMessage", messageData);

      // Clear the input field
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (user && user.token) {
      const socket = io(BACKEND_URL, {
        transports: ["websocket"],
        query: { token: user.token },
      });
      setSocket(socket);

      socket.on("connect", () => {
        console.log("Socket connected");
        socket.emit("joinRoom", chatroomId, user.user._id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Fetch initial messages
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

      // Listen for incoming messages
      socket.on("roomMessages", updatedMessages => {
        setMessages(updatedMessages);
      });

      // Handle socket errors
      socket.on("error", error => {
        console.error("Socket error:", error);
      });

      // Clean up the socket connection on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [chatroomId, user?.token]);

  const formatTime = date => {
    return format(new Date(date), "h:mm a");
  };

  const isValidMessage = /^[a-zA-Z]+$/.test(newMessage);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-6 pb-6">
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
      <div className="bg-gray-100 rounded-lg shadow-lg p-6">
        <div className="overflow-y-auto h-96 border-b-2 border-gray-300 pb-4 px-1.5 mb-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const messageTime = isNaN(new Date(msg.createdAt).getTime())
                ? formatTime(new Date())
                : formatTime(msg.createdAt);

              return (
                <div
                  key={index}
                  className={`flex items-start mb-4 ${msg.sender._id === user.user._id ? "justify-end" : ""}`}>
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
                    <div className="flex flex-col items-end space-y-1">
                      <div className="bg-blue-500 text-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <small className="text-xs text-gray-500">{messageTime}</small>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No messages yet</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button
            className={`p-3 rounded-lg ${
              isValidMessage ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
