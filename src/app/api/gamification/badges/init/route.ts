import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { initializeBadgeDefinitions } from "@/lib/badge-checker";

/**
 * GET /api/gamification/badges/init
 * Initialize all badge definitions in the database
 * Call this endpoint once to seed badges
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await initializeBadgeDefinitions();

    return NextResponse.json(
      {
        message: "Badge definitions initialized successfully",
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error initializing badges:", error);
    return NextResponse.json(
      { message: "Failed to initialize badges" },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
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
      "Access-Control-Allow-Origin": process.env.CLIENT_LINK || "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
