"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/app/components/Spinner";
import { useAuthState } from "@/app/utils/AuthContext";
import WithAuth from "@/app/utils/WithAuth";
import Image from "next/image";
import Link from "next/link";
import { fetchClient } from "../utils/FetchClient";

const MyChatRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthState();
  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetchClient(`${BACKEND_URL}/room`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setRooms(data.rooms);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!rooms.length) {
    return <div className="flex items-center justify-center min-h-screen text-xl">No chatrooms available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My ChatRooms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map(room => {
          const instructor = room.users.find(u => u.userType === "Instructor");

          return (
            <Link href={`/chatrooms/${room._id}`} key={room._id} className="border rounded-lg p-4 shadow-md bg-white">
              <div className="flex items-center mb-3">
                <Image
                  src={room.course.thumbnail}
                  alt="Course Thumbnail"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <h2 className="text-lg font-semibold">{room.course.title}</h2>
                  <p className="text-sm text-gray-600">
                    Instructor: <Link className="hover:underline" href={`/instructor/profile/${instructor._id}`}>{instructor.fullName}</Link>
                  </p>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">{room.users.length} Students</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WithAuth(MyChatRoomsPage);
