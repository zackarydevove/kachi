"use client";

import { useAssetStore } from "@/store/asset.store";
import { AssetType, assetTypeColor, assetTypeLabels } from "@/types/asset.type";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import AddAssetDialog from "./add-asset-dialog";

export default function PortfolioPieChart({ filterType }: { filterType?: AssetType }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const split = useAssetStore((state) => state.split);

  // If filterType is provided, show individual assets of that type
  const splitData = filterType
    ? split[filterType]?.assets.map((asset) => ({
        label: asset.name,
        value: asset.value,
        split: asset.split,
        pnl: asset.pnl,
      })) || []
    : Object.keys(split)
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
  const totalValue = filterType ? split[filterType]?.value : split.networth?.value;
  
  if (!splitData.length || !totalValue) {
    return (
      <div className="bg-component rounded-md p-6 w-1/3 flex flex-col gap-6 relative">
        <p className="text-lg font-semibold">{filterType ? `${assetTypeLabels[filterType]} Breakdown` : "Pie Chart"}</p>
        <div className="flex justify-center items-center w-full h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-medium">No portfolio data</p>
              <p className="text-sm text-muted-foreground">
                {filterType ? `Add some ${assetTypeLabels[filterType].toLowerCase()} assets` : "Add some assets to see your portfolio breakdown"}
              </p>
            </div>
            <AddAssetDialog />
          </div>
        </div>
      </div>
    );
  }

  // Generate colors for individual assets when filtering
  const assetColors = filterType
    ? splitData.map((_, index) => {
        const baseColor = assetTypeColor[filterType];
        // Create variations of the base color for each asset
        const hue = parseInt(baseColor.slice(1), 16);
        const variation = (index * 40) % 360;
        return `hsl(${variation}, 70%, ${50 + (index * 10) % 30}%)`;
      })
    : [];

  return (
    <div className="bg-component rounded-md p-6 w-1/3 flex flex-col gap-6 relative">
      <p className="text-lg font-semibold">{filterType ? `${assetTypeLabels[filterType]} Breakdown` : "Pie Chart"}</p>
      <div className="flex justify-center items-center w-full h-[300px] relative">
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <p className="text-2xl font-bold">
            $
            {activeIndex === -1
              ? totalValue
              : splitData?.[activeIndex]?.value}
          </p>
          <p className="text-xs text-muted-foreground">
            {activeIndex === -1
              ? filterType ? `Total ${assetTypeLabels[filterType]}` : "Total Net Worth"
              : `${splitData?.[activeIndex]?.label} • ${(
                  (splitData?.[activeIndex]?.value /
                    (totalValue || 1)) *
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
              {filterType
                ? splitData.map((asset, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={assetColors[index]}
                      fillOpacity={
                        activeIndex === -1 ? 1 : activeIndex === index ? 1 : 0.4
                      }
                    />
                  ))
                : Object.keys(split).map((t, index) => {
                    const type = t as AssetType;
                    if (type === "networth") return null;
                    return (
                      <Cell
                        key={`cell-${type}`}
                        fill={assetTypeColor[type]}
                        fillOpacity={
                          activeIndex === -1 ? 1 : activeIndex === index ? 1 : 0.4
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
