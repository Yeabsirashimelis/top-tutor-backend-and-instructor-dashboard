import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { CourseAnalytics, LectureAnalytics, QuizAnalytics, StudentEngagement } from "@/models/courseAnalyticsModel";
import Course from "@/models/courseModel";
import Payment from "@/models/paymentModel";
import UserProgress from "@/models/userProgressModel";
import CourseReview from "@/models/courseReviewModel";

// GET /api/instructor/analytics?instructorId={id}&courseId={id}&period={7|30|90|365}
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const instructorId = req.nextUrl.searchParams.get("instructorId");
    const courseId = req.nextUrl.searchParams.get("courseId");
    const period = parseInt(req.nextUrl.searchParams.get("period") || "30");

    if (!instructorId) {
      return NextResponse.json(
        { message: "Instructor ID is required" },
        { status: 400 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    let query: any = { instructor: instructorId };
    if (courseId) {
      query.course = courseId;
    }

    // Get instructor's courses
    const courses = await Course.find({ instructor: instructorId }).select(
      "_id title coverImage"
    );
    const courseIds = courses.map((c) => c._id);

    // === AGGREGATE METRICS ===

    // Total enrollments (approved payments)
    const enrollments = await Payment.find({
      course: { $in: courseIds },
      status: "approved",
    }).countDocuments();

    // New enrollments in period
    const newEnrollments = await Payment.find({
      course: { $in: courseIds },
      status: "approved",
      createdAt: { $gte: startDate, $lte: endDate },
    }).countDocuments();

    // Total revenue
    const revenueData = await Payment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Revenue in period
    const periodRevenueData = await Payment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          status: "approved",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
        },
      },
    ]);
    const periodRevenue = periodRevenueData[0]?.revenue || 0;

    // Average rating
    const ratingData = await CourseReview.aggregate([
      {
        $match: {
          course: { $in: courseIds },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
    const averageRating = ratingData[0]?.avgRating || 0;
    const totalReviews = ratingData[0]?.totalReviews || 0;

    // Active students (activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeStudents = await UserProgress.distinct("user", {
      course: { $in: courseIds },
      lastAccessedAt: { $gte: sevenDaysAgo },
    }).then((users) => users.length);

    // Completion rate
    const progressData = await UserProgress.aggregate([
      {
        $match: {
          course: { $in: courseIds },
        },
      },
      {
        $group: {
          _id: null,
          totalProgress: { $sum: "$overallProgress" },
          count: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $gte: ["$overallProgress", 100] }, 1, 0],
            },
          },
        },
      },
    ]);
    const avgCompletion = progressData[0]
      ? progressData[0].totalProgress / progressData[0].count
      : 0;
    const completedStudents = progressData[0]?.completed || 0;

    // === ENROLLMENT TREND (last 30 days) ===
    const enrollmentTrend = await Payment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          status: "approved",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // === REVENUE TREND ===
    const revenueTrend = await Payment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          status: "approved",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // === COURSE BREAKDOWN ===
    const courseBreakdown = await Promise.all(
      courses.map(async (course) => {
        const courseEnrollments = await Payment.countDocuments({
          course: course._id,
          status: "approved",
        });

        const courseRevenue = await Payment.aggregate([
          {
            $match: {
              course: course._id,
              status: "approved",
            },
          },
          {
            $group: {
              _id: null,
              revenue: { $sum: "$amount" },
            },
          },
        ]);

        const courseRating = await CourseReview.aggregate([
          {
            $match: { course: course._id },
          },
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$rating" },
              count: { $sum: 1 },
            },
          },
        ]);

        return {
          courseId: course._id,
          title: course.title,
          coverImage: course.coverImage,
          enrollments: courseEnrollments,
          revenue: courseRevenue[0]?.revenue || 0,
          averageRating: courseRating[0]?.avgRating || 0,
          totalReviews: courseRating[0]?.count || 0,
        };
      })
    );

    // === RATING DISTRIBUTION ===
    const ratingDistribution = await CourseReview.aggregate([
      {
        $match: {
          course: { $in: courseIds },
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // === STUDENT ENGAGEMENT ===
    const engagementData = await StudentEngagement.aggregate([
      {
        $match: {
          course: { $in: courseIds },
        },
      },
      {
        $group: {
          _id: null,
          avgEngagement: { $avg: "$engagementScore" },
          atRiskCount: {
            $sum: {
              $cond: ["$atRisk", 1, 0],
            },
          },
          totalStudents: { $sum: 1 },
        },
      },
    ]);

    const response = {
      // Overview metrics
      overview: {
        totalEnrollments: enrollments,
        newEnrollments,
        totalRevenue,
        periodRevenue,
        averageRating: averageRating.toFixed(1),
        totalReviews,
        activeStudents,
        completionRate: avgCompletion.toFixed(1),
        completedStudents,
      },

      // Trends
      trends: {
        enrollments: enrollmentTrend,
        revenue: revenueTrend,
      },

      // Course breakdown
      courses: courseBreakdown,

      // Rating distribution
      ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count:
          ratingDistribution.find((r) => r._id === rating)?.count || 0,
      })),

      // Engagement
      engagement: {
        averageScore: engagementData[0]?.avgEngagement || 0,
        atRiskStudents: engagementData[0]?.atRiskCount || 0,
        totalStudents: engagementData[0]?.totalStudents || 0,
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
