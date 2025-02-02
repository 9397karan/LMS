import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import api from "@/utils/api";

const CourseExplore = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)
  const getAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/user/course/${user._id}`);
      console.log("API Response:", response.data.enrolledCourses);
      const courses = response.data.enrolledCourses;
      if (Array.isArray(courses)) {
        setAllCourses(courses);
      } else {
        console.error("Courses data is not an array:", courses);
        setAllCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  const handleContinueCourse = (courseId) => {
    window.location.href = `/course-progress/${courseId}`;
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">Error loading courses.</div>;

  return (
    <section className="dark:bg-gray-900 w-full p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Enrolled Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {allCourses.map((course, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <img
              src={course.coursePic.url}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-2">{course.courseName}</h2>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {course.courseDesc || "No description available."}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-sm text-gray-300">Enrolled</p>
                </div>
                
              </div>
              <p className="text-sm text-gray-400 mt-2">Level: {course.courseLevel || "N/A"}</p>
            </div>
            <button onClick={()=>handleContinueCourse(course._id)} className="btn-primary w-full bg-blue-600 h-9 text-white">
          Continue Course
        </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseExplore;
