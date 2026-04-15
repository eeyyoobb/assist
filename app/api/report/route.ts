import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use the singleton!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company,
      staffRole,
      reportType,
      userId, // This is the MongoDB _id from the user object
      userName,
      socialMedia,
      officeActivity,
    } = body;

    if (!company || !staffRole || !reportType || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // IMPORTANT: MongoDB needs to know this is an ObjectId relationship
    const report = await prisma.report.create({
      data: {
        company,
        staffRole,
        reportType,
        userId, // The MongoDB ID string
        userName,
        // Using optional chaining to handle nested creation
        ...(reportType === "social_media" && socialMedia
          ? {
              socialMedia: {
                create: {
                  mediaName: socialMedia.mediaName,
                  totalPost: Number(socialMedia.totalPost),
                  totalView: Number(socialMedia.totalView),
                  totalEngagement: Number(socialMedia.totalEngagement),
                  followers: Number(socialMedia.followers),
                },
              },
            }
          : {}),
        ...(reportType === "office_activity" && officeActivity
          ? {
              officeActivity: {
                create: {
                  task: officeActivity.task,
                  consulting: {
                    create:
                      officeActivity.consulting?.map((c: any) => ({
                        name: c.name,
                        phoneNumber: c.phoneNumber,
                      })) || [],
                  },
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Report Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 },
    );
  }
}
