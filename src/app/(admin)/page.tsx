"use client";

import InstructorEditProfile from "./_components/instructor-edit-profile";
import { useGetInstructor } from "./_hooks/instructor-hooks";
import { Loader } from "lucide-react";

const Home = () => {
  const { data: instructor, isLoading } = useGetInstructor();

  return (
    <div className="capitalize space-y-6">
      <div className="flex items-center space-x-2">
        <span>WELCOME TO YOUR DASHBOARD,</span>
        {instructor?.name ? (
          <span>{instructor.name}</span>
        ) : (
          <Loader className="animate-spin h-5 w-5" />
        )}
      </div>
      <InstructorEditProfile />
    </div>
  );
};

export default Home;
