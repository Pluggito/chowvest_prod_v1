"use client";

import { Target, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GoalsHeaderProps {
  completedGoalsCount?: number;
  onViewDeliveries?: () => void;
}

export function GoalsHeader({
  completedGoalsCount = 0,
  onViewDeliveries,
}: GoalsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Target className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            My Chow Targets
          </h1>
          <p className="text-muted-foreground mt-1">
            Save, grow, and secure your future meals
          </p>
        </div>
      </div>

      {completedGoalsCount > 0 && (
        <Button
          onClick={onViewDeliveries}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Package className="w-4 h-4" />
          Ready for Delivery
          <Badge variant="secondary" className="ml-1 bg-white text-green-600">
            {completedGoalsCount}
          </Badge>
        </Button>
      )}
    </div>
  );
}
