"use client"; // Add this at the top of the file

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthState } from "@/app/utils/AuthContext";
import Spinner from "@/app/components/Spinner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const CourseDetailPage = ({ params }) => {
  const { courseId } = params;
  const { user, loading: authLoading } = useAuthState();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const videoRef = useRef(null);

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${BACKEND_URL}/course/detail/${courseId}`, {
        method: "GET",
        headers: {
          Authorization: user && user.token ? `Bearer ${user.token}` : "",
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
      console.log("Finished fetching course data");
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

  if ( isLoading) {
    return <Spinner />;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">Course not found</div>;
  }

  const { title, price, category, instructor, createdAt, description, video } = course;
  const instructorName = instructor ? instructor.fullName || instructor.name : "Unknown Instructor";
  const instructorId = instructor ? instructor._id : "#";

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
              <source src={video + `?authToken=${user ? user.token : ""}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center text-gray-400">
              Video not available
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
          <div className="text-sm text-gray-700 mb-4">
            <div className="flex flex-wrap gap-4 mb-2">
              <div>
                <strong>Price:</strong> {price ? `$${price}` : "Price not available"}
              </div>
              <div>
                <strong>Category:</strong> {category ? category.name : "Category not available"}
              </div>
              <div>
                <strong>Instructor:</strong>{" "}
                <Link href={`/instructor/${instructorId}`} className="hover:underline">
                  {instructorName}
                </Link>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <strong>Created:</strong> {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
          </div>
          <p className="text-lg text-gray-600 mb-4">{description || "No description available"}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
