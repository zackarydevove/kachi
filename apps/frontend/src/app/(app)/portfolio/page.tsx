import AssetsTable from "@/components/portfolio/assets-table";
import AddAssetDialog from "@/components/portfolio/add-asset-dialog";
import PortfolioPieChart from "@/components/portfolio/portfolio-pie-chart";
import PortfolioGraph from "@/components/portfolio/portfolio-graph";

export default function Page() {
  return (
    <main>
      <div className="flex flex-col gap-6 p-4 pt-0">
        {/* up */}
        <div className="flex gap-4 h-[420px]">
          <PortfolioGraph />
          <PortfolioPieChart />
        </div>
        {/* down */}
        <div className="bg-[#fafafa] rounded-md p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <p>Assets</p>
            <AddAssetDialog />
          </div>
          <AssetsTable />
        </div>
      </div>
    </main>
  );
}
