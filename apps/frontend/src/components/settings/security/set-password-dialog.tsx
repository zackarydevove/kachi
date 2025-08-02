import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SetPasswordDialog() {
  return (
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Set your password</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set password</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="new-password-1">New password</Label>
                <Input
                  id="new-password-1"
                  name="new-password"
                  defaultValue="New password"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password-1">Confirm password</Label>
                <Input
                  id="confirm-password-1"
                  name="confirm-password"
                  defaultValue="Confirm password"
                />
              </div>
            </div>
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
    </div>
  );
}
