import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: basketId } = await params;

    // Find the basket and verify ownership
    const basket = await prisma.basket.findFirst({
      where: {
        id: basketId,
        userId: session.user.id,
      },
    });

    if (!basket) {
      return NextResponse.json({ error: "Basket not found" }, { status: 404 });
    }

    // Check if goal is completed
    if (basket.currentAmount < basket.goalAmount) {
      return NextResponse.json(
        { error: "Goal not yet completed" },
        { status: 400 }
      );
    }

    // Update basket status to DELIVERY_REQUESTED
    const updatedBasket = await prisma.basket.update({
      where: { id: basketId },
      data: {
        status: "COMPLETED",
      },
    });

    // TODO: Send notification to admin/logistics team
    // TODO: Send confirmation email/SMS to user

    return NextResponse.json({
      success: true,
      basket: {
        id: updatedBasket.id,
        status: updatedBasket.status,
      },
    });
  } catch (error) {
    console.error("Error requesting delivery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
