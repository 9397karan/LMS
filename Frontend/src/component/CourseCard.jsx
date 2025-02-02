import { Badge } from "@/components/ui/badge"; // Adjust the path as necessary
import React from "react";
import { Link } from "react-router-dom";
import CourseActions from "./CourseActions";

const CourseCard = ({ course }) => {
  const truncatedDescription = course?.courseDesc
    ? course.courseDesc.length > 100
      ? `${course.courseDesc.slice(0, 100)}...`
      : course.courseDesc
    : "No description available";

  const user = JSON.parse(localStorage.getItem("user"))? JSON.parse(localStorage.getItem("user"))._id
  : null;

  return (
    <div className="relative w-full sm:max-w-sm lg:max-w-md xl:max-w-lg group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/course-detail/${course?._id}`} className="block w-full h-full">
        <div className="relative">
          <img
            className="w-full h-40 lg:h-48 xl:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            src={course?.coursePic?.url}
            alt="Course"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-lg font-semibold transition-opacity duration-300 p-4">
            <h3 className="text-xl font-bold text-center">{course?.courseName}</h3>
            <p className="mt-2 text-sm text-center">{truncatedDescription}</p>
           <CourseActions courseId={course?._id} userId={user} />
          </div>
        </div>
        <div className="p-4 flex flex-col">
          <div className="text-sm font-medium text-blue-500 dark:text-blue-400">
            {course?.courseName}
          </div>
          <h2 className="mt-2 text-sm font-semibold text-gray-800 dark:text-white h-12 lg:h-14 xl:h-16 overflow-hidden">
            {truncatedDescription}
          </h2>
          <span className="text-gray-600 dark:text-gray-300 text-sm">
            {course?.creator}
          </span>
          <div className="flex items-center mt-3 justify-between">
            <Badge className="dark:bg-gray-800 dark:text-white">
              {course?.courseLevel}
            </Badge>
            <span className="text-gray-400 dark:text-gray-500">
              {course?.courseDuration}
            </span>
            <span className="text-green-500 dark:text-green-400 text-sm font-bold">
              ₹{course?.coursePrice}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
