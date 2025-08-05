import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Pencil, Plus } from "lucide-react";

export default function EditSubAccountDialog(props: {
  type: "edit" | "create";
}) {
  const editType = props.type === "edit";

  return (
    <div onClick={(e) => e.stopPropagation()} className="z-50">
      <Dialog>
        <form>
          <DialogTrigger asChild>
            {editType ? (
              <Button variant="outline" size={"icon"} className="size-6">
                <Pencil size={1} />
              </Button>
            ) : (
              <div className="flex items-center gap-2 hover:bg-accent hover:cursor-pointer p-2 text-muted-foreground font-medium text-sm">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <p>Add team</p>
              </div>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editType ? "Edit profile" : "Create profile"}
              </DialogTitle>
              <DialogDescription>
                {editType
                  ? "Make changes to your profile here. Click save when you're done."
                  : "Create another profile here. Click create when you're done."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  defaultValue="@peduarte"
                />
              </div>
            </div>
            <DialogFooter className="flex">
              {editType && (
                <div className="flex-1">
                  <Button variant="destructive">Delete</Button>
                </div>
              )}
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                  {editType ? "Save changes" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
