"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthState } from "@/app/utils/AuthContext";
import Spinner from "@/app/components/Spinner";

const CourseDetailPage = ({ params }) => {
  const { courseId } = params;
  const { user, loading } = useAuthState();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const videoRef = useRef(null);

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  useEffect(() => {
    fetchCourse();
  }, [user, loading, courseId]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${BACKEND_URL}/course/detail/${courseId}`, {
        method: "GET",
        headers: {
          Authorization: user ? `Bearer ${user.token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }

      const data = await response.json();
      if (data.access) {
        setCourse(data.access);
        setHasAccess(true);
      } else {
        setCourse(data.noAccess);
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoPlay = () => {
    if (!hasAccess) {
      videoRef.current.pause();
      toast.error("You do not have access to this course video.");
    }
  };

  const handleContextMenu = event => {
    event.preventDefault();
  };

  const handleTouchStart = event => {
    event.preventDefault();
  };

  if (loading || isLoading) {
    return <Spinner />;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="course-details bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          {hasAccess ? (
            <video
              ref={videoRef}
              controls
              controlsList="nodownload"
              className="w-full h-64 md:h-96 object-contain"
              onPlay={handleVideoPlay}
              onContextMenu={handleContextMenu}
              onTouchStart={handleTouchStart}
              preload="metadata"
              disablePictureInPicture>
              <source src={course.video + `?authToken=${user.token}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center text-gray-400">
              Video not available
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{course.description || "No description available"}</p>
          <div className="flex items-center mb-4">
            <div className="text-gray-700">
              <div className="text-lg mb-2">
                <strong>Price:</strong>{" "}
                {course.price ? `$${course.price}` : course.free ? "Free" : "Price not available"}
              </div>
              <div className="text-lg mb-2">
                <strong>Category:</strong> {course.category.name}
              </div>
              <div className="text-lg">
                <strong>Instructor:</strong> {course.instructor.fullName || course.instructor}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
