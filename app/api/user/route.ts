import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    if (!userData || !userData.id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // 1. Convert to BigInt for the Prisma query
    const tid = BigInt(userData.id);

    let user = await prisma.user.findUnique({
      where: { telegramId: tid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: tid,
          name: userData.username || userData.first_name || "Unknown",
        },
      });
    }

    // 2. IMPORTANT: Convert BigInt to String/Number before returning JSON
    // Otherwise, JSON.stringify will fail.
    const safeUser = {
      ...user,
      telegramId: user.telegramId.toString(),
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Error processing user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
