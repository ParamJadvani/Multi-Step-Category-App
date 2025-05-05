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

            isPreviousPageCompleted: (categoryValue: string, pageIndex: number) => {
                if (pageIndex === 0) return true;

                const category = get().getCategory(categoryValue);
                if (!category) return false;

                const completedPages = get().completedPages[categoryValue] || [];
                const previousPageValue = category.pages[pageIndex - 1].value;
                return completedPages.includes(previousPageValue);
            },

            isPageAccessible: (categoryValue: string, pageValue: string) => {
                const category = get().getCategory(categoryValue);
                if (!category) return false;

                const pageIndex = category.pages.findIndex((p) => p.value === pageValue);
                if (pageIndex === -1) return false;

                return get().isPreviousPageCompleted(categoryValue, pageIndex);
            },

            markPageAsCompleted: (categoryValue: string, pageValue: string) => {
                set((state) => {
                    const categoryCompletedPages = state.completedPages[categoryValue] || [];

                    if (!categoryCompletedPages.includes(pageValue)) {
                        return {
                            completedPages: {
                                ...state.completedPages,
                                [categoryValue]: [...categoryCompletedPages, pageValue],
                            },
                        };
                    }

                    return state;
                });
            },

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

            getFormData: (categoryValue: string) => get().formData[categoryValue] || {},

            isPageCompleted: (categoryValue: string, pageValue: string) => {
                const completedPages = get().completedPages[categoryValue] || [];
                return completedPages.includes(pageValue);
            },

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

            getCategoryProgress: (categoryValue: string) => {
                const category = get().getCategory(categoryValue);
                const completedPages = get().completedPages[categoryValue] || [];
                return {
                    completedPages: completedPages.length,
                    totalPages: category?.pages.length || 0,
                };
            },

            resetProgress: () => set({ completedPages: {}, formData: {} }),
        }),
        {
            name: "form-progress-storage",
        }
    )
);
