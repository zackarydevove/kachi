import DeleteAccount from "@/components/settings/my-account/delete-account";
import PreferencesSetting from "@/components/settings/my-account/preferences-setting";

export default function Page() {
  return (
    <div className="px-4 md:pl-2 pt-6 md:pr-10 flex-1">
      <div className="flex flex-col gap-8 md:gap-10">
        <PreferencesSetting />
        <hr />
        <DeleteAccount />
      </div>
    </div>
  );
}
