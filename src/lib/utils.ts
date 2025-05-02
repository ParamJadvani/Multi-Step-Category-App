// lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import categories, { Category, Page } from "@/data";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function findCategoryAndPage(
    categoryValue: string,
    pageValue: string
): { category: Category | undefined; page: Page | undefined } {
    const category = categories.find((cat) => cat.value === categoryValue);
    const page = category?.pages.find((p) => p.value === pageValue);
    return { category, page };
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}
