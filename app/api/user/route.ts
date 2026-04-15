import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use the singleton!
import { StaffRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Telegram sends initData. If you are passing the raw object:
    const telegramId = String(body.id || body.telegramId);

    if (!telegramId) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { telegramId: telegramId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: telegramId,
          name: body.first_name || "Guest",
          company: "Pending",
          role: StaffRole.sales,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error processing user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
