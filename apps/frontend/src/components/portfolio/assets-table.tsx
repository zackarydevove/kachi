"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AssetsTable() {
  const groups = [
    {
      name: "Crypto",
      color: "blue",
      split: 23,
      value: 123,
      pnl: "$1,450",
      items: [
        {
          name: "BTC",
          color: "blue",
          split: 80,
          value: 123,
          pnl: "$1,000",
        },
        {
          name: "ETH",
          color: "blue",
          split: 20,
          value: 123,
          pnl: "$450",
        },
      ],
    },
    {
      name: "Stocks",
      color: "green",
      split: 37,
      value: 123,
      pnl: "$2,450",
      items: [
        {
          name: "TSLA",
          color: "green",
          split: 80,
          value: 123,
          pnl: "$1,000",
        },
        {
          name: "MSCI",
          color: "green",
          split: 20,
          value: 123,
          pnl: "$450",
        },
      ],
    },
    {
      name: "Real Estate",
      color: "red",
      split: 40,
      value: 123,
      pnl: "$2,450",
      items: [
        {
          name: "Main house",
          color: "red",
          split: 80,
          value: 123,
          pnl: "$1,000",
        },
        {
          name: "Rental",
          color: "red",
          split: 20,
          value: 123,
          pnl: "$450",
        },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <table className="border-separate border-spacing-y-2">
      <thead className="text-sm text-muted-foreground">
        <tr className="grid grid-cols-4 pr-6 py-2">
          <th className="cursor-pointer text-xs text-left">Name</th>
          <th className="cursor-pointer text-xs text-right">Split</th>
          <th className="cursor-pointer text-xs text-right">Value</th>
          <th className="cursor-pointer text-xs text-right">1Y P&L</th>
        </tr>
      </thead>

      {groups.map((group, idx) => (
        <tbody key={group.name + idx} className="rounded-md">
          {/* Parent Row */}
          <tr
            className={cn(
              "grid grid-cols-4 items-center px-6 py-3 bg-gray-100 rounded-t-md",
              openGroups[group.name] ? "rounded-t-md" : "rounded-md"
            )}
          >
            <th className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => toggleGroup(group.name)}
              >
                {openGroups[group.name] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </Button>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <Link
                href={`/portfolio/${group.name.toLowerCase()}`}
                className="font-medium ml-1 hover:underline"
              >
                {group.name}
              </Link>
            </th>
            <th className="text-right">{group.split}%</th>
            <th className="text-right">${group.value.toLocaleString()}</th>
            <th className="text-right text-green-500">{group.pnl}</th>
          </tr>

          {/* Sub-Items (conditionally rendered) */}
          {openGroups[group.name] &&
            group.items?.map((item, i, last) => (
              <tr
                key={`${group.name}-item-${i}`}
                className={cn(
                  "grid grid-cols-4 items-center px-6 py-3 bg-gray-100",
                  i === 0 && "border-t border-gray-200",
                  last && "rounded-b-md"
                )}
              >
                <td className="flex items-center gap-2">
                  <span className="bg-black w-8 h-8 rounded-full" />
                  <span className="text-sm">{item.name}</span>
                </td>
                <td className="text-right text-sm">{item.split}%</td>
                <td className="text-right text-sm">
                  ${item.value.toLocaleString()}
                </td>
                <td className="text-right text-sm text-green-500">
                  {item.pnl}
                </td>
              </tr>
            ))}
        </tbody>
      ))}
    </table>
  );
}
