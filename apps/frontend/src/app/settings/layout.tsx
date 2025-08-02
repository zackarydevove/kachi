import { AppSidebar } from "@/components/app-sidebar";
import BreadcrumbSegment from "@/components/navbar/breadcrumb-segment";
import SettingNav from "@/components/settings/setting-nav";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbSegment />
            </Breadcrumb>
          </div>
        </header>
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
      </SidebarInset>
    </SidebarProvider>
  );
}
