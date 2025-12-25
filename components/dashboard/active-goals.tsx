"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Basket {
  name: string;
  goalAmount: number;
  currentAmount: number;
  image: string | null;
}

interface ActiveGoalsProps {
  baskets: Basket[];
}

export function ActiveGoals({ baskets }: ActiveGoalsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Your Food Basket Goals
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress toward your targets
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {baskets.map((goal) => {
          const progress = (goal.currentAmount / goal.goalAmount) * 100;
          return (
            <Card key={goal.name} className="p-4 bg-accent/30 border-border/50">
              <div className="flex gap-4">
                <img
                  src={goal.image || "/placeholder.svg"}
                  alt={goal.name}
                  className="w-20 h-20 rounded-lg object-cover bg-muted"
                />
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-foreground">{goal.name}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        ₦{goal.currentAmount.toLocaleString()} / ₦
                        {goal.goalAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-primary font-medium">
                      {progress.toFixed(0)}% complete
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}
