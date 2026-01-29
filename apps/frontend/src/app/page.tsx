import Link from "next/link";
import { GalleryVerticalEnd, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-5" />
              </div>
              <span className="text-xl font-bold">Kachi</span>
            </div>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Track Your Net Worth with{" "}
            <span className="text-primary">Precision</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Take control of your financial future with comprehensive portfolio
            tracking, automated bank integrations, and powerful analytics.
            Visualize your wealth growth, track multiple accounts, and make
            informed investment decisions—all in one beautiful dashboard.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage your wealth
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to give you complete visibility and
            control over your financial portfolio.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Real-time Tracking",
              description:
                "Monitor your net worth across all accounts with daily snapshots and interactive charts. See exactly how your wealth grows over time with detailed performance analytics.",
            },
            {
              title: "Secure & Private",
              description:
                "Bank-level encryption protects your data. Your financial information is never shared with third parties. Two-factor authentication keeps your account secure.",
            },
            {
              title: "Bank Integration",
              description:
                "Connect your bank accounts seamlessly with Plaid integration. Automatic syncing keeps your portfolio up-to-date without manual entry. Support for thousands of financial institutions.",
            },
          ].map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that&apos;s right for you. No hidden fees, no
            surprises.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                Perfect for getting started with basic net worth tracking
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Up to 5 assets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Basic portfolio tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Monthly snapshots</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                <Star className="size-3" />
                Most Popular
              </div>
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                Advanced features for serious wealth management
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Unlimited assets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Bank account integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Daily snapshots</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/signup">Upgrade to Pro</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to take control of your finances?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of users who are already tracking their net worth
            with Kachi. Start for free with up to 5 assets, or upgrade to Pro
            for unlimited assets, bank integration, and advanced analytics.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/signup">Start Your Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <span className="font-medium">Kachi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Kachi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
