"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { formatDistanceToNow } from "date-fns";

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
      const response = await fetch(`${BACKEND_URL}/course`);
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
    return <div className="flex items-center justify-center min-h-screen text-xl">No courses available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <div
            key={course._id}
            className="relative border rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col"
            onClick={() => router.push(`/course/${course._id}`)}>
            {course.thumbnail ? (
              <div className="relative h-36">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ) : null}
            <div className="p-3 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <div className="text-sm mb-1">
                <strong>Instructor:</strong>{" "}
                <a href={`/instructor/${course.instructor._id}`} className="hover:underline">
                  {course.instructor.fullName}
                </a>
              </div>
              <div className="text-sm mb-1">
                <strong>Price:</strong> {course.price ? `$${course.price}` : <span>Free</span>}
              </div>
              <div className="text-sm ">
                <strong>Category:</strong> {course.category.name}
              </div>
              {course.createdAt && (
                <div className="text-right text-xs text-gray-500 ">
                  {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCoursesPage;
