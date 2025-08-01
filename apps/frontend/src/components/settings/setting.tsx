import MyProfile from "./my-account/my-profile";
import Security from "./security/security";
import SettingNav from "./setting-nav";

export default function SettingComponent() {
  return (
    <div className="px-12 py-6">
      <div>
        <h2 className="text-3xl">Manage my account</h2>
      </div>
      <hr className="mt-6" />
      <div className="flex">
        <SettingNav />
        {/* <MyProfile /> */}
        <Security />
      </div>
    </div>
  );
}
