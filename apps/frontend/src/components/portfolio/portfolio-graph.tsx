"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAssetStore } from "@/store/asset.store";
import { AssetType, assetTypeColor } from "@/types/asset.type";
import { useState, useEffect } from "react";

const timeframes = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
  { label: "1Y", value: 365 },
  { label: "All", value: 0 },
];

const currencyFormatter = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function PortfolioGraph({
  isLargeScreen = true,
}: {
  isLargeScreen?: boolean;
}) {
  const { snapshots, getAllAssets } = useAssetStore();
  const [timeframe, setTimeframe] = useState(30); // Default to 30 days

  // in the format Aug 18, 2025
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    getAllAssets();
  }, [snapshots, getAllAssets]);

  // Filter snapshots based on selected timeframe
  const filteredSnapshots =
    timeframe > 0
      ? snapshots.slice(-timeframe) // Take only the last N snapshots
      : snapshots; // Show all snapshots if timeframe is 0

  return (
    <div
      className={`bg-component rounded-md p-6 flex flex-col gap-6 ${
        isLargeScreen ? "w-2/3" : "w-full"
      }`}
    >
      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Portfolio Performance</h3>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-md border">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-2 py-1 text-xs transition-colors hover:cursor-pointer ${
                  timeframe === tf.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                } ${tf.value === 0 ? "rounded-r-md" : ""} ${
                  tf.value === 7 ? "rounded-l-md" : ""
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full gap-6 flex-1 w-full">
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">{today}</p>
          <p className="text-3xl font-bold">
            {currencyFormatter(
              filteredSnapshots[filteredSnapshots.length - 1].networth
            )}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredSnapshots}>
            <defs>
              {Object.keys(filteredSnapshots[0]).map((key) => {
                if (key === "date") return;
                const type = key as AssetType;
                return (
                  <linearGradient
                    key={type}
                    id={type}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={assetTypeColor[type]}
                      stopOpacity={0.7}
                    />
                    <stop
                      offset="100%"
                      stopColor={assetTypeColor[type]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                );
              })}
            </defs>
            <YAxis
              tick={{ fontSize: 10, fill: "#6e727a" }}
              width={50}
              tickFormatter={(value) =>
                value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })
              }
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#6e727a" }}
              height={30}
              tickFormatter={(date) => {
                const d = new Date(date);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.keys(filteredSnapshots[0]).map((key) => {
              if (key === "date") return;
              const type = key as AssetType;
              return (
                <Area
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={assetTypeColor[type]}
                  fill={`url(#${type})`}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
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
    label?: string;
  }>;
  label?: Date | string;
}) => {
  if (active && payload && payload.length) {
    const networth = payload.find((item) => item.dataKey === "networth");

    // Format the date label properly
    const formatDate = (date: Date | string | undefined) => {
      if (date instanceof Date) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return String(date || "");
    };

    return (
      <div className="py-3 rounded-md shadow bg-background/60 backdrop-blur-sm text-xs space-y-2 min-w-52">
        <div className="flex justify-between p-3 pt-0 border-b border-border-strong">
          <span className="text-muted-foreground">{formatDate(label)}</span>
          <span className="font-bold" style={{ color: networth?.color }}>
            {currencyFormatter(networth?.value ?? 0)}
          </span>
        </div>
        <div className="flex flex-col gap-3 px-3 pt-1 pb-0">
          {payload
            .filter((item) => item.dataKey !== "networth")
            .map(
              (item) =>
                item.label !== "networth" && (
                  <div key={item.name} className="flex justify-between">
                    <span className="capitalize">{item.name}</span>
                    <span style={{ color: item.color }}>
                      {currencyFormatter(item?.value ?? 0)}
                    </span>
                  </div>
                )
            )}
        </div>
      </div>
    );
  }

  return null;
};
