import Navbar from "@/components/Navbar";
// import Sidebar from '@/components/sidebar';
import { ModeToggle } from "@/components/ModeToggle";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      {/* <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <div>sidebar</div>
      </div> */}
      <Navbar title="title" />
      {/* <main className="md:pl-72">{children}</main> */}
      <main className="flex min-h-screen flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
