import { AuthInitializer } from "@/components/auth-initializer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthInitializer />
      <body>{children}</body>
    </html>
  );
}
