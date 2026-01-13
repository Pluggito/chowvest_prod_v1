import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAction } from "@/lib/audit";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+ (if using recent version, but safe to await)
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const basket = await prisma.basket.findUnique({
      where: { id },
    });

    if (!basket) {
      return NextResponse.json({ error: "Basket not found" }, { status: 404 });
    }

    if (basket.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // specific logic: if basket has funds, we might want to prevent deletion or refund.
    // For now, we'll allow deletion only if funds are zero, OR we just mark it as CANCELLED (Soft delete).
    // Soft delete is safer.

    if (Number(basket.currentAmount) > 0) {
      // If there are funds, we shouldn't just delete/cancel without handling them.
      // For this task, I'll return an error to be safe.
      // Or if the user really wants to delete, they should withdraw first?
      // Let's allow cancelling but warn? No, UI just says "Delete".
      // Let's try to be smart. If funds > 0, we can't delete.

      return NextResponse.json(
        {
          error:
            "Cannot delete a goal with funds. Please withdraw/transfer funds first.",
        },
        { status: 400 }
      );
    }

    // Soft delete by setting status to CANCELLED
    // Check if CANCELLED is a valid status in schema. Yup, "enum BasketStatus { ACTIVE COMPLETED PAUSED CANCELLED }"

    const updatedBasket = await prisma.basket.update({
      where: { id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    await logAction({
      userId: session.user.id,
      action: "basket_cancelled",
      category: "financial",
      description: `Cancelled basket: ${basket.name}`,
      metadata: { basketId: id },
    });

    return NextResponse.json({ success: true, basket: updatedBasket });
  } catch (error) {
    console.error("Delete basket error:", error);
    return NextResponse.json(
      { error: "Failed to delete basket" },
      { status: 500 }
    );
  }
}
