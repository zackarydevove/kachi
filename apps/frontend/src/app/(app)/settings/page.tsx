import DeleteAccount from "@/components/settings/my-account/delete-account";
import PreferencesSetting from "@/components/settings/my-account/preferences-setting";

export default function Page() {
  return (
    <div className="pl-2 pt-6 pr-10 flex-1">
      <div className="flex flex-col gap-10">
        <PreferencesSetting />
        <hr />
        <DeleteAccount />
      </div>
    </div>
  );
}
