"use client";

import { BadgeCheckIcon, ChevronsUpDown, Plus } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { avatarFallbackUtil } from "@/utils/avatar-fallback.util";

export function AccountSwitcher() {
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={activeAccount?.avatar}
                  alt={activeAccount?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {avatarFallbackUtil(activeAccount?.name)}
                </AvatarFallback>
              </Avatar>
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
              Accounts
            </DropdownMenuLabel>
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.name}
                onClick={() => setActiveAccount(account)}
                className="flex p-2"
              >
                <div className="flex gap-2 flex-1 items-center">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={account?.avatar} alt={account?.name} />
                    <AvatarFallback className="rounded-lg">
                      {avatarFallbackUtil(account?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{account.name}</p>
                  {activeAccount.id === account.id && (
                    <BadgeCheckIcon className="text-constructive" />
                  )}
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
