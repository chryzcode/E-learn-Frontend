"use client";
import React, { useEffect, useState } from "react";
import CoursesListing from "@/app/components/CoursesListing";
import { useAuthState } from "@/app/utils/AuthContext";
import Spinner from "@/app/components/Spinner";
import WithAuth from "@/app/utils/WithAuth";
import { useParams } from "next/navigation";

const instructorProfilePage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthState();
  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";
  const { instructorId } = useParams();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/course/instructor/${instructorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.user.token}`,
        },
      });
      const data = await response.json();
      setCourses(data.courses);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          {user.user.avatar ? (
            <img src={user.user.avatar} alt={user.user.fullName} className="w-32 h-32 rounded-full object-cover" />
          ) : null}
        </div>
        <p className="text-3xl font-bold">{user.user.fullName}</p>
        <p className="my-2 text-lg font-semibold">{user.user.userType}</p>
        <div className="mt-4">
          <p className="text-xl font-semibold">About/Bio:</p>
          <p className="mt-2 text-base">{user.user.bio}</p>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center pt-16">My Courses ({courses.length})</h1>
      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => (
            <CoursesListing course={course} key={course._id} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-xl">No courses available</div>
      )}
    </div>
  );
};

export default WithAuth(instructorProfilePage);
