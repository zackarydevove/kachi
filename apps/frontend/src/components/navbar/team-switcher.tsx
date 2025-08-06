"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import EditSubAccountDialog from "./sub-accounts/edit-sub-account-dialog";
import { useAccountStore } from "@/store/account.store";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const activeAccount = useAccountStore((state) => state.activeAccount);
  const setActiveAccount = useAccountStore((state) => state.setActiveAccount);
  const accounts = useAccountStore((state) => state.accounts);

  if (!activeAccount) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <activeAccount.logo className="size-4" /> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeAccount.name}
                </span>
                {/* <span className="truncate text-xs">{activeAccount.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.name}
                onClick={() => setActiveAccount(account)}
                className="flex p-2"
              >
                <div className="flex gap-2 flex-1">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {/* TODO: Add logo for accounts */}
                    {/* <account.logo className="size-3.5 shrink-0" />  */}
                  </div>
                  {account.name}
                </div>
                <EditSubAccountDialog type="edit" account={account} />
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <EditSubAccountDialog type="create" />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
