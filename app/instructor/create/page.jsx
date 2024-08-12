"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import WithAuth from "@/app/utils/WithAuth";

const CreateCoursePage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState(""); // New state for description
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleVideoUpload = e => {
    setVideo(e.target.files[0]);
  };

  const handleThumbnailUpload = e => {
    setThumbnail(e.target.files[0]);
  };

  useEffect(() => {
    const getCourseCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/course/categories`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          const errorMessage = data.msg || data.error || "Failed to fetch course categories";
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }

        setAllCategories(data.categories);
        setLoading(false);
      } catch (error) {
        toast.error(error.message || "Failed to fetch course categories");
      } finally {
        setLoading(false);
      }
    };

    getCourseCategories();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description); // Append description
      formData.append("video", video);
      formData.append("thumbnail", thumbnail);

      const response = await fetch(`${BACKEND_URL}/course`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`, // Include authorization header
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.msg || data.error || "Course creation failed";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      toast.success("Course created successfully!");
      router.push(`/course/${data.course._id}`);
    } catch (error) {
      toast.error("Course creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 md:mx-10">
      <p className="text-2xl text-customPurple font-semibold mx-auto text-center py-5 md:py-7">Create</p>

      <div className="flex-wrap-container py-5 align-middle px-2 md:px-10">
        <div className="p-4 md:p-6 mx-auto max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <label htmlFor="title" className="block mb-2 text-sm">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border w-full py-2 px-3 mb-2"
                placeholder="Course Title"
                required
              />
            </div>

            <div className="my-3">
              <label htmlFor="thumbnail" className="block mb-2 text-sm">
                Thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="border w-full py-2 px-3 mb-2"
                required
              />
            </div>

            <div className="my-3">
              <label htmlFor="price" className="block mb-2 text-sm">
                Price <small className="text-gray-500">(optional)</small>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="border w-full py-2 px-3 mb-2"
                placeholder="Price"
              />
            </div>

            <div className="my-3">
              <label htmlFor="category" className="block mb-2 text-sm">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="border w-full py-2 px-3 mb-2"
                required>
                <option value="">Select a category</option>
                {allCategories.map(aCategory => (
                  <option value={aCategory.name} key={aCategory._id}>
                    {aCategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-3">
              <label htmlFor="description" className="block mb-2 text-sm">
                Description <small className="text-gray-500">(optional)</small>
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="border w-full py-2 px-3 mb-2"
                placeholder="Course Description"
                rows="4"
                required
              />
            </div>

            <div className="my-3">
              <label htmlFor="video" className="block mb-2 text-sm">
                Video Upload
              </label>
              <input
                type="file"
                id="video"
                name="video"
                accept="video/*"
                onChange={handleVideoUpload}
                className="border w-full py-2 px-3 mb-2"
                required
              />
            </div>

            <div className="flex justify-center my-6 md:my-8">
              <button
                className="bg-black text-white font-bold py-2 px-8 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black"
                type="submit">
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && <Spinner />}
    </div>
  );
};

export default WithAuth(CreateCoursePage);

