import CourseDetails from './pages/CourseDetails'
import CourseExplore from './pages/CourseExplore'
import Home from './pages/Home.jsx'
import React from 'react';
import MainLayout from './component/MainLayout'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './pages/instructor/Dashboard'
import Sidebar from './pages/instructor/Sidebar';
import CourseTable from './pages/instructor/CourseTable';
import AddCourse from './pages/instructor/AddCourse';
import AddLesson from './pages/instructor/AddLesson';
import LecturePage from './pages/LecturePage';
import { Provider } from "react-redux";
import RoleSelection from './pages/RoleSelection';
import UserDashboard from './pages/User/UserDashboard';
import UserSidebar from './pages/User/UserSidebar';
import MyLearning from './pages/User/MyLearning';
import Login from './pages/login';
import Register from './pages/Register';
import Sidebar2 from './pages/admin/Sidebar2';
import { Instructor } from './pages/admin/Instructor';
import { AllUser } from './pages/admin/AllUser';
import { InstructorInfo } from './pages/admin/InstructorInfo';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const appRouter = createBrowserRouter([
  {

    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />

      },
      {
        path: "role-selection",
        element: <RoleSelection />
      },
      {
        path: "courseexplore",
        element: <CourseExplore />
      },
      {
        path: "course-detail/:courseId",
        element: (

          <CourseDetails />

        ),
      },
      {
        path: "course-progress/:courseId",
        element:  <LecturePage />
      
      },
      // admin routes start from here
      {
        path: "instructor",
        element:

          <Sidebar />

        ,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },

          {
            path: "course/:courseId/add_lessons",
            element: <AddLesson />,
          },
          {
            path: "course/edit/:id",
            element: <AddCourse />
          },


        ],
      },
      // User Routes
      {
        path: "user",
        element: <UserSidebar />,
        children: [
          {
            path: "dashboard",
            element: <UserDashboard />,
          },
          {
            path: "my-learning",
            element: <MyLearning />,
          },
        ],
      },

      //Admin Route
      {
        path:"admin",
        element:<Sidebar2/>,
        children:[
          {
            path:"dashboard",
            element:<AdminDashboard/>
          },
          {
            path:"instructor",
            element:<Instructor/>
          },
          {
            path:"allusers",
            element:<AllUser/>
          },
          {
            path:"instructor/:id/course",
            element:<InstructorInfo/>
          }
        ]
      }
    ]
  },
  // Auth routes
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
])
function App() {
  return (

    <main>
      <RouterProvider router={appRouter} />
    </main>

  )
}

export default App
