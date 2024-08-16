"use client";
import React, { useEffect, useState } from "react";
import CoursesListing from "@/app/components/CoursesListing";
import { useAuthState } from "@/app/utils/AuthContext";
import Spinner from "@/app/components/Spinner";
import WithAuth from "@/app/utils/WithAuth";
import { useParams } from "next/navigation";

const instructorProfilepage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthState();
  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";
  const {instructorId} = useParams()

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

  // if (!courses.length) {
  //   return <div className="flex items-center justify-center min-h-screen text-xl">No courses available</div>;
  // }
  return (
    <div className="container mx-auto p-4">
      <div>
        <p> {user.user.fullName}</p>
        <p>{user.user.userType}</p>
        <div>{user.user.bio}</div>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <CoursesListing course={course} key={course._id} />
        ))}
      </div>
    </div>
  );
};

export default WithAuth(instructorProfilepage);
