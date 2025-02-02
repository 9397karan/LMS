import { useEffect, useState } from "react";
import React from "react";
import SearchResult from "../component/SearchResult";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CourseExplore = () => {
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(""); // Duration filter state
    const [selectedPriceRange, setSelectedPriceRange] = useState(""); // Price filter state

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search");

  
    const getAllCourses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("https://lms-backened-mr34.onrender.com/course");
            const courses = response.data.data;
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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/courses?search=${searchTerm}`);
                console.log(response.data)
                setAllCourses(response.data);
                setFilteredCourses(response.data);
                setIsLoading(false);
            } catch (err) {
                setError("Failed to fetch courses");
                setIsLoading(false);
            }
        };

        if (searchTerm) fetchCourses();
    }, [searchTerm]);

    // Apply filters dynamically
    useEffect(() => {
        let filtered = [...allCourses];

        // Apply category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((course) =>
                selectedCategories.includes(course.category)
            );
        }

        // Apply level filter
        if (selectedLevel) {
            filtered = filtered.filter((course) => course.courseLevel === selectedLevel);
        }

        // Apply price filter
        if (selectedPriceRange) {
            if (selectedPriceRange === "Low") {
                filtered = filtered.filter((course) => course.coursePrice <= 50);
            } else if (selectedPriceRange === "Medium") {
                filtered = filtered.filter((course) => course.coursePrice > 50 && course.coursePrice <= 100);
            } else if (selectedPriceRange === "High") {
                filtered = filtered.filter((course) => course.coursePrice > 100);
            }
        }

        // Apply duration filter (example with a couple of options)
        if (selectedDuration) {
            filtered = filtered.filter((course) => course.courseDuration === selectedDuration);
        }

        // Apply sort filter
        if (sortOrder) {
            if (sortOrder === "priceLowToHigh") {
                filtered.sort((a, b) => a.coursePrice - b.coursePrice);
            } else if (sortOrder === "priceHighToLow") {
                filtered.sort((a, b) => b.coursePrice - a.coursePrice);
            }
        }

        setFilteredCourses(filtered);
    }, [selectedCategories, selectedLevel, selectedPriceRange, selectedDuration, sortOrder, allCourses]);

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        if (name === "level") {
            setSelectedLevel(value);
        } else if (name === "duration") {
            setSelectedDuration(value);
        }
    };

    const handlePriceChange = (e) => {
        const selectedPriceRange = e.target.value;
        setSortOrder(selectedPriceRange);

        let filteredByPrice = [...allCourses];

        if (selectedPriceRange === "Low") {
            filteredByPrice = filteredByPrice.filter(course => course.coursePrice <= 50);
        } else if (selectedPriceRange === "Medium") {
            filteredByPrice = filteredByPrice.filter(course => course.coursePrice > 50 && course.coursePrice <= 100);
        } else if (selectedPriceRange === "High") {
            filteredByPrice = filteredByPrice.filter(course => course.coursePrice > 100);
        }

        setFilteredCourses(filteredByPrice);
    };


    return (
        <section className="dark:bg-gray-900 w-full">
            <div className="flex max-w-7xl mx-auto p-6 flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[70vh]">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-1/4 p-6 md:p-10 bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg top-4">
                    <h3 className="text-xl font-semibold mb-4 text-center border-b pb-4">Filters</h3>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Sort By:</label>
                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="">Default</option>
                            <option value="priceLowToHigh">Price: Low to High</option>
                            <option value="priceHighToLow">Price: High to Low</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Level:</label>
                        <select
                            name="level"
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="">All</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Medium">Medium</option>
                            <option value="Advance">Advance</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Duration:</label>
                        <select
                            name="duration"
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="">All</option>
                            <option value="1 month">1 Month</option>
                            <option value="3 months">3 Months</option>
                            <option value="6 months">6 Months</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Price Range:</label>
                        <select
                            value={sortOrder}
                            onChange={handlePriceChange}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="">All</option>
                            <option value="Low">Low (&lt;= $50)</option>
                            <option value="Medium">Medium ($51 - $100)</option>
                            <option value="High">High (&gt; $100)</option>

                        </select>
                    </div>

                </aside>

                <main className="flex-1 p-6 -mt-4">
                    <h1 className="text-3xl font-bold mb-5 text-center">Explore Courses</h1>
                    {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredCourses.map(( course ) => (
                                <SearchResult key={course._id ? course._id.toString() : Date.now()} course={course} />
                            ))}

                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No courses found</p>
                    )}

                </main>
            </div>
        </section>
    );
};

export default CourseExplore;
