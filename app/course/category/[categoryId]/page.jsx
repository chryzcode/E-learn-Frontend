"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/app/components/Spinner";
import CoursesListing from "@/app/components/CoursesListing";
import { useParams } from "next/navigation";

const categoryCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";
  const { categoryId } = useParams();

  useEffect(() => {
    fetchCourses();
  }, [categoryId]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/course/categories/${categoryId}`);
      const data = await response.json();
      setCourses(data.courses);
      setCategoryName(data.courses[0].category.name);
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
      <h1 className="text-3xl font-bold mb-6 text-center">{categoryName} Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <CoursesListing course={course} key={course._id} />
        ))}
      </div>
    </div>
  );
};

export default categoryCoursesPage;
