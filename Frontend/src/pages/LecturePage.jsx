import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Loader from "@/component/Loader";
import { Lock, PlayCircle } from "lucide-react";

const LecturePage = () => {
  const { courseId } = useParams(); // courseId
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [info,setInfo]=useState(null)

  useEffect(() => {
    const fetchLectures = async () => {
      try {
         const response = await axios.get(`https://lms-backened-mr34.onrender.com/lecture/${courseId}`);
        const { lectures, course, playingLecture,instructor } = response.data;
console.log(response.data)
        setLectures(lectures);
        setCourse(course);
        setInfo(instructor)

        if (playingLecture?.lessons?.length > 0) {
          setSelectedLecture(playingLecture.lessons[0]);
        } else if (lectures.length > 0) {
          setSelectedLecture(lectures[0].lessons[0]);
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to fetch lectures.");
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId]);

  const handleLectureClick = (lesson) => {
    setSelectedLecture(lesson);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Loader/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        {/* Header */}
        <div className="mt-[100px] mb-8">
          <h1 className="text-3xl font-bold">{course?.courseName || "Course Name"}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Created by{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {info[0].name|| "Instructor"}
            </span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Video Player Section */}
          <div className="w-full lg:w-2/3">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="w-full aspect-video mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {selectedLecture ? (
                    <ReactPlayer
                      url={selectedLecture.video_URL}
                      width="100%"
                      height="100%"
                      controls
                    />
                  ) : (
                    <p className="text-center">No video selected</p>
                  )}
                </div>
                <h1 className="text-lg font-bold">
                  {selectedLecture?.title || "Select a lecture to view"}
                </h1>
              </CardContent>
            </Card>
          </div>

          {/* Lecture List Section */}
          <div className="w-full lg:w-1/3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lectures.map((lecture) =>
                  lecture.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      onClick={() => handleLectureClick(lesson)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedLecture?._id === lesson._id
                          ? "bg-blue-100 dark:bg-blue-800"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>
                       
                          <PlayCircle size={20} className="text-blue-600 dark:text-blue-400" />
                        
                      </span>
                      <p className="flex-1">{lesson.title}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePage;
