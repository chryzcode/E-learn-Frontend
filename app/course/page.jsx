"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/courses`);
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

  if (!courses.length) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">No courses available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {courses.map(course => (
          <div key={course._id} className="border rounded-lg p-4 shadow-lg">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover mb-4 rounded" />
            )}
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-lg text-gray-700 mb-2">{course.description}</p>
            <div className="text-lg">
              <strong>Price:</strong> ${course.price}
            </div>
            <div className="text-lg">
              <strong>Category:</strong> {course.category.name}
            </div>
            <div className="text-lg">
              <strong>Instructor:</strong> {course.instructor.fullName} ({course.instructor.userType})
            </div>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => router.push(`/course/${course._id}`)}>
              View Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCoursesPage;
