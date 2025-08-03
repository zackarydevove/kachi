import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function AddAssetDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add asset</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add an Asset to my portfolio</DialogTitle>
            <DialogDescription>
              Select xyz and fulfill information.
            </DialogDescription>
          </DialogHeader>
          {/* Type of asset -- Then click Continue/Next and the form will depend on the type of asset*/}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a type of asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Asset's type</SelectLabel>
                <SelectItem value="1day">Real Estate</SelectItem>
                <SelectItem value="7days">Stocks</SelectItem>
                <SelectItem value="1month">Crypto</SelectItem>
                <SelectItem value="yeartodate">Exotic</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter className="flex">
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Continue</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
