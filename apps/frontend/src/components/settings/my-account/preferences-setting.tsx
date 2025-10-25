"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

export default function PreferencesSetting() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      <span className="text-xl md:text-2xl">Preferences</span>
      <form className="flex flex-col gap-4">
        <span className="flex flex-col gap-2">
          <p className="text-sm md:text-base">Theme</p>
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger className="w-full max-w-[180px]">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Themes</SelectLabel>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>
      </form>
    </div>
  );
}
