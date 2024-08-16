import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const CoursesListing = ({ course }) => {

      const router = useRouter();
  return (
    <div
      className="relative border rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col"
      onClick={() => router.push(`/course/${course._id}`)}>
      {course.thumbnail ? (
        <div className="relative h-36">
          <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="p-3 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
        <div className="text-sm mb-1">
          <strong>Instructor:</strong>{" "}
          <a href={`/instructor/profile/${course.instructor._id}`} className="hover:underline">
            {course.instructor.fullName}
          </a>
        </div>
        <div className="text-sm mb-1">
          <strong>Price:</strong> {course.price ? `$${course.price}` : <span>Free</span>}
        </div>
        <div className="text-sm ">
          <strong>Category:</strong> {course.category.name}
        </div>
        {course.createdAt && (
          <div className="text-right text-xs text-gray-500 ">
            {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesListing;
