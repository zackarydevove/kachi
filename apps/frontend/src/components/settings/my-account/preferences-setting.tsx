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
    <div className="flex flex-col gap-7">
      <span className="text-2xl">Preferences</span>
      <form className="flex flex-col gap-4">
        <div className="flex gap-4">
          <span>
            Language
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
          <span>
            Currency
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currencies</SelectLabel>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </div>
        <span>
          Theme
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Themes</SelectLabel>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="solarized">Solarized</SelectItem>
                <SelectItem value="pastel">Pastel</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>
      </form>
    </div>
  );
}
