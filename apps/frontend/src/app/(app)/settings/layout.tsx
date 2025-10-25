import SettingNav from "@/components/settings/setting-nav";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-6 md:px-12">
      <div>
        <h2 className="text-2xl md:text-3xl">Manage my account</h2>
      </div>
      <hr className="mt-6" />
      <div className="flex flex-col md:flex-row">
        <SettingNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
