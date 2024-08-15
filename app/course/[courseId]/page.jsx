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
  const [isEditingComment, setIsEditingComment] = useState({}); // New state for managing comment edits
  const videoRef = useRef(null);

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  useEffect(() => {
    fetchCourse();
  }, [courseId, user]);

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
      const courseData = data.course;

      if (courseData) {
        setCourse(courseData);
        setHasAccess(courseData.video !== null); // Determine if the user has access to the video
        setComments(courseData.comments || []);
        setAverageRating(courseData.averageRating || 0);

        // Initialize displayedComments with the first batch
        const initialComments = courseData.comments.slice(0, commentsToShow);
        setDisplayedComments(initialComments);
        setMoreCommentsAvailable(courseData.comments.length > commentsToShow);
      } else {
        setCourse(null);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
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

  const loadMoreComments = () => {
    const newCommentsToShow = commentsToShow + 5;
    setCommentsToShow(newCommentsToShow);
    setDisplayedComments(comments.slice(0, newCommentsToShow));
    setMoreCommentsAvailable(comments.length > newCommentsToShow);
  };

  const handleEditCommentClick = commentId => {
    setIsEditingComment({ id: commentId, isEditing: true });
  };
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!hasAccess) {
      toast.error("You do not have access to add comments.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/course/comment/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          comment: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      const addedComment = data.comment; // Extracting the comment object

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

    if (!hasAccess) {
      toast.error("You do not have access to edit comments.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/course/${courseId}/comment/${editingCommentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          comment: editingCommentText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }

      const data = await response.json();
      const updatedComment = data.comment;
      toast.success("Comment updated");

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
    if (!hasAccess) {
      toast.error("You do not have access to delete comments.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/course/${courseId}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      const data = await response.json();
      toast.success(data.success);
      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComments);
      setDisplayedComments(updatedComments.slice(0, commentsToShow));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const enrolCourse = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/course/enroll/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to enroll");
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Enrollment successful!");
        setHasAccess(true);
      } else if (data.payment) {
        window.open(data.payment, "_blank");
      }
    } catch (error) {
      console.error("Failed to enroll:", error);
      toast.error("Failed to enroll");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">No course available</div>;
  }

  const { title, price, category, instructor, createdAt, description, video } = course;
  const instructorName = instructor ? instructor.fullName || instructor.name : "Unknown Instructor";
  const instructorId = instructor ? instructor._id : "#";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="course-details bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          {video ? (
            <video
              ref={videoRef}
              controls
              controlsList="nodownload"
              className="w-full h-64 md:h-96 object-contain"
              onPlay={handleVideoPlay}
              preload="metadata"
              disablePictureInPicture>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">Enroll to view video</div>
          )}
        </div>

        <div className="p-6">
          {user ? (
            <div className="flex justify-end my-4">
              {hasAccess ? (
                <div className="bg-black text-white font-bold py-2 px-8 hover:cursor-pointer focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black w-max text-base">
                  ChatRoom
                </div>
              ) : (
                <div
                  onClick={enrolCourse}
                  className="bg-black text-white font-bold py-2 px-8 hover:cursor-pointer focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black w-max text-base">
                  Enroll
                </div>
              )}
            </div>
          ) : null}

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
                <strong>Rating:</strong> {averageRating.toFixed(1)} / 5
              </div>
              <div>
                <strong>Created:</strong> {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4 text-sm">{description}</p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>

            <div className="my-4">
              {displayedComments.map(comment => (
                <div key={comment._id} className="border-b pb-2 mb-2">
                  {comment && comment.student ? (
                    <div className="flex items-center mb-2">
                      {comment.student.avatar ? (
                        <img
                          src={comment.student.avatar}
                          alt={comment.student.fullName}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : null}
                      <span className="font-semibold">{comment.student.fullName}</span>
                    </div>
                  ) : null}

                  <p>{comment.comment}</p>
                  <div className="text-sm text-gray-500">
                    {comment.createdAt && !isNaN(Date.parse(comment.createdAt))
                      ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                      : "Invalid date"}
                  </div>
                  {hasAccess && user && comment && comment.student && user.user._id === comment.student._id && (
                    <div className="mt-2 text-right">
                      <span
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditingCommentText(comment.comment);
                        }}
                        className="text-blue-500 hover:cursor-pointer hover:underline  mr-4">
                        Edit
                      </span>
                      <span
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:cursor-pointer hover:underline rounded">
                        Delete
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {moreCommentsAvailable && (
                <small onClick={loadMoreComments} className="hover:underline hover:cursor-pointer mt-2">
                  View more
                </small>
              )}
            </div>
            {hasAccess && (
              <div className="mt-6">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Add a comment..."></textarea>
                <button
                  onClick={handleAddComment}
                  className="bg-black text-white py-2 px-3 hover:cursor-pointer focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black w-max text-base">
                  Comment
                </button>
              </div>
            )}

            {editingCommentId && (
              <div className="mt-6">
                <textarea
                  value={editingCommentText}
                  onChange={e => setEditingCommentText(e.target.value)}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded mb-4"></textarea>
                <button onClick={handleEditComment} className="bg-blue-500 text-white py-2 px-4 rounded">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
