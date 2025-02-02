import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar2 = () => {
  return (
    <div className="flex dark:bg-gray-900 mt-[70px]">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700  p-5 sticky top-0  h-screen">
        <div className="space-y-4 ">
        <Link to="dashboard" className="flex items-center gap-2 dark:text-white">
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link to="instructor" className="flex items-center gap-2 dark:text-white">
            <ChartNoAxesColumn size={22} />
            <h1>Instructor</h1>
          </Link>
          <Link to="allusers" className="flex items-center gap-2  dark:text-white">
            <SquareLibrary size={22} />
            <h1>Users</h1>
          </Link>
        </div>
      </div>
    <div className="flex-1 p-10 dark:bg-gray-900">
        <Outlet/>
      </div>
    </div>
  );
};

export default Sidebar2;