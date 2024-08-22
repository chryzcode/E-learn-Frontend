"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/app/components/Spinner";
import { useAuthState } from "@/app/utils/AuthContext";
import WithAuth from "@/app/utils/WithAuth";

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
      const response = await fetch(`${BACKEND_URL}/room`, {
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
        {rooms.map(room => room._id)}
      </div>
    </div>
  );
};

export default WithAuth(MyChatRoomsPage);
