import SettingNav from "@/components/settings/setting-nav";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-12 py-6">
      <div>
        <h2 className="text-3xl">Manage my account</h2>
      </div>
      <hr className="mt-6" />
      <div className="flex">
        <SettingNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
