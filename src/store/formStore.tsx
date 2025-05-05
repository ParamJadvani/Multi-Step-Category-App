import { create } from "zustand";
import { persist } from "zustand/middleware";
import categories, { Category } from "@/data";
import { FormValues } from "@/types/form";

/**
 * Structure for storing form progress
 */
export interface FormProgress {
    // Tracks which pages have been marked as completed
    completedPages: { [categoryValue: string]: string[] };

    // Stores form data for each category
    formData: { [categoryValue: string]: FormValues };
}

/**
 * Form store interface with all methods
 */
interface FormStore extends FormProgress {
    // Check if a page can be accessed (previous pages completed)
    isPageAccessible: (categoryValue: string, pageValue: string) => boolean;

    // Mark a page as completed
    markPageAsCompleted: (categoryValue: string, pageValue: string) => void;

    // Save form data for a category
    updateFormData: (categoryValue: string, pageData: FormValues) => void;

    // Get form data for a category
    getFormData: (categoryValue: string) => FormValues;

    // Check if a page is already completed
    isPageCompleted: (categoryValue: string, pageValue: string) => boolean;

    // Get the next page that needs to be completed
    getNextAccessiblePage: () => { categoryValue: string; pageValue: string } | null;

    // Get progress for a category (completed/total)
    getCategoryProgress: (categoryValue: string) => { completedPages: number; totalPages: number };

    // Reset all progress
    resetProgress: () => void;

    // Helper to get category data
    getCategory: (categoryValue: string) => Category | undefined;

    // Check if previous page is completed (for sequential access)
    isPreviousPageCompleted: (categoryValue: string, pageIndex: number) => boolean;
}

/**
 * Create form store with persistence
 */
export const useFormStore = create<FormStore>()(
    persist(
        (set, get) => ({
            // Initial state
            completedPages: {},
            formData: {},

            // Find a category by value
            getCategory: (categoryValue: string) =>
                categories.find((cat) => cat.value === categoryValue),

            // Check if previous page is completed (for sequential access)
            isPreviousPageCompleted: (categoryValue: string, pageIndex: number) => {
                // First page is always accessible
                if (pageIndex === 0) return true;

                // Get category data
                const category = get().getCategory(categoryValue);
                if (!category) return false;

                // Check if previous page is in completed list
                const completedPages = get().completedPages[categoryValue] || [];
                const previousPageValue = category.pages[pageIndex - 1].value;
                return completedPages.includes(previousPageValue);
            },

            // Check if a page is accessible (previous pages completed)
            isPageAccessible: (categoryValue: string, pageValue: string) => {
                const category = get().getCategory(categoryValue);
                if (!category) return false;

                // Find page index in category
                const pageIndex = category.pages.findIndex((p) => p.value === pageValue);
                if (pageIndex === -1) return false;

                // Check if previous page is completed
                return get().isPreviousPageCompleted(categoryValue, pageIndex);
            },

            // Mark a page as completed
            markPageAsCompleted: (categoryValue: string, pageValue: string) => {
                set((state) => {
                    // Get current completed pages
                    const categoryCompletedPages = state.completedPages[categoryValue] || [];

                    // Add new page if not already there
                    if (!categoryCompletedPages.includes(pageValue)) {
                        return {
                            completedPages: {
                                ...state.completedPages,
                                [categoryValue]: [...categoryCompletedPages, pageValue],
                            },
                        };
                    }

                    // No changes needed
                    return state;
                });
            },

            // Update form data for a category
            updateFormData: (categoryValue: string, pageData: FormValues) => {
                set((state) => {
                    // Merge with existing data
                    const existingData = state.formData[categoryValue] || {};
                    return {
                        formData: {
                            ...state.formData,
                            [categoryValue]: { ...existingData, ...pageData },
                        },
                    };
                });
            },

            // Get form data for a category
            getFormData: (categoryValue: string) => get().formData[categoryValue] || {},

            // Check if a page is completed
            isPageCompleted: (categoryValue: string, pageValue: string) => {
                const completedPages = get().completedPages[categoryValue] || [];
                return completedPages.includes(pageValue);
            },

            // Get the next page that needs to be completed
            getNextAccessiblePage: () => {
                // Loop through all categories and pages
                for (const category of categories) {
                    for (const page of category.pages) {
                        // Find first page that is accessible but not completed
                        if (
                            get().isPageAccessible(category.value, page.value) &&
                            !get().isPageCompleted(category.value, page.value)
                        ) {
                            return { categoryValue: category.value, pageValue: page.value };
                        }
                    }
                }
                // No more pages to complete
                return null;
            },

            // Get progress for a category (completed/total)
            getCategoryProgress: (categoryValue: string) => {
                const category = get().getCategory(categoryValue);
                const completedPages = get().completedPages[categoryValue] || [];
                return {
                    completedPages: completedPages.length,
                    totalPages: category?.pages.length || 0,
                };
            },

            // Reset all progress
            resetProgress: () => set({ completedPages: {}, formData: {} }),
        }),
        {
            name: "form-progress-storage", // LocalStorage key name
        }
    )
);
