"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const commodities = [
  { value: "rice", label: "Rice (50kg)", price: 45000, image: "/rice.jpg" },
  { value: "beans", label: "Beans (100kg)", price: 85000, image: "/beans.jpg" },
  {
    value: "maize",
    label: "Maize Seeds (10kg)",
    price: 25000,
    image: "/maize-seeds.jpg",
  },
  { value: "garri", label: "Garri (50kg)", price: 35000, image: "/garri.jpg" },
  {
    value: "yam",
    label: "Yam Tubers (100kg)",
    price: 55000,
    image: "/yam-tubers.jpg",
  },
  {
    value: "cassava",
    label: "Cassava (100kg)",
    price: 40000,
    image: "/cassava-stems.jpg",
  },
];

interface CreateGoalCardProps {
  onGoalCreated?: () => void;
}

export function CreateGoalCard({ onGoalCreated }: CreateGoalCardProps) {
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGoal = async () => {
    if (!selectedCommodity || !targetAmount || !targetDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const commodity = commodities.find((c) => c.value === selectedCommodity);
    if (!commodity) return;

    try {
      setIsLoading(true);

      await axios.post("/api/baskets", {
        name: commodity.label,
        commodityType: commodity.value,
        image: commodity.image,
        goalAmount: parseFloat(targetAmount),
        targetDate,
        regularTopUp: Math.round(parseFloat(targetAmount) / 10),
        description: `Saving for ${commodity.label}`,
      });

      toast.success("Goal created successfully!");

      // Reset form
      setSelectedCommodity("");
      setTargetAmount("");
      setTargetDate("");

      // Trigger refresh
      if (onGoalCreated) {
        onGoalCreated();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create goal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommodityChange = (value: string) => {
    setSelectedCommodity(value);
    const commodity = commodities.find((c) => c.value === value);
    if (commodity) {
      setTargetAmount(commodity.price.toString());
    }
  };

  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Create New Goal
        </h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="commodity">Select Commodity</Label>
          <Select
            value={selectedCommodity}
            onValueChange={handleCommodityChange}
          >
            <SelectTrigger id="commodity">
              <SelectValue placeholder="Choose a commodity" />
            </SelectTrigger>
            <SelectContent>
              {commodities.map((commodity) => (
                <SelectItem key={commodity.value} value={commodity.value}>
                  {commodity.label} - ₦{commodity.price.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target">Target Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              ₦
            </span>
            <Input
              id="target"
              type="number"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="pl-8"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Target Date</Label>
          <Input
            id="deadline"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={isLoading}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <Button
          className="w-full mt-4"
          onClick={handleCreateGoal}
          disabled={
            isLoading || !selectedCommodity || !targetAmount || !targetDate
          }
        >
          {isLoading ? "Creating..." : "Create Goal"}
        </Button>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-accent/30">
        <p className="text-xs text-muted-foreground text-center">
          Set your food goals, save steadily, and grow your Chowvest basket.
        </p>
      </div>
    </Card>
  );
}
