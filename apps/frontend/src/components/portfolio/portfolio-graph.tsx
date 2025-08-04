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

const currencyFormatter = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const mockData = [
  {
    label: "crypto",
    color: "#059669",
    timestamps: [
      { time: "2025-01-01T00:00:00.000Z", amount: 132 },
      { time: "2025-02-01T00:00:00.000Z", amount: 187 },
      { time: "2025-03-01T00:00:00.000Z", amount: 143 },
      { time: "2025-04-01T00:00:00.000Z", amount: 212 },
      { time: "2025-05-01T00:00:00.000Z", amount: 156 },
      { time: "2025-06-01T00:00:00.000Z", amount: 174 },
      { time: "2025-07-01T00:00:00.000Z", amount: 199 },
      { time: "2025-08-01T00:00:00.000Z", amount: 168 },
      { time: "2025-09-01T00:00:00.000Z", amount: 183 },
      { time: "2025-10-01T00:00:00.000Z", amount: 145 },
      { time: "2025-11-01T00:00:00.000Z", amount: 210 },
      { time: "2025-12-01T00:00:00.000Z", amount: 195 },
    ],
  },
  {
    label: "stocks",
    color: "#CA8A04",
    timestamps: [
      { time: "2025-01-01T00:00:00.000Z", amount: 245 },
      { time: "2025-02-01T00:00:00.000Z", amount: 198 },
      { time: "2025-03-01T00:00:00.000Z", amount: 265 },
      { time: "2025-04-01T00:00:00.000Z", amount: 178 },
      { time: "2025-05-01T00:00:00.000Z", amount: 239 },
      { time: "2025-06-01T00:00:00.000Z", amount: 221 },
      { time: "2025-07-01T00:00:00.000Z", amount: 204 },
      { time: "2025-08-01T00:00:00.000Z", amount: 260 },
      { time: "2025-09-01T00:00:00.000Z", amount: 190 },
      { time: "2025-10-01T00:00:00.000Z", amount: 234 },
      { time: "2025-11-01T00:00:00.000Z", amount: 199 },
      { time: "2025-12-01T00:00:00.000Z", amount: 222 },
    ],
  },
  {
    label: "networth",
    color: "#1E40AF",
    timestamps: [
      { time: "2025-01-01T00:00:00.000Z", amount: 377 },
      { time: "2025-02-01T00:00:00.000Z", amount: 385 },
      { time: "2025-03-01T00:00:00.000Z", amount: 408 },
      { time: "2025-04-01T00:00:00.000Z", amount: 390 },
      { time: "2025-05-01T00:00:00.000Z", amount: 395 },
      { time: "2025-06-01T00:00:00.000Z", amount: 395 },
      { time: "2025-07-01T00:00:00.000Z", amount: 403 },
      { time: "2025-08-01T00:00:00.000Z", amount: 428 },
      { time: "2025-09-01T00:00:00.000Z", amount: 373 },
      { time: "2025-10-01T00:00:00.000Z", amount: 379 },
      { time: "2025-11-01T00:00:00.000Z", amount: 409 },
      { time: "2025-12-01T00:00:00.000Z", amount: 417 },
    ],
  },
];

const transformedData = mockData[0].timestamps.map((_, index) => {
  const date = new Date(mockData[0].timestamps[index].time)
    .toISOString()
    .split("T")[0];

  const point: Record<string, any> = { date };

  mockData.forEach((asset) => {
    point[asset.label] = asset.timestamps[index].amount;
  });

  return point;
});

export default function PortfolioGraph() {
  const networth = mockData.find((d) => d.label === "networth");

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
            {currencyFormatter(networth?.timestamps.at(-1)?.amount ?? 0)}
          </p>
        </div>

        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={500} height={400} data={transformedData}>
              <defs>
                {mockData.map((asset) => (
                  <linearGradient
                    key={asset.label}
                    id={asset.label}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={asset.color}
                      stopOpacity={0.7}
                    />
                    <stop
                      offset="100%"
                      stopColor={asset.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
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
              {mockData.map((asset) => (
                <Area
                  key={asset.label}
                  type="monotone"
                  dataKey={asset.label}
                  stroke={asset.color}
                  fill={`url(#${asset.label})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const networth = payload.find((item) => item.dataKey === "networth");
    return (
      <div className="py-3 rounded-md shadow bg-background/60 backdrop-blur-sm  text-xs space-y-2 min-w-52">
        <div className="flex justify-between p-3 pt-0 border-b border-border-strong">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-bold" style={{ color: networth?.color }}>
            {currencyFormatter(networth?.value ?? 0)}
          </span>
        </div>
        <div className="flex flex-col gap-3 px-3 pt-1 pb-0">
          {payload
            .filter((item) => item.dataKey !== "networth")
            .map(
              (item) =>
                item.label != "networth" && (
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
