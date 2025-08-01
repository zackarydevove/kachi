import DeleteAccount from "./delete-account";
import PreferencesSetting from "./preferences-setting";
import ProfileSetting from "./profile-setting";

export default function MyProfile() {
  return (
    <div className="pl-2 pt-6 pr-10 flex-1">
      <div className="flex flex-col gap-10">
        <ProfileSetting />
        <PreferencesSetting />
        <hr />
        <DeleteAccount />
      </div>
    </div>
  );
}
