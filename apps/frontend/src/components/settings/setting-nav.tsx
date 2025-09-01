"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export default function SettingNav() {
  const pathname = usePathname();

  const links = [
    { href: "/settings", label: "My account" },
    { href: "/settings/security", label: "Security" },
    { href: "/settings/billing", label: "Billing" },
  ];

  return (
    <div className="min-w-68 py-6 pl-10 pr-2">
      <section className="flex flex-col gap-3">
        <span className="text-xs pl-4">Manage my account</span>
        <ul className="flex flex-col gap-1">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                {isActive ? (
                  <div
                    className="block text-sm rounded-sm px-4 py-3 w-full cursor-default bg-card-hover transition-colors duration-200"
                    aria-current="page"
                  >
                    <span>{label}</span>
                  </div>
                ) : (
                  <Link
                    href={href}
                    className="block text-sm rounded-sm px-4 py-3 w-full hover:cursor-pointer hover:bg-card-hover transition-colors duration-200"
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
