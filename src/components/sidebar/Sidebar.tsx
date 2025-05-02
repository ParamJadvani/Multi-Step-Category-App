import { Folder, ChevronDown, ChevronUp } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import Link from "next/link";
import categories from "@/data";

type AppSidebarProps = {
    openStates: Record<string, boolean>;
    toggleDropdown: (title: string) => void;
};

type CollapsibleItem = {
    name: string;
    href?: string;
};

const CollapsibleSection = ({
    title,
    icon: Icon = Folder,
    items,
    isOpen,
    onToggle,
}: {
    title: string;
    icon?: React.ElementType;
    items: CollapsibleItem[];
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group/collapsible">
        <SidebarMenuItem>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{title}</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <SidebarMenuSub>
                    {items.map(({ name, href }) => (
                        <SidebarMenuSubItem key={name}>
                            <Link href={href || "#"}>{name}</Link>
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </SidebarMenuItem>
    </Collapsible>
);

export function AppSidebar({ openStates, toggleDropdown }: AppSidebarProps) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories.map((category) => (
                                <CollapsibleSection
                                    key={category.name}
                                    title={category.name}
                                    items={category.pages.map((page) => ({
                                        name: page.name,
                                        href: `/dashboard/${category.value}/${page.value}`,
                                    }))}
                                    isOpen={!!openStates[category.name]}
                                    onToggle={() => toggleDropdown(category.name)}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
