"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface InvestmentData {
  year: number;
  totalValue: number;
  contributions: number;
  interest: number;
}

interface CalculationResults {
  endBalance: number;
  totalContribution: number;
  totalInterest: number;
  yearlyData: InvestmentData[];
}

const currencyFormatter = (value: number) =>
  value?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function InvestmentCalculatorPage() {
  const [startingAmount, setStartingAmount] = useState<string>("10000");
  const [years, setYears] = useState<string>("10");
  const [returnRate, setReturnRate] = useState<string>("7");
  const [additionalContribution, setAdditionalContribution] =
    useState<string>("5000");
  const [results, setResults] = useState<CalculationResults | null>(null);

  const calculateInvestment = () => {
    const principal = parseFloat(startingAmount) || 0;
    const timeYears = parseInt(years) || 0;
    const rate = (parseFloat(returnRate) || 0) / 100;
    const contribution = parseFloat(additionalContribution) || 0;

    if (principal < 0 || timeYears < 0 || rate < 0 || contribution < 0) {
      return;
    }

    const yearlyData: InvestmentData[] = [];
    let currentBalance = principal;
    let totalContributions = principal;

    // Year 0
    yearlyData.push({
      year: 0,
      totalValue: principal,
      contributions: principal,
      interest: 0,
    });

    // Calculate for each year
    for (let year = 1; year <= timeYears; year++) {
      // Add contribution at the beginning of the year
      currentBalance += contribution;
      totalContributions += contribution;

      // Apply interest at the end of the year
      currentBalance = currentBalance * (1 + rate);

      const totalInterest = currentBalance - totalContributions;

      yearlyData.push({
        year,
        totalValue: currentBalance,
        contributions: totalContributions,
        interest: totalInterest,
      });
    }

    const finalData = yearlyData[yearlyData.length - 1];

    setResults({
      endBalance: finalData.totalValue,
      totalContribution: finalData.contributions,
      totalInterest: finalData.interest,
      yearlyData,
    });
  };

  return (
    <main>
      <div className="flex flex-col gap-6 p-4 pt-0">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[635px]">
          {/* Left Side - Input Form */}
          <div className="bg-component rounded-md p-6 flex flex-col gap-6 lg:w-1/3 lg:h-full">
            <h2 className="text-xl font-semibold">Investment Parameters</h2>

            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="starting-amount">Starting Amount (USD)</Label>
                  <Input
                    id="starting-amount"
                    type="number"
                    min="0"
                    step="100"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(e.target.value)}
                    placeholder="10000"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="years">After (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    min="1"
                    max="100"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    placeholder="10"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="return-rate">Return Rate Per Year (%)</Label>
                  <Input
                    id="return-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={returnRate}
                    onChange={(e) => setReturnRate(e.target.value)}
                    placeholder="7"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="additional-contribution">
                    Additional Contribution Per Year (USD)
                  </Label>
                  <Input
                    id="additional-contribution"
                    type="number"
                    min="0"
                    step="100"
                    value={additionalContribution}
                    onChange={(e) => setAdditionalContribution(e.target.value)}
                    placeholder="5000"
                  />
                </div>
              </div>

              <Button
                onClick={calculateInvestment}
                className="w-full mt-4"
                size="lg"
              >
                Calculate
              </Button>
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="flex-1 flex flex-col gap-6">
            {results ? (
              <>
                {/* Results Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-component rounded-md p-6 flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">End Balance</p>
                    <p className="text-2xl font-bold text-constructive">
                      {currencyFormatter(results.endBalance)}
                    </p>
                  </div>

                  <div className="bg-component rounded-md p-6 flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Total Contribution
                    </p>
                    <p className="text-2xl font-bold">
                      {currencyFormatter(results.totalContribution)}
                    </p>
                  </div>

                  <div className="bg-component rounded-md p-6 flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Total Interest
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {currencyFormatter(results.totalInterest)}
                    </p>
                  </div>
                </div>

                {/* Graph */}
                <div className="bg-component rounded-md p-6 flex flex-col gap-6 h-full">
                  <h3 className="text-lg font-semibold">
                    Investment Growth Over Time
                  </h3>
                  <div className="h-[400px] lg:h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.yearlyData}>
                        <defs>
                          <linearGradient
                            id="totalValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#22c55e"
                              stopOpacity={0.7}
                            />
                            <stop
                              offset="100%"
                              stopColor="#22c55e"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="contributions"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3b82f6"
                              stopOpacity={0.7}
                            />
                            <stop
                              offset="100%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="interest"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#a855f7"
                              stopOpacity={0.7}
                            />
                            <stop
                              offset="100%"
                              stopColor="#a855f7"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <YAxis
                          tick={{ fontSize: 10, fill: "#6e727a" }}
                          width={70}
                          tickFormatter={currencyFormatter}
                        />
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 10, fill: "#6e727a" }}
                          height={30}
                          label={{
                            value: "Years",
                            position: "insideBottom",
                            offset: -5,
                            style: { fontSize: 12, fill: "#6e727a" },
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{ paddingTop: "20px" }}
                          iconType="circle"
                        />
                        <Area
                          type="monotone"
                          dataKey="totalValue"
                          stroke="#22c55e"
                          fill="url(#totalValue)"
                          name="Total Value"
                        />
                        <Area
                          type="monotone"
                          dataKey="contributions"
                          stroke="#3b82f6"
                          fill="url(#contributions)"
                          name="Contributions"
                        />
                        <Area
                          type="monotone"
                          dataKey="interest"
                          stroke="#a855f7"
                          fill="url(#interest)"
                          name="Interest"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-component rounded-md p-12 flex items-center justify-center flex-1">
                <div className="text-center">
                  <p className="text-lg font-medium text-muted-foreground">
                    Enter your investment parameters and click Calculate
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    See how your investment could grow over time
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: number;
    color: string;
  }>;
  label?: number;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="py-3 rounded-md shadow bg-background/95 backdrop-blur-sm text-xs space-y-2 min-w-52 border border-border">
        <div className="px-3 pt-0 border-b border-border pb-2">
          <span className="text-muted-foreground font-semibold">
            Year {label}
          </span>
        </div>
        <div className="flex flex-col gap-2 px-3 pb-1">
          {payload.map((item) => (
            <div key={item.name} className="flex justify-between gap-4">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
              <span className="font-semibold" style={{ color: item.color }}>
                {currencyFormatter(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
