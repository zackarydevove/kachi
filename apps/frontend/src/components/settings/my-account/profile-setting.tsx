import { Input } from "../../ui/input";

export default function ProfileSetting() {
  return (
    <div className="flex flex-col gap-7">
      <span className="text-2xl">My profile</span>
      <form className="flex flex-col gap-4">
        <div className="flex gap-4">
          <span>
            First Name
            <Input
              type="text"
              placeholder="Robert"
              // onChange={(e) => setPassword(e.target.value)}
            />
          </span>
          <span>
            Last Name
            <Input
              type="text"
              placeholder="Robert"
              // onChange={(e) => setPassword(e.target.value)}
            />
          </span>
        </div>
        <span>
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
