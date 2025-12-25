import prisma from "@/lib/db";

interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        metadata: params.metadata,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

/**
 * Send transaction notification
 */
export async function sendTransactionNotification(
  userId: string,
  transactionType: string,
  amount: number,
  status: string
) {
  const titles: Record<string, string> = {
    DEPOSIT: "Deposit Successful",
    TRANSFER_TO_BASKET: "Transfer Completed",
    TRANSFER_FROM_BASKET: "Funds Received",
    MARKET_PURCHASE: "Purchase Completed",
    REFUND: "Refund Processed",
  };

  const messages: Record<string, string> = {
    DEPOSIT: `Your wallet has been credited with ₦${amount.toLocaleString()}`,
    TRANSFER_TO_BASKET: `₦${amount.toLocaleString()} transferred to your savings goal`,
    TRANSFER_FROM_BASKET: `₦${amount.toLocaleString()} transferred to your wallet`,
    MARKET_PURCHASE: `Purchase of ₦${amount.toLocaleString()} completed successfully`,
    REFUND: `₦${amount.toLocaleString()} refunded to your wallet`,
  };

  await createNotification({
    userId,
    type: "transaction",
    title: titles[transactionType] || "Transaction Update",
    message:
      messages[transactionType] ||
      `Transaction of ₦${amount.toLocaleString()} ${status}`,
    link: "/wallet",
    metadata: { transactionType, amount, status },
  });
}

/**
 * Send milestone notification
 */
export async function sendMilestoneNotification(
  userId: string,
  basketName: string,
  progress: number,
  milestone: number
) {
  await createNotification({
    userId,
    type: "basket_milestone",
    title: "Goal Milestone Reached! 🎉",
    message: `Your "${basketName}" goal is now ${milestone}% complete!`,
    link: "/basket-goals",
    metadata: { basketName, progress, milestone },
  });
}

/**
 * Send goal completion notification
 */
export async function sendGoalCompletionNotification(
  userId: string,
  basketName: string,
  amount: number
) {
  await createNotification({
    userId,
    type: "basket_milestone",
    title: "Goal Completed! 🎊",
    message: `Congratulations! You've reached your "${basketName}" goal of ₦${amount.toLocaleString()}!`,
    link: "/basket-goals",
    metadata: { basketName, amount, completed: true },
  });
}

/**
 * Send security alert
 */
export async function sendSecurityAlert(
  userId: string,
  alertType: string,
  description: string
) {
  await createNotification({
    userId,
    type: "security_alert",
    title: "Security Alert",
    message: description,
    link: "/profile",
    metadata: { alertType },
  });
}

/**
 * Send auto-save notification
 */
export async function sendAutoSaveNotification(
  userId: string,
  basketName: string,
  amount: number
) {
  await createNotification({
    userId,
    type: "auto_save",
    title: "Auto-Save Completed",
    message: `₦${amount.toLocaleString()} automatically saved to "${basketName}"`,
    link: "/basket-goals",
    metadata: { basketName, amount },
  });
}
