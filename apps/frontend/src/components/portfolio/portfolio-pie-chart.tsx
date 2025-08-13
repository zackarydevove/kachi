"use client";

import { useAssetStore } from "@/store/asset.store";
import { AssetType, assetTypeColor, assetTypeLabels } from "@/types/asset.type";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function PortfolioPieChart() {
  const [activeIndex, setActiveIndex] = useState(-1);

  const split = useAssetStore((state) => state.split);

  // Don't add networth to the pie chart
  const splitData = Object.keys(split)
    .filter((t) => t !== "networth")
    .map((t) => {
      const type = t as AssetType;
      return {
        label: assetTypeLabels[type],
        value: split[type].value,
        split: split[type].split,
        pnl: split[type].pnl,
      };
    });

  // Show empty state if no data
  if (!splitData.length || !split.networth?.value) {
    return (
      <div className="bg-component rounded-md p-6 w-1/3 flex flex-col gap-6 relative">
        <p>Pie Chart</p>
        <div className="flex justify-center items-center w-full h-[300px]">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">No portfolio data</p>
            <p className="text-sm text-muted-foreground">
              Add some assets to see your portfolio breakdown
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-component rounded-md p-6 w-1/3 flex flex-col gap-6 relative">
      <p>Pie Chart</p>
      <div className="flex justify-center items-center w-full h-[300px] relative">
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <p className="text-2xl font-bold">
            $
            {activeIndex === -1
              ? split.networth?.value || 0
              : splitData?.[activeIndex]?.value}
          </p>
          <p className="text-xs text-muted-foreground">
            {activeIndex === -1
              ? "Total Net Worth"
              : `${splitData?.[activeIndex]?.label} • ${(
                  (splitData?.[activeIndex]?.value /
                    (split.networth?.value || 1)) *
                  100
                ).toFixed(1)}%`}
          </p>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={splitData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius="80%"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              {Object.keys(split).map((t, index) => {
                const type = t as AssetType;
                if (type === "networth") return;
                return (
                  <Cell
                    key={`cell-${type}`}
                    fill={assetTypeColor[type]}
                    fillOpacity={
                      activeIndex === -1 ? 1 : activeIndex === index ? 1 : 0.4 // Other cells faded out
                    }
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
