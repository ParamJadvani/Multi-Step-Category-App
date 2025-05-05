import { create } from "zustand";
import { persist } from "zustand/middleware";
import categories, { Category } from "@/data";
import { FormValues } from "@/types/form";

export interface FormProgress {
    completedPages: { [categoryValue: string]: string[] };
    formData: { [categoryValue: string]: FormValues };
}

interface FormStore extends FormProgress {
    isPageAccessible: (categoryValue: string, pageValue: string) => boolean;
    markPageAsCompleted: (categoryValue: string, pageValue: string) => void;
    updateFormData: (categoryValue: string, pageData: FormValues) => void;
    getFormData: (categoryValue: string) => FormValues;
    isPageCompleted: (categoryValue: string, pageValue: string) => boolean;
    getNextAccessiblePage: () => { categoryValue: string; pageValue: string } | null;
    getCategoryProgress: (categoryValue: string) => { completedPages: number; totalPages: number };
    resetProgress: () => void;
    getCategory: (categoryValue: string) => Category | undefined;
    isPreviousPageCompleted: (categoryValue: string, pageIndex: number) => boolean;
}

export const useFormStore = create<FormStore>()(
    persist(
        (set, get) => ({
            completedPages: {},
            formData: {},

            getCategory: (categoryValue: string) =>
                categories.find((cat) => cat.value === categoryValue),

            // Check if the previous page in the category is completed
            isPreviousPageCompleted: (categoryValue: string, pageIndex: number) => {
                const category = get().getCategory(categoryValue);
                if (!category || pageIndex === 0) return true;
                const completedPages = get().completedPages[categoryValue] || [];
                return completedPages.includes(category.pages[pageIndex - 1].value);
            },

            // Check if a page is accessible
            isPageAccessible: (categoryValue: string, pageValue: string) => {
                const category = get().getCategory(categoryValue);
                if (!category) return false;
                const pageIndex = category.pages.findIndex((p) => p.value === pageValue);
                if (pageIndex === -1) return false;
                return get().isPreviousPageCompleted(categoryValue, pageIndex);
            },

            // Mark a page as completed
            markPageAsCompleted: (categoryValue: string, pageValue: string) => {
                set((state) => {
                    const completedPages = new Set(state.completedPages[categoryValue] || []);
                    completedPages.add(pageValue);
                    return {
                        completedPages: {
                            ...state.completedPages,
                            [categoryValue]: [...completedPages],
                        },
                    };
                });
            },

            // Update form data for a category
            updateFormData: (categoryValue: string, pageData: FormValues) => {
                set((state) => {
                    const existingData = state.formData[categoryValue] || {};
                    return {
                        formData: {
                            ...state.formData,
                            [categoryValue]: { ...existingData, ...pageData },
                        },
                    };
                });
            },

            // Retrieve form data for a category
            getFormData: (categoryValue: string) => get().formData[categoryValue] || {},

            // Check if a page has been completed
            isPageCompleted: (categoryValue: string, pageValue: string) => {
                const completedPages = get().completedPages[categoryValue] || [];
                return completedPages.includes(pageValue);
            },

            // Get the next accessible and incomplete page
            getNextAccessiblePage: () => {
                for (const category of categories) {
                    for (const page of category.pages) {
                        if (
                            get().isPageAccessible(category.value, page.value) &&
                            !get().isPageCompleted(category.value, page.value)
                        ) {
                            return { categoryValue: category.value, pageValue: page.value };
                        }
                    }
                }
                return null;
            },

            // Get category progress (completed vs. total pages)
            getCategoryProgress: (categoryValue: string) => {
                const category = get().getCategory(categoryValue);
                const completedPages = get().completedPages[categoryValue] || [];
                return {
                    completedPages: completedPages.length,
                    totalPages: category?.pages.length || 0,
                };
            },

            // Reset all progress data
            resetProgress: () => set({ completedPages: {}, formData: {} }),
        }),
        {
            name: "form-progress-storage", // LocalStorage key
        }
    )
);
