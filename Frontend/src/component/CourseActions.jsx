// CourseActions Component (Handles checking purchase status)
import React, { useState, useEffect } from "react";
import axios from "axios";
import BuyCourseButton from "./BuyCourseButton"; 

const CourseActions = ({ courseId, userId }) => {
  const [purchased, setPurchased] = useState(false);

  // Check purchase status on component mount
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        const response = await axios.post("https://lms-backened-mr34.onrender.com/api/check-purchase-status", {
          courseId,
          userId,
        });

        if (response.data.success) {
          setPurchased(response.data.purchased);
        }
      } catch (error) {
        console.error("Error checking purchase status:", error);
      }
    };

    checkPurchaseStatus();
  }, [courseId, userId]);

  const handleContinueCourse = () => {
    window.location.href = `/course-progress/${courseId}`;
  };

  return (
    <div>
      {purchased ? (
        <button onClick={handleContinueCourse} className="btn-primary w-full">
          Continue Course
        </button>
      ) : (
        <BuyCourseButton courseId={courseId} userId={userId} />
      )}
    </div>
  );
};

export default CourseActions;
