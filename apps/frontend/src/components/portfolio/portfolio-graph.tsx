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

const mockData = [
  { date: "01/01/2025", crypto: 132, stocks: 245 },
  { date: "02/01/2025", crypto: 187, stocks: 198 },
  { date: "03/01/2025", crypto: 143, stocks: 265 },
  { date: "04/01/2025", crypto: 212, stocks: 178 },
  { date: "05/01/2025", crypto: 156, stocks: 239 },
  { date: "06/01/2025", crypto: 174, stocks: 221 },
  { date: "07/01/2025", crypto: 199, stocks: 204 },
  { date: "08/01/2025", crypto: 168, stocks: 260 },
  { date: "09/01/2025", crypto: 183, stocks: 190 },
  { date: "10/01/2025", crypto: 145, stocks: 234 },
  { date: "11/01/2025", crypto: 210, stocks: 199 },
  { date: "12/01/2025", crypto: 195, stocks: 222 },
];

export default function PortfolioGraph() {
  return (
    <div className="bg-[#fafafa] rounded-md p-6 w-2/3 flex flex-col gap-6">
      <div className="flex justify-between gap-6 items-center">
        <p>Total Net Worth</p>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time frame</SelectLabel>
              <SelectItem value="1day">1 day</SelectItem>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="1month">1 month</SelectItem>
              <SelectItem value="yeartodate">Year to date</SelectItem>
              <SelectItem value="1year">1 year</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* chart */}
      <div className="flex flex-col h-full gap-6">
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">Aug 03, 2025</p>
          <p className="text-3xl font-bold">$891,342</p>
        </div>
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={500} height={400} data={mockData}>
              <YAxis tick={{ fontSize: 8, fill: "#6e727a" }} width={20} />
              <XAxis
                tick={{ fontSize: 8, fill: "#6e727a" }}
                dataKey="date"
                height={20}
              />
              {/* <Tooltip content={<CustomTooltip />} /> */}
              <Tooltip />
              <Area type="monotone" dataKey="crypto" />
              <Area type="monotone" dataKey="stocks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="flex flex-col gap-2 bg-white p-4">
//         <p>{label}</p>
//         <div className="flex flex-col gap-1">
//           {payload.forEach((item, idx) => (
//             <div className="flex gap-1">
//               <p>product {idx}</p>
//               <p>{item.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
// };
