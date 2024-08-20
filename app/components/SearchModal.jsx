import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import CoursesListing from "./CoursesListing";

const SearchModal = ({ isOpen, closeModal }) => {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const BACKEND_URL = "https://e-learn-l8dr.onrender.com";

  const fetchCourses = async (searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/course/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      // Ensure data.data is an array
      if (Array.isArray(data.data)) {
        setCourses(data.data);
      } else {
        setCourses([]);
        setError("Invalid data format received.");
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setError("Failed to fetch courses.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchCourses(query);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleResultClick = () => {
    closeModal();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backdropFilter: "blur(10px)" }}
      onClick={handleOverlayClick} // Close modal on outside click
    >
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Search Courses</h2>
          <button onClick={closeModal} className="text-gray-500 text-3xl">
            &times;
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center mb-4">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md"
          />
          <button
            type="submit"
            className="bg-black text-white p-2.5 rounded-r-md transition duration-300 ease-in-out transform hover:bg-white hover:text-black hover:border hover:border-black w-max text-base">
            <FaSearch />
          </button>
        </form>

        {/* Results Section */}
        {isLoading ? (
          <div className="flex justify-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : courses && courses.length === 0 ? (
          <div className="text-center text-gray-500">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => (
              <div
                key={course._id}
                onClick={handleResultClick} // Close modal on result click
                className="cursor-pointer" // Add cursor pointer to indicate clickable items
              >
                <CoursesListing course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
