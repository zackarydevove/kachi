"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/user.store";

export default function SettingNav() {
  const pathname = usePathname();

  const user = useUserStore((state) => state.user);

  const links = [
    { href: "/settings", label: "My account" },
    { href: "/settings/security", label: "Security" },
  ];

  if (user?.isPro) {
    links.push({ href: "/settings/billing", label: "Billing" });
  }

  return (
    <div className="w-full md:min-w-68 md:w-auto py-6 md:pl-10 md:pr-2">
      <section className="flex flex-col gap-3">
        <span className="text-xs pl-4 hidden md:block">Manage my account</span>
        <ul className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <li key={href} className="flex-shrink-0 md:flex-shrink">
                {isActive ? (
                  <div
                    className="block text-sm rounded-sm px-4 py-3 w-full cursor-default bg-card-hover transition-colors duration-200 whitespace-nowrap"
                    aria-current="page"
                  >
                    <span>{label}</span>
                  </div>
                ) : (
                  <Link
                    href={href}
                    className="block text-sm rounded-sm px-4 py-3 w-full hover:cursor-pointer hover:bg-card-hover transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
