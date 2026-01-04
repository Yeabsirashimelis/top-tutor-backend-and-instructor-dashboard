"use client";

import { useParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseAnalytics } from "./_components/content-analytics";
import { StudentManagement } from "./_components/student-management";
import { ContentManagement } from "./_components/content-management";
import { ReviewsManagement } from "./_components/reviews-management";
import { CourseSettings } from "./_components/content-settings";
import ChallengesManagement from "./_components/challenges-management";
import { InstructorHeader } from "./_components/instructor-header";
import { useGetCourse } from "../_hooks/course-hooks";

export default function InstructorCoursePage() {
  const { courseId } = useParams();
  const { data: course, isPending: isCourseLoading } = useGetCourse(
    courseId as string
  );

  if (isCourseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Course Not Found
          </h1>
          <p className="text-muted-foreground">
            The course you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <InstructorHeader course={course} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <CourseAnalytics course={course} />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <StudentManagement course={course} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentManagement course={course} />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewsManagement course={course} />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <ChallengesManagement courseId={courseId as string} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <CourseSettings course={course} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
