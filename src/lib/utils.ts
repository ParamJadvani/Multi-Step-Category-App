// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
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
    if (!category) {
        return { category: undefined, page: undefined };
    }
    const page = category.pages.find((p) => p.value === pageValue);
    return { category, page };
}
