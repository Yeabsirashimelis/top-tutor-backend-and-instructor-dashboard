import { useQuery } from "@tanstack/react-query";

export interface AnalyticsOverview {
  totalEnrollments: number;
  newEnrollments: number;
  totalRevenue: number;
  periodRevenue: number;
  averageRating: string;
  totalReviews: number;
  activeStudents: number;
  completionRate: string;
  completedStudents: number;
}

export interface AnalyticsTrend {
  _id: string;
  count?: number;
  revenue?: number;
}

export interface CourseBreakdown {
  courseId: string;
  title: string;
  coverImage?: string;
  enrollments: number;
  revenue: number;
  averageRating: number;
  totalReviews: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface EngagementData {
  averageScore: number;
  atRiskStudents: number;
  totalStudents: number;
}

export interface AnalyticsResponse {
  overview: AnalyticsOverview;
  trends: {
    enrollments: AnalyticsTrend[];
    revenue: AnalyticsTrend[];
  };
  courses: CourseBreakdown[];
  ratingDistribution: RatingDistribution[];
  engagement: EngagementData;
}

export const useGetInstructorAnalytics = (
  instructorId?: string,
  courseId?: string,
  period: number = 30
) => {
  return useQuery({
    queryKey: ["instructor-analytics", instructorId, courseId, period],
    queryFn: async () => {
      let url = `/api/instructor/analytics?instructorId=${instructorId}&period=${period}`;
      if (courseId) {
        url += `&courseId=${courseId}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json() as Promise<AnalyticsResponse>;
    },
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
