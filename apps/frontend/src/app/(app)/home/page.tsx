import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="w-f h-2/3 p-4 rounded-md bg-black flex gap-4 ">
        {/* graph */}
        <div className="w-2/3 h-f p-4 rounded-md bg-white">
          <p className="text-center text-black opacity-100">graph</p>
        </div>
        {/* camembaire */}
        <div className="w-1/3 h-f p-4 rounded-md bg-white flex flex-col">
          <div className="flex">
            <p>Allocation</p>
          </div>
          <div className="flex justify-center items-center w-full h-full">
            <div className="rounded-full bg-black w-64 h-64 flex justify-center items-center text-white">
              $4,631,534
            </div>
          </div>
        </div>
      </div>
      {/* assets */}
      <div className="w-f p-4 rounded-md bg-black flex justify-between gap-4 text-white">
        <div className="flex gap-2">
          <h1>Assets</h1>
          <p>.</p>
          <p>$4.6M</p>
        </div>
        <Button>Add asset</Button>
      </div>
    </div>
  );
}
