"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ParentSidebar({ children }: { children: React.ReactNode }) {
    const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    const toggleDropdown = (title: string) => {
        setOpenStates((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SidebarProvider>
            <AppSidebar openStates={openStates} toggleDropdown={toggleDropdown} />
            <main className="relative">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
