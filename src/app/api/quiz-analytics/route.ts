import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import QuizAnalytics from "@/models/quizAnalyticsModel";

// POST /api/quiz-analytics - Save quiz analytics
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    const analytics = await QuizAnalytics.create(data);

    return NextResponse.json(
      { 
        message: "Analytics saved",
        analytics 
      },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error saving quiz analytics:", error);
    return NextResponse.json(
      { message: "Failed to save analytics" },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// GET /api/quiz-analytics - Get quiz analytics (for instructors)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const quizId = req.nextUrl.searchParams.get("quizId");
    const courseId = req.nextUrl.searchParams.get("courseId");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!quizId && !courseId) {
      return NextResponse.json(
        { message: "Quiz ID or Course ID is required" },
        { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const query: any = {};
    if (quizId) query.quiz = quizId;
    if (courseId) query.course = courseId;
    if (userId) query.user = userId;

    const analytics = await QuizAnalytics.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Calculate aggregates
    const totalAttempts = analytics.length;
    const avgScore = analytics.reduce((sum, a) => sum + a.score, 0) / totalAttempts || 0;
    const passRate = (analytics.filter(a => a.passed).length / totalAttempts * 100) || 0;
    const avgTimeSpent = analytics.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts || 0;

    // Question-level analytics
    const questionStats: any = {};
    analytics.forEach(attempt => {
      attempt.questionResults.forEach((qr: any) => {
        const key = qr.questionIndex;
        if (!questionStats[key]) {
          questionStats[key] = {
            questionIndex: qr.questionIndex,
            questionText: qr.questionText,
            questionType: qr.questionType,
            totalAttempts: 0,
            correctCount: 0,
            avgTimeSpent: 0,
            totalTimeSpent: 0,
          };
        }
        questionStats[key].totalAttempts++;
        if (qr.isCorrect) questionStats[key].correctCount++;
        questionStats[key].totalTimeSpent += qr.timeSpent || 0;
      });
    });

    // Calculate averages for questions
    Object.values(questionStats).forEach((stat: any) => {
      stat.successRate = (stat.correctCount / stat.totalAttempts * 100).toFixed(1);
      stat.avgTimeSpent = (stat.totalTimeSpent / stat.totalAttempts).toFixed(1);
    });

    return NextResponse.json(
      { 
        analytics,
        summary: {
          totalAttempts,
          avgScore: avgScore.toFixed(1),
          passRate: passRate.toFixed(1),
          avgTimeSpent: avgTimeSpent.toFixed(0),
        },
        questionStats: Object.values(questionStats),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching quiz analytics:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
