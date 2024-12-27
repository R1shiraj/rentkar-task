import "./globals.css";
// import { ModeToggle } from "@/components/ui/mode-toggle";
// import { NavBar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          {/* <NavBar /> */}
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}
