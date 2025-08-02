"use client";

import { usePathname } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import React from "react";

export default function BreadcrumbSegment() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  let path = "";
  return (
    <BreadcrumbList>
      {segments.map((segment, index) => {
        path += `/${segment}`;
        const isLast = index === segments.length - 1;
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={path}>
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        );
      })}
    </BreadcrumbList>
  );
}
