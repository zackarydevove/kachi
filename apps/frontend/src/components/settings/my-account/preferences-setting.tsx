import { Input } from "../../ui/input";

export default function PreferencesSetting() {
  return (
    <div className="flex flex-col gap-7">
      <span className="text-2xl">Preferences</span>
      <form className="flex flex-col gap-4">
        <div className="flex gap-4">
          <span>
            Language
            <Input
              type="text"
              placeholder="Robert"
              // onChange={(e) => setPassword(e.target.value)}
            />
          </span>
          <span>
            Currency
            <Input
              type="text"
              placeholder="Robert"
              // onChange={(e) => setPassword(e.target.value)}
            />
          </span>
        </div>
        <span>
          Theme
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
