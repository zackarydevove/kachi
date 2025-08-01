export default function SettingNav() {
  const selected = true; // TODO: Logic for selection in setting nav
  return (
    <div className="min-w-68 py-6 pl-10 pr-2">
      <section className="flex flex-col gap-3">
        <span className="text-xs pl-4">Manage my account</span>
        <ul className="flex flex-col gap-1">
          <li>
            <a
              className={`block text-sm rounded-sm px-4 py-3 w-full hover:cursor-pointer transition-colors duration-200 ${
                selected ? "bg-slate-100" : "hover:bg-slate-100"
              }`}
              href="#"
            >
              <span>My account</span>
            </a>
          </li>
          <li>
            <a
              className="block text-sm rounded-sm px-4 py-3 w-full hover:cursor-pointer hover:bg-slate-100 transition-colors duration-200"
              href="#"
            >
              <span>Security</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
