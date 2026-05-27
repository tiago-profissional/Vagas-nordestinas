"use client";

import { Sidebar } from "./Sidebar";
import Header from "./Header";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#ffffff]
        grid
        grid-cols-[280px_1fr]
        grid-rows-[80px_1fr]
        overflow-hidden
      "
    >
      <div className="col-span-2 row-start-1">
        <Header />
      </div>

      <aside className="col-start-1 row-start-2 h-[calc(100vh-80px)] overflow-y-auto">
        <Sidebar />
      </aside>

      <main className="col-start-2 row-start-2 h-[calc(100vh-80px)] min-w-0 overflow-y-auto overflow-x-hidden p-8">
        {children}
      </main>
    </div>
  );
}