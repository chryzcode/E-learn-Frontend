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
import { useRef } from "react";
import { toast } from "react-toastify";
import { fetchClient } from "@/app/utils/FetchClient";

const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

const ChatRoom = () => {
  const { user } = useAuthState();
  const userPopupRef = useRef(null);
  const messagePopupRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const { chatroomId } = useParams();
  const [chatRoomDetails, setChatRoomDetails] = useState(null);
  const [roomMembersCount, setRoomMembersCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [visibleUserPopups, setVisibleUserPopups] = useState(new Set()); // Track visible popups by user ID
  const [courseId, setCourseId] = useState(null);
  const [roomUsersId, setRoomUsersId] = useState([]);
  const [inviteeStudents, setInviteeStudents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (socket) {
      // Join the room when the component mounts
      socket.emit("joinRoom", courseId, user.user._id);

      // Listen for new messages
      socket.on("newMessage", newMessage => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      });

      // Listen for updated messages
      socket.on("updatedMessage", updatedMessage => {
        setMessages(prevMessages => prevMessages.map(msg => (msg._id === updatedMessage._id ? updatedMessage : msg)));
      });

      // Listen for deleted messages
      socket.on("messageDeleted", deletedMessageId => {
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== deletedMessageId));
      });

      // Listen for user removal
      socket.on("userRemoved", removedUserId => {
        setRoomUsersId(prevIds => prevIds.filter(id => id !== removedUserId));
        setInviteeStudents(prevStudents => [...prevStudents, removedUserId]);
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off("newMessage");
        socket.off("updatedMessage");
        socket.off("messageDeleted");
        socket.off("userRemoved");
      };
    }
  }, [socket, courseId, user.user._id]);

  useEffect(() => {
    if (user && user.token) {
      const socket = io(BACKEND_URL, {
        transports: ["websocket"],
        query: { token: user.token },
      });
      setSocket(socket);

      socket.on("connect", () => {
        socket.emit("joinRoom", courseId, user.user._id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      const getRoomDetails = async () => {
        try {
          const response = await fetchClient(`${BACKEND_URL}/room/get-room/${chatroomId}`);
          const data = await response.json();
          setChatRoomDetails(data.room);
          setRoomUsersId(data.room.users);
          setRoomMembersCount(data.room.users.length);
          setInstructor(data.room.course.instructor);
          setCourseId(data.room.course._id);
        } catch (error) {
          console.error("Failed to fetch room details:", error);
        } finally {
          setIsLoading(false);
        }
      };

      getRoomDetails();
      console.log(roomUsersId);

      socket.on("userRemoved", removedUserId => {
        setMessages(prevMessages => prevMessages.filter(msg => msg.sender._id !== removedUserId));

        // Update roomUsersId to remove the user
        setRoomUsersId(prevIds => prevIds.filter(id => id !== removedUserId));

        // Optionally, add the user back to inviteeStudents
        setInviteeStudents(prevStudents => [...prevStudents, removedUserId]);
      });

      socket.on("error", error => {
        console.error("Socket error:", error);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (socket) {
      // Get initial room messages
      socket.emit("getRoomMessages", chatroomId);

      // Listen for initial room messages
      socket.on("roomMessages", updatedMessages => {
        console.log("Received roomMessages:", updatedMessages);
        setMessages(updatedMessages);
      });

      // Cleanup listeners on unmount or when chatroomId changes
      return () => {
        socket.off("roomMessages");
      };
    }
  }, [socket, chatroomId]);

  useEffect(() => {
    const handleClickOutside = (ref, callback) => {
      const handleClick = event => {
        if (!ref.current || !ref.current.contains(event.target)) {
          callback();
        }
      };

      document.addEventListener("mousedown", handleClick);

      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    };

    handleClickOutside(userPopupRef, () => setVisibleUserPopups(new Set()));
    handleClickOutside(messagePopupRef, () => setSelectedMessage(null));
    handleClickOutside(dropdownRef, () => setIsDropdownOpen(false)); // Add this line
  }, []);

  const formatTime = date => format(new Date(date), "h:mm a");

  const handleKeyPress = e => {
    if (e.key === "Enter" && newMessage.trim()) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      const messageData = {
        roomId: chatroomId,
        message: newMessage.trim(),
        sender: user.user._id,
      };

      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  const handleEditMessage = messageId => {
    if (socket) {
      socket.emit("editMessage", { messageId, roomId: chatroomId, updatedMessage: editedMessage });
      setMessages(prevMessages =>
        prevMessages.map(msg => (msg._id === messageId ? { ...msg, message: editedMessage, edited: true } : msg))
      );
      // Close the editing popup after saving
      setEditingMessage(null);
      setSelectedMessage(null);
    }
  };

  const handleDeleteMessage = messageId => {
    if (socket) {
      socket.emit("deleteMessage", { messageId, roomId: chatroomId });
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
    }
  };

  const handleKickUser = userId => {
    if (socket) {
      socket.emit("removeUser", userId, chatroomId);
      setSelectedUser(null);

      // Update roomMembersCount after removing the user
      toast.success("User removed successfully");
      setRoomMembersCount(prevCount => prevCount - 1);

      // Remove the user from roomUsersId
      setRoomUsersId(prevIds => prevIds.filter(id => id !== userId));

      // Add the removed user to inviteeStudents
      setInviteeStudents(prevStudents => [...prevStudents, userId]);
    }
  };

  const handleUserClick = (uniqueKey, e) => {
    e.preventDefault();
    setVisibleUserPopups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(uniqueKey)) {
        newSet.delete(uniqueKey); // Remove from set if already visible
      } else {
        newSet.add(uniqueKey); // Add to set if not visible
      }
      return newSet;
    });
  };

  const getInviteeStudents = async courseId => {
    try {
      const response = await fetchClient(`${BACKEND_URL}/course/${courseId}/students`);
      const data = await response.json();

      // Extract student objects from the response
      const students = data.students.map(studentObj => studentObj.student);

      // Filter students who are not in the roomUsersId array
      const inviteeStudents = students.filter(student => !roomUsersId.includes(student._id));
      // Update the state with invitee students
      setInviteeStudents(inviteeStudents);
    } catch (error) {
      console.error("Failed to fetch course students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStudents = async studentId => {
    try {
      const response = await fetchClient(`${BACKEND_URL}/room/${chatroomId}/invite/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        toast.error("Failed to add student");
      } else {
        const data = await response.json();
        if (data.success) {
          toast.success("Successfully added student");

          // Update roomUsersId with the new student ID
          setRoomUsersId(prevIds => [...prevIds, studentId]);

          // Remove student from invitee list
          setInviteeStudents(prev => prev.filter(student => student._id !== studentId));

          // Update the roomMembersCount after adding the user
          setRoomMembersCount(prevCount => prevCount + 1);
        }
      }
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const handleClickAddStudents = async () => {
    setIsDropdownOpen(!isDropdownOpen);

    if (!isDropdownOpen) {
      await getInviteeStudents(courseId);
    }
  };

  const handleSelectStudent = async studentId => {
    // Handle the logic to invite a student to the chat room
    console.log(`Inviting student with ID: ${studentId}`);
    addStudents(studentId);
    setIsDropdownOpen(false);
  };

  const isValidMessage = newMessage.trim().length > 0;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container px-3 mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <img src={chatRoomDetails.course.thumbnail} className="w-20 h-20 rounded-full object-cover" />
        </div>
        <div>
          <Link href={`/course/detail/${chatRoomDetails.course._id}`} className="text-xl font-semibold hover:underline">
            {chatRoomDetails.course.title}
          </Link>
        </div>
        {instructor._id == user.user._id && (
          <p onClick={handleClickAddStudents} className="hover:cursor-pointer hover:underline text-sm text-gray-500">
            Add Students
          </p>
        )}
        <small className="text-xs ">{roomMembersCount} members</small>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="relative z-20 mt-2 p-4 bg-white border border-gray-300 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {inviteeStudents.length > 0 ? (
              inviteeStudents.map(student => (
                <div
                  key={student._id}
                  onClick={() => handleSelectStudent(student._id)}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer mb-3">
                  <Image src={student.avatar} alt={student.fullName} width={25} height={25} className="rounded-full" />
                  <span className="ml-3 text-gray-800">{student.fullName}</span>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500 text-center">No students available to invite.</div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col h-full pt-5">
        <div className="flex-grow overflow-y-auto pb-4 px-3 mb-12 shadow-lg rounded-lg">
          {/* Display messages */}
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const uniqueKey = `${msg.sender._id}-${msg._id}`;
              const messageTime = isNaN(new Date(msg.createdAt).getTime())
                ? formatTime(new Date())
                : formatTime(msg.createdAt);
              const currentMessageDate = new Date(msg.createdAt);
              const previousMessageDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;

              // Determine if the date should be shown
              const showDate =
                index === 0 || currentMessageDate.toLocaleDateString() !== previousMessageDate?.toLocaleDateString();

              // Check if the message is an announcement
              if (msg.isAnnouncement) {
                return (
                  <div key={uniqueKey} className="flex justify-center mb-3">
                    <span className="text-gray-600 text-sm italic">{msg.message}</span>
                  </div>
                );
              }

              return (
                <div
                  key={uniqueKey}
                  className={`relative flex flex-col mb-3 ${
                    msg.sender._id === user.user._id ? "items-end" : "items-start"
                  }`}>
                  {/* Show date once for messages on the same day */}
                  {showDate && (
                    <div className="text-xxs mb-2 w-full flex justify-center text-gray-500">
                      {currentMessageDate.toLocaleDateString() === new Date().toLocaleDateString()
                        ? "Today"
                        : currentMessageDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: currentMessageDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                          })}
                    </div>
                  )}
                  {msg.sender._id !== user.user._id && (
                    <div
                      className="flex items-center space-x-3 cursor-pointer relative"
                      onClick={e => handleUserClick(uniqueKey, e)}>
                      {msg.sender.avatar ? (
                        <Image
                          src={msg.sender.avatar}
                          alt={`${msg.sender.fullName}'s avatar`}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      )}
                      <p className="font-semibold text-gray-800">
                        {msg.sender._id === instructor._id ? (
                          <Link href={`/instructor/profile/${instructor._id}`}>
                            {msg.sender.fullName}
                            <span className="text-xs text-gray-500"> (instructor)</span>
                          </Link>
                        ) : (
                          <span> {msg.sender.fullName} </span>
                        )}
                      </p>

                      {visibleUserPopups.has(uniqueKey) &&
                        instructor._id === user.user._id &&
                        roomUsersId.includes(msg.sender._id) && (
                          <div
                            ref={userPopupRef}
                            className="absolute left-16 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-10">
                            <button
                              onClick={() => handleKickUser(msg.sender._id)}
                              className="block px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white w-full text-left">
                              Remove User
                            </button>
                          </div>
                        )}
                    </div>
                  )}

                  <div className={`${msg.sender._id === user.user._id ? "self-end" : "self-start"} mt-1`}>
                    {msg.sender._id !== user.user._id ? (
                      <div className="bg-white py-1 px-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-700">
                          {msg.message}
                          {msg.edited && <span className="text-xxs pl-2 text-gray-500">(edited)</span>}
                        </p>
                        <p className="text-xxs text-right font-extralight text-gray-500 min-w-max">{messageTime}</p>
                      </div>
                    ) : (
                      <div className="relative flex items-start">
                        {editingMessage === msg._id ? (
                          <div className="flex flex-col bg-gray-100 p-2 rounded-lg shadow-sm border border-gray-300">
                            <input
                              type="text"
                              value={editedMessage}
                              onChange={e => setEditedMessage(e.target.value)}
                              className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          <div className="bg-gray-100 px-6 py-2 rounded-lg shadow-sm border border-gray-300">
                            <p className="text-sm">{msg.message}</p>
                            <small className="text-xxs text-right text-gray-500">{messageTime}</small>
                          </div>
                        )}
                        <span
                          className="absolute right-[-15px] text-gray-500 hover:cursor-pointer"
                          onClick={() => setSelectedMessage(msg._id)}>
                          <IoMdMore />
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedMessage === msg._id && (
                    <div
                      ref={messagePopupRef}
                      className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-10">
                      <button
                        onClick={() => {
                          setEditingMessage(msg._id);
                          setEditedMessage(msg.message);
                          setSelectedMessage(null);
                        }}
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white w-full text-left">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="block px-4 py-2 text-gray-800 hover:bg-red-500 hover:text-white w-full text-left">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No messages yet. Be the first to send one!</p>
          )}
        </div>

        <div className="bg-gray-100 p-3 fixed bottom-0 left-0 w-full rounded-lg border-t border-gray-300">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message"
              className="flex-1 border border-gray-300 p-2 rounded-lg"
            />
            <button
              onClick={sendMessage}
              disabled={!isValidMessage || messages.length === 0}
              className={`ml-2 px-4 py-2 rounded-lg ${
                isValidMessage && messages.length > 0
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(ChatRoom);
