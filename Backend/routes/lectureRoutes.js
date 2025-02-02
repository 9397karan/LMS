const express = require('express');
const { upload, uploadMediaToCloudinary, deleteMediaFromCloudinary } = require('../utils/cloudinary');
const router = express.Router();
const Course = require('../models/courseModel');
const Lecture = require('../models/lessonModel');
const User = require('../models/userModel');

// Fetch all videos for a course

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Course ID
        
        // Fetch all lectures associated with the course ID
        const allLectures = await Lecture.find({ course: id }).populate('course');
       const instructor=await User.find(allLectures[0].course.creator)
        
        if (!allLectures || allLectures.length === 0) {
            return res.status(404).json({
                message: 'No lectures found for the given course ID.',
            });
        }
        
        res.status(200).json({
            message: 'All videos fetched successfully',
            course: allLectures[0]?.course, // Assuming all lectures have the same course reference
            lectures: allLectures,
            instructor:instructor
        });
    } catch (error) {
        res.status(500).json({
            message: 'Unable to fetch videos',
            error: error.message,
        });
    }
});







// Fetch all videos and highlight a specific one
router.get("/lessons/:id", async (req, res) => {
    try {
        const { id } = req.params; // Lesson ID
        const lecture = await Lecture.findOne({ "lessons._id": id }, { "lessons.$": 1 }); // Find the specific lecture
        const allLectures = await Lecture.find({ course: lecture.course }); // Fetch all lectures for the course

        res.status(200).json({
            message: 'Videos with specific video highlighted',
            allLectures,
            playingLecture: lecture
        });
    } catch (error) {
        res.status(400).json({
            message: 'Unable to fetch video: ' + error.message,
        });
    }
});

//delete lesson
router.delete("/delete-lesson/:lectureId/:lessonId", async (req, res) => {
    try {
        const { lectureId, lessonId } = req.params; //lessonID lessons array lesson ka id hai, mongo ka _id nhi hai

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        const lessonIndex = lecture.lessons.findIndex(lesson => lesson.id === lessonId);
        if (lessonIndex === -1) {
            return res.status(404).json({ message: "Lesson not found in the lecture" });
        }
        await deleteMediaFromCloudinary(lecture.lessons[lessonIndex].id);
        lecture.lessons.splice(lessonIndex, 1);
        await lecture.save();

        res.status(200).json({
            message: "Lesson removed successfully",
        });
    } catch (error) {
       
        res.status(500).json({
            message: "Error in removing lesson: " + error.message,
        });
    }
});

// router.delete('/delete-lesson/:lectureId/:lessonId', async (req, res) => {
//     const { lectureId, lessonId } = req.params;
  
//     try {
//       const lecture = await Lecture.findById(lectureId);
  
//       if (!lecture) {
//         return res.status(404).json({ message: "Lecture not found" });
//       }
  
//       lecture.lessons = lecture.lessons.filter(
//         (lesson) => lesson._id.toString() !== lessonId
//       );
  
//       await lecture.save();
  
//       res.status(200).json({ updatedLessons: lecture.lessons });
//     } catch (error) {
//       console.error("Error deleting lesson:", error);
//       res.status(500).json({ message: "Failed to delete lesson" });
//     }
//   });
  
module.exports = router;
