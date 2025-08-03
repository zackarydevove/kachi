import { Button } from "../../ui/button";

export default function DeleteAccount() {
  return (
    <div className="flex flex-col gap-7">
      <span className="text-2xl">Delete account</span>
      <div className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Deleting your account will permanently remove all your data and cannot
          be undone.
        </p>
        <div>
          <Button variant="destructive">I want to delete my account</Button>
        </div>
      </div>
    </div>
  );
}
