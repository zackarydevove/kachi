import { AuthInitializer } from "@/components/auth-initializer";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthInitializer />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={["light", "dark", "solarized", "pastel"]}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
