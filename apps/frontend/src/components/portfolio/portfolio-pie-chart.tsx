"use client";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const mockData = [
  { label: "Crypto", color: "#059669", value: 400 },
  { label: "Stock", color: "#CA8A04", value: 300 },
  { label: "Real Estate", color: "#FFBB28", value: 300 },
  { label: "Exotic", color: "#FF8042", value: 200 },
];

export default function PortfolioPieChart() {
  const [activeIndex, setActiveIndex] = useState(-1);

  const totalValue = mockData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="bg-component rounded-md p-6 w-1/3 flex flex-col gap-6 relative">
      <p>Pie Chart</p>
      <div className="flex justify-center items-center w-full h-[300px] relative">
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <p className="text-2xl font-bold">
            ${activeIndex === -1 ? totalValue : mockData[activeIndex].value}
          </p>
          <p className="text-xs text-muted-foreground">
            {activeIndex === -1
              ? "Total Net Worth"
              : `${mockData[activeIndex].label} • ${(
                  (mockData[activeIndex].value / totalValue) *
                  100
                ).toFixed(1)}%`}
          </p>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              innerRadius={110}
              outerRadius="100%"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              {mockData.map((asset, index) => (
                <Cell
                  key={`cell-${asset.label}`}
                  fill={asset.color}
                  fillOpacity={
                    activeIndex === -1 ? 1 : activeIndex === index ? 1 : 0.4 // Other cells faded out
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
