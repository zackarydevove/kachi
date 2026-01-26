"use client";

import AssetsTable from "@/components/portfolio/assets-table";
import PortfolioPieChart from "@/components/portfolio/portfolio-pie-chart";
import PortfolioGraph from "@/components/portfolio/portfolio-graph";
import { useEffect, useState } from "react";
import { useAssetStore } from "@/store/asset.store";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountStore } from "@/store/account.store";
import { AssetType, assetTypeLabels } from "@/types/asset.type";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const getAllAssets = useAssetStore((state) => state.getAllAssets);
  const activeAccount = useAccountStore((state) => state.activeAccount);
  const params = useParams();
  const router = useRouter();
  const type = params.type as AssetType;

  // Validate if the type is valid
  const validTypes: AssetType[] = ["crypto", "stock", "realEstate", "cash", "exotic"];
  const isValidType = validTypes.includes(type);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1280); // xl breakpoint
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      if (activeAccount) {
        try {
          await getAllAssets();
        } catch (error) {
          console.error("Failed to load assets:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAssets();
  }, [activeAccount, getAllAssets]);

  if (!isValidType) {
    return (
      <main>
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/portfolio")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Invalid Asset Type</h1>
          </div>
          <p className="text-muted-foreground">
            The asset type "{type}" is not valid. Please go back to the portfolio page.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main>
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/portfolio")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">{assetTypeLabels[type]}</h1>
          </div>
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
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/portfolio")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">{assetTypeLabels[type]}</h1>
        </div>
        {/* Charts section */}
        <div className="flex gap-4 h-[420px]">
          <PortfolioGraph isLargeScreen={isLargeScreen} filterType={type} />
          {isLargeScreen && <PortfolioPieChart filterType={type} />}
        </div>
        {/* Assets table */}
        <AssetsTable filterType={type} />
      </div>
    </main>
  );
}
