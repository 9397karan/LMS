import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user } = useUser();


  const saveUserAndRedirect = async (role) => {
    try {
      const userData = {
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
         role :role,
        photoUrl: user.imageUrl,
      };

      const response = await axios.post('http://localhost:5000/user', userData  
        );
      if (response.data.success) {
        if (role === 'instructor') {
          navigate('/instructor/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Role</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Select how you want to use Codetec</p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => saveUserAndRedirect('student')}
            className="w-full flex items-center justify-center px-4 py-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue as Student
          </button>
          
          <button
            onClick={() => saveUserAndRedirect('instructor')}
            className="w-full flex items-center justify-center px-4 py-4 border border-blue-500 rounded-lg shadow-sm text-lg font-medium text-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
          >
            Continue as Instructor
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
