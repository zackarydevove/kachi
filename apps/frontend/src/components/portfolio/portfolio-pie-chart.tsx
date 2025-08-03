"use client";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const mockData = [
  { name: "Crypto", value: 400 },
  { name: "Stock", value: 300 },
  { name: "Real Estate", value: 300 },
  { name: "Exotic", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PortfolioPieChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  const totalValue = mockData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="bg-[#fafafa] rounded-md p-6 w-1/3 flex flex-col gap-6 relative">
      <p>Pie Chart</p>
      <div className="flex justify-center items-center w-full h-[300px] relative">
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <p className="text-2xl font-bold">
            ${activeIndex === null ? totalValue : mockData[activeIndex].value}
          </p>
          <p className="text-xs text-muted-foreground">
            {activeIndex === null
              ? "Total Net Worth"
              : `${mockData[activeIndex].name} • ${(
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
              onMouseLeave={() => setActiveIndex(null)}
            >
              {mockData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.4 // Other cells faded out
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
