import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/utils/api';
import { Activity, Book, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const AdminDashboard = () => {
    const [info, setInfo] = useState({ students: 0, instructors: 0, popularCourses: [] });

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await api.get('/course/dashboard');
            setInfo(res.data);
            console.log(res.data);
        };
        fetchDetails();
    }, []);

    return (
        <section className="dark:bg-gray-900 w-full p-6">
            <h1 className="text-4xl font-bold text-white mb-6 text-center">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-2xl rounded-lg p-4">
                    <CardHeader className="flex items-center">
                        <Activity className="w-12 h-12 mr-4" />
                        <CardTitle className="text-lg">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{info.students}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-2xl rounded-lg p-4">
                    <CardHeader className="flex items-center">
                        <Book className="w-12 h-12 mr-4" />
                        <CardTitle className="text-lg">Total Instructors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-extrabold">{info.instructors}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                    <Star className="w-6 h-6 text-yellow-500 mr-2" /> Popular Courses
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700 text-white">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="border border-gray-700 px-4 py-2">Course Name</th>
                                <th className="border border-gray-700 px-4 py-2">Level</th>
                                <th className="border border-gray-700 px-4 py-2">Price (₹)</th>
                                <th className="border border-gray-700 px-4 py-2">Enrolled Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            {info.popularCourses.map((course) => (
                                <tr key={course._id} className="text-center bg-gray-800 hover:bg-gray-700 transition">
                                    <td className="border border-gray-700 px-4 py-2">{course.courseName}</td>
                                    <td className="border border-gray-700 px-4 py-2">{course.courseLevel}</td>
                                    <td className="border border-gray-700 px-4 py-2">{course.coursePrice}</td>
                                    <td className="border border-gray-700 px-4 py-2">{course.enrolledUserCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};