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
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${BACKEND_URL}/course/comment/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user && user.token`Bearer ${user.token}`,
        },
        body: JSON.stringify({
          comment: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      setComments([addedComment, ...comments]);
      setDisplayedComments([addedComment, ...displayedComments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = async () => {
    if (!editingCommentText.trim()) return;

    try {
      const response = await fetch(`${BACKEND_URL}course/${courseId}/comment/${editingCommentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user && user.token  `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          comment: editingCommentText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }

      const updatedComment = await response.json();
      const updatedComments = comments.map(comment => (comment._id === editingCommentId ? updatedComment : comment));
      setComments(updatedComments);
      setDisplayedComments(updatedComments.slice(0, commentsToShow));
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
      toast.error("Failed to edit comment");
    }
  };

  const handleDeleteComment = async commentId => {
    try {
      const response = await fetch(`${BACKEND_URL}course/${courseId}/comment/${editingCommentId}`, {
        method: "DELETE",
        headers: {
          Authorization: user && user.token `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComments);
      setDisplayedComments(updatedComments.slice(0, commentsToShow));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
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
                Enroll
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

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
            {user && (
              <div className="mb-6">
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <button
                  className="bg-black text-white py-2 px-8 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black w-max text-base mt-3"
                  onClick={handleAddComment}>
                  Post
                </button>
              </div>
            )}

            {displayedComments.map(comment => (
              <div key={comment._id} className="mb-4 p-4 border rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>{comment.student.fullName}:</strong> {comment.comment}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>

                {user && user._id === comment.student._id && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingCommentText(comment.comment);
                      }}>
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline" onClick={() => handleDeleteComment(comment._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            {moreCommentsAvailable && (
              <small className=" hover:underline mt-2 cursor-pointer" onClick={loadMoreComments}>
                View More
              </small>
            )}
          </div>
        </div>
      </div>

      {editingCommentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-bold mb-4">Edit Comment</h3>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="3"
              value={editingCommentText}
              onChange={e => setEditingCommentText(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
                onClick={() => setEditingCommentId(null)}>
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleEditComment}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
