// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import categories, { Category, Page } from "@/data"; // Import categories and types

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
}

// Finds the category and page objects based on their slug values
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
