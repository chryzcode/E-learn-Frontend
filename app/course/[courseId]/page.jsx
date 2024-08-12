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
  const { user } = useAuthState();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [commentsToShow, setCommentsToShow] = useState(1); // Show only the first comment initially
  const [moreCommentsAvailable, setMoreCommentsAvailable] = useState(false); // To check if more comments are available
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
        setLikes(data.access.likes || 0);
        setComments(data.access.comments || []);
        setAverageRating(data.access.averageRating || 0);

        // Initialize displayedComments with the first batch
        const initialComments = data.access.comments.slice(0, commentsToShow);
        setDisplayedComments(initialComments);
        setMoreCommentsAvailable(data.access.comments.length > commentsToShow);
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

  const loadMoreComments = () => {
    const newCommentsToShow = commentsToShow + 5;
    setCommentsToShow(newCommentsToShow);
    setDisplayedComments(comments.slice(0, newCommentsToShow));
    setMoreCommentsAvailable(comments.length > newCommentsToShow);
  };

  if (isLoading) {
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
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="p-6">
          <div className="flex justify-end my-4">
            {hasAccess ? (
              <div className="bg-black text-white font-bold py-2 px-8 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black w-max text-base">
                ChatRoom
              </div>
            ) : (
              <div className="bg-black text-white font-bold py-2 px-8 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black w-max text-base">
                Pay
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

          <div className="text-sm text-gray-700 mb-4">
            <div className="flex flex-wrap gap-4 mb-2">
              <div>
                <strong>Price:</strong> {price ? `$${price}` : "Free"}
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

            <div className="flex flex-wrap gap-4 mb-2">
              <div>
                <strong>Likes:</strong> {likes} {likes > 1 ? "Likes" : "Like"}
              </div>

              <div>
                <strong>Average Rating:</strong> {averageRating}
              </div>
            </div>
            <div className="text-xs text-gray-500 my-5">
              <strong>Created:</strong> {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
          </div>
          <p className="text-base text-gray-600 mb-4">{description || "No description available"}</p>

          <div className="mt-9">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            {displayedComments.length > 0 ? (
              <div>
                {displayedComments.map(comment => (
                  <div key={comment._id} className="mb-5 py-4 px-2 shadow-lg rounded-lg">
                    <div className="flex items-center mb-1">
                      {comment.student.avatar && comment.student.avatar == null ? (
                        <img
                          src={comment.student.avatar}
                          alt={comment.student.fullName}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : null}
                      <span className="text-gray-800">{comment.student.fullName}</span>
                    </div>
                    <p className="text-gray-600 mb-2 mt-4 text-sm">{comment.comment}</p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No comments yet</p>
            )}
            {comments.length > 1 && comments.length > commentsToShow && (
              <small onClick={loadMoreComments} className="hover:underline cursor-pointer">
                View More
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
