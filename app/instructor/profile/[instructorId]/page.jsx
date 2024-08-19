"use client";
import React, { useEffect, useState } from "react";
import CoursesListing from "@/app/components/CoursesListing";
import Spinner from "@/app/components/Spinner";
import { useParams } from "next/navigation";

const instructorProfilePage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ instructor, setInstructor ] = useState(null);
  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";
  const { instructorId } = useParams();

  useEffect(() => {
    fetchCourses();
    fetchInstructor();
  }, [instructorId]);

  const fetchInstructor = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/profile/${instructorId}`);
      const data = await response.json();

      if (response.ok) {
        console.log("Fetched instructor data:", data.user);
        setInstructor(data.user);
      } else {
        console.error("Failed to fetch instructor:", data);
      }
    } catch (error) {
      console.error("Failed to fetch instructor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/course/instructor/${instructorId}`);
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
      {instructor ? (
        <div className="text-center">
          <div className="flex justify-center mb-3">
            {instructor.avatar ? (
              <img src={instructor.avatar} alt={instructor.fullName} className="w-40 h-40 rounded-full object-cover" />
            ) : null}
          </div>
          <p className="text-3xl font-bold">{instructor.fullName}</p>
          <p className="my-2 text-lg font-semibold">{instructor.userType}</p>
          <div className="mt-4">
            <p className="text-xl font-semibold">About/Bio:</p>
            <p className="mt-2 text-base">{instructor.bio}</p>
          </div>
        </div>
      ) : null}
      <h1 className="text-2xl font-bold mb-6 text-center pt-16">Courses ({courses.length})</h1>
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

export default instructorProfilePage;
