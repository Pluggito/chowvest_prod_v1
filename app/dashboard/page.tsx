"use server";

import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { DashboardClient } from "./client-wrapper";
import { getSession } from "@/lib/auth";

import prisma from "@/lib/db";

export default async function DashboardPage() {
  const session = await getSession();

  // Protect the page
  if (!session?.user) {
    redirect("/auth");
  }

  // Fetch dashboard data
  const [wallet, baskets] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.basket.findMany({
      where: { userId: session.user.id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalSavings = baskets.reduce(
    (sum, basket) => sum + Number(basket.currentAmount),
    0
  );

  return (
    <>
      <Navigation />
      <DashboardClient
        walletBalance={Number(wallet?.balance || 0)}
        totalSavings={totalSavings}
        baskets={baskets.map((b) => ({
          id: b.id,
          name: b.name,
          goalAmount: Number(b.goalAmount),
          currentAmount: Number(b.currentAmount),
          image: b.image,
        }))}
      />
    </>
  );
}
