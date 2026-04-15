import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

// POST: Create Report
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company,
      staffRole,
      reportType,
      userId,
      userName,
      socialMedia,
      officeActivity,
    } = body;

    // Basic validation
    if (!company || !staffRole || !reportType || !userId || !userName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const data: any = {
      company,
      staffRole,
      reportType,
      userId,
      userName,
    };

    // Conditional creation
    if (reportType === "social_media" && socialMedia) {
      data.socialMedia = {
        create: {
          mediaName: socialMedia.mediaName,
          totalPost: socialMedia.totalPost,
          totalView: socialMedia.totalView,
          totalEngagement: socialMedia.totalEngagement,
          followers: socialMedia.followers,
        },
      };
    }

    if (reportType === "office_activity" && officeActivity) {
      data.officeActivity = {
        create: {
          task: officeActivity.task,
          consulting: {
            create: officeActivity.consulting || [],
          },
        },
      };
    }

    const report = await prisma.report.create({
      data,
      include: {
        socialMedia: true,
        officeActivity: {
          include: {
            consulting: true,
          },
        },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 },
    );
  }
}
