"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/user.store";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const proPlans = {
  monthly: {
    price: 20,
    link: "https://buy.stripe.com/test_8x23cubkL5Hy9Hj8Sc4ow00",
  },
  annual: {
    price: 16,
    link: "https://buy.stripe.com/test_eVq00i88z6LCbPr9Wg4ow01",
  },
};

export default function ProPage() {
  const [isAnnualPlan, setIsAnnualPlan] = useState(true);
  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-md:pb-6">
        {/* Header */}
        <div className="text-center mb-16 max-md:mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Choose Your Plan
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
            Start free and upgrade when you need more power. All plans include
            our core portfolio tracking features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-foreground">
                Free
              </CardTitle>
              <div className="text-4xl font-bold mt-2 text-foreground">
                $0
                <span className="text-lg font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <CardDescription className="text-muted-foreground">
                Perfect for getting started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">
                    Portfolio tracking & analytics
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">Asset management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">
                    Historical performance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">Mobile responsive</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-3">
                  <X className="h-5 w-5 flex-shrink-0 text-destructive" />
                  <span className="text-muted-foreground">
                    Limited to 1 Account
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <X className="h-5 w-5 flex-shrink-0 text-destructive" />
                  <span className="text-muted-foreground">
                    No Plaid integration
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <X className="h-5 w-5 flex-shrink-0 text-destructive" />
                  <span className="text-muted-foreground">
                    No real-time updates (crypto/stock API)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <X className="h-5 w-5 flex-shrink-0 text-destructive" />
                  <span className="text-muted-foreground">
                    Only manual add for assets
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 shadow-lg border-primary max-md:mt-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-foreground">
                Pro
              </CardTitle>

              {/* Tabs inside Pro card */}
              <Tabs
                value={isAnnualPlan ? "annual" : "monthly"}
                onValueChange={(value) => setIsAnnualPlan(value === "annual")}
                className="w-full"
              >
                <TabsList className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <TabsTrigger value="monthly" className="hover:cursor-pointer">
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger value="annual" className="hover:cursor-pointer">
                    Annual (Save 20%)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" className="mt-0">
                  <div className="text-4xl font-bold text-foreground">
                    $20
                    <span className="text-lg font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value="annual" className="mt-0">
                  <div className="text-4xl font-bold text-foreground">
                    $16
                    <span className="text-lg font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                </TabsContent>
              </Tabs>

              <CardDescription className="text-muted-foreground">
                For power users and teams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">Everything in Free</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">
                    Unlimited accounts (for families and companies)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">
                    Can invite members (family, partners, accountants) to an
                    account
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">
                    Automatic synchronization when connecting accounts
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-constructive" />
                  <span className="text-foreground">
                    Real-time update of your assets values
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full py-3 text-lg font-semibold">
                  <Link
                    target="_blank"
                    href={
                      proPlans[isAnnualPlan ? "annual" : "monthly"].link +
                      "?prefilled_email=" +
                      user?.email
                    }
                  >
                    Upgrade to Pro
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
