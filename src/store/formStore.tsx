// src/store/formStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import categories from "@/data";
import { FormValues } from "@/types/form";

export interface FormProgress {
    completedPages: {
        [categoryValue: string]: string[];
    };
    formData: {
        [categoryValue: string]: FormValues;
    };
}

interface FormStore extends FormProgress {
    isPageAccessible: (categoryValue: string, pageValue: string) => boolean;
    markPageAsCompleted: (categoryValue: string, pageValue: string) => void;
    updateFormData: (categoryValue: string, pageData: FormValues) => void;
    getFormData: (categoryValue: string) => FormValues;
    isPageCompleted: (categoryValue: string, pageValue: string) => boolean;
    getNextAccessiblePage: () => { categoryValue: string; pageValue: string } | null;
    getCategoryProgress: (categoryValue: string) => {
        completedPages: number;
        totalPages: number;
    };
    resetProgress: () => void;
}

export const useFormStore = create<FormStore>()(
    persist(
        (set, get) => ({
            completedPages: {},
            formData: {},

            isPageAccessible: (categoryValue, pageValue) => {
                const category = categories.find((cat) => cat.value === categoryValue);
                if (!category) return false;

                
                const pageIndex = category.pages.findIndex((p) => p.value === pageValue);
                if (pageIndex === -1) return false;

                
                if (pageIndex === 0) {
                    if (categoryValue !== categories[0].value) {
                        const categoryIndex = categories.findIndex(
                            (cat) => cat.value === categoryValue
                        );
                        const previousCategory = categories[categoryIndex - 1];

                        const completedPagesInPrevCategory =
                            get().completedPages[previousCategory.value] || [];
                        return (
                            completedPagesInPrevCategory.length === previousCategory.pages.length
                        );
                    }
                    return true;
                }

                const previousPage = category.pages[pageIndex - 1];
                const completedPages = get().completedPages[categoryValue] || [];
                return completedPages.includes(previousPage.value);
            },

            markPageAsCompleted: (categoryValue, pageValue) => {
                set((state) => {
                    const completedPages = [...(state.completedPages[categoryValue] || [])];

                    if (!completedPages.includes(pageValue)) {
                        completedPages.push(pageValue);
                    }

                    return {
                        completedPages: {
                            ...state.completedPages,
                            [categoryValue]: completedPages,
                        },
                    };
                });
            },

            updateFormData: (categoryValue, pageData) => {
                set((state) => {
                    const existingData = state.formData[categoryValue] || {};

                    return {
                        formData: {
                            ...state.formData,
                            [categoryValue]: {
                                ...existingData,
                                ...pageData,
                            },
                        },
                    };
                });
            },

            getFormData: (categoryValue) => {
                return get().formData[categoryValue] || {};
            },

            isPageCompleted: (categoryValue, pageValue) => {
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

            getCategoryProgress: (categoryValue) => {
                const category = categories.find((cat) => cat.value === categoryValue);
                const completedPages = get().completedPages[categoryValue] || [];

                return {
                    completedPages: completedPages.length,
                    totalPages: category?.pages.length || 0,
                };
            },

            resetProgress: () => {
                set({ completedPages: {}, formData: {} });
            },
        }),
        {
            name: "form-progress-storage",
        }
    )
);
