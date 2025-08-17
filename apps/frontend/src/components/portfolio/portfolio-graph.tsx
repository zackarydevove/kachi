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

const currencyFormatter = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function PortfolioGraph() {
  const snapshots = useAssetStore((state) => state.snapshots);

  // Show empty state if no data
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="bg-component rounded-md p-6 w-2/3 flex flex-col gap-6">
        <div className="flex justify-between gap-6 items-center">
          <p>Total Net Worth</p>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time frame</SelectLabel>
                <SelectItem value="1month">1 month</SelectItem>
                <SelectItem value="1year">1 year</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">No portfolio data</p>
            <p className="text-sm text-muted-foreground">
              Add some assets to see your portfolio history
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-component rounded-md p-6 w-2/3 flex flex-col gap-6">
      <div className="flex justify-between gap-6 items-center">
        <p>Total Net Worth</p>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time frame</SelectLabel>
              <SelectItem value="1month">1 month</SelectItem>
              <SelectItem value="1year">1 year</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col h-full gap-6 flex-1 w-full">
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">Aug 03, 2025</p>
          <p className="text-3xl font-bold">
            {currencyFormatter(snapshots[snapshots.length - 1].networth)}
          </p>
        </div>

        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={500} height={400} data={snapshots}>
              <defs>
                {Object.keys(snapshots[0]).map((key) => {
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
                tick={{ fontSize: 8, fill: "#6e727a" }}
                width={40}
                tickFormatter={(value) =>
                  value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })
                }
              />
              <XAxis
                tick={{ fontSize: 8, fill: "#6e727a" }}
                dataKey="date"
                height={20}
              />
              <Tooltip content={<CustomTooltip />} />
              {Object.keys(snapshots[0]).map((key) => {
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
