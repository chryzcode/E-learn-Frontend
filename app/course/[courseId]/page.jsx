"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/utils/AuthContext";
import Spinner from "@/app/components/Spinner";

const CourseDetailPage = ({ params }) => {
  const { id } = params;
  const { user, loading } = useAuthState();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else {
      fetchCourse();
    }
  }, [user, loading, id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`https://your-backend-url.com/courses/${id}`);
      const data = await response.json();
      setCourse(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return <Spinner />;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="course-header">
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-xl text-gray-700">{course.description}</p>
        {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="my-4 w-full max-w-lg mx-auto" />}
      </div>

      <div className="course-details my-6">
        <div className="text-lg">
          <strong>Price:</strong> ${course.price}
        </div>
        <div className="text-lg">
          <strong>Category:</strong> {course.category.name}
        </div>
        <div className="text-lg">
          <strong>Instructor:</strong> {course.instructor.fullName} ({course.instructor.userType})
        </div>
      </div>

      <div className="course-video my-6">
        {course.videoUrl && (
          <video controls className="w-full max-w-2xl mx-auto">
            <source src={course.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
