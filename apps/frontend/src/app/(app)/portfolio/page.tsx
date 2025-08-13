"use client";

import AssetsTable from "@/components/portfolio/assets-table";
import PortfolioPieChart from "@/components/portfolio/portfolio-pie-chart";
import PortfolioGraph from "@/components/portfolio/portfolio-graph";
import { useEffect, useState } from "react";
import { useAssetStore } from "@/store/asset.store";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const getAllAssets = useAssetStore((state) => state.getAllAssets);

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      try {
        await getAllAssets();
      } catch (error) {
        console.error("Failed to load assets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [getAllAssets]);

  if (isLoading) {
    return (
      <main>
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex gap-4 h-[420px]">
            <Skeleton className="w-2/3 rounded-xl" />
            <Skeleton className="w-1/3 rounded-xl" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex flex-col gap-4 p-4 pt-0">
        {/* up */}
        <div className="flex gap-4 h-[420px]">
          <PortfolioGraph />
          <PortfolioPieChart />
        </div>
        {/* down */}
        <AssetsTable />
      </div>
    </main>
  );
}
