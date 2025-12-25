"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Building2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"bank" | "card">("card");

  const quickAmounts = [5000, 10000, 20000, 50000];

  const handlePayment = async (method: "CARD" | "BANK_TRANSFER") => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Initializing payment...");

      const res = await axios.post("/api/wallet/deposit", {
        amount: parseFloat(amount),
        method,
      });

      toast.dismiss(loadingToast);

      if (res.data.success && res.data.authorizationUrl) {
        toast.success("Redirecting to Paystack...");
        setTimeout(() => {
          window.location.href = res.data.authorizationUrl;
        }, 500);
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.error || "Failed to initialize payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setAmount("");
      setActiveTab("card");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Add money to your Chowest wallet securely via Paystack
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "bank" | "card")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="w-4 h-4 mr-2" />
              Card
            </TabsTrigger>
            <TabsTrigger value="bank">
              <Building2 className="w-4 h-4 mr-2" />
              Bank Transfer
            </TabsTrigger>
          </TabsList>

          {/* Card Payment Tab */}
          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                >
                  ₦{amt / 1000}k
                </Button>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <strong>Secure Payment:</strong> Instant deposit processed
                securely through Paystack.
              </p>
            </div>

            <Button
              onClick={() => handlePayment("CARD")}
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Pay with Card"}
            </Button>
          </TabsContent>

          {/* Bank Transfer Tab */}
          <TabsContent value="bank" className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                >
                  ₦{amt / 1000}k
                </Button>
              ))}
            </div>

            <Card className="p-4 bg-muted">
              <p className="text-sm text-muted-foreground mb-2">
                Get instant account details for bank transfer
              </p>
              <p className="text-xs text-muted-foreground">
                Paystack will generate a temporary account number for you to
                transfer to. Your deposit will be confirmed automatically.
              </p>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> You&apos;ll receive unique account
                details to transfer to. Confirmation is usually instant.
              </p>
            </div>

            <Button
              onClick={() => handlePayment("BANK_TRANSFER")}
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Pay with Bank Transfer"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
