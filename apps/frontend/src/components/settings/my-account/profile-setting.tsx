import { Input } from "../../ui/input";

export default function ProfileSetting() {
  return (
    <div className="flex flex-col gap-7">
      <span className="text-2xl">My profile</span>
      <form className="flex flex-col gap-4">
        <span className="w-[375px]">
          Email
          <Input
            type="text"
            placeholder="Robert"
            // onChange={(e) => setPassword(e.target.value)}
          />
        </span>
      </form>
    </div>
  );
}
