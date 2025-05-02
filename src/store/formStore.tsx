// src/store/formStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import categories from "@/data";
import { FormValues } from "@/types/form";
// import { slugify } from "@/lib/utils";

export interface FormProgress {
    completedPages: {
        [categoryValue: string]: string[]; // Array of completed page values for each category
    };
    formData: {
        [categoryValue: string]: FormValues; // Form values for each category
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

// Function to check if all required fields in a form are filled
// const areAllRequiredFieldsFilled = (
//     formData: FormValues,
//     categoryValue: string,
//     pageValue: string
// ): boolean => {
//     const category = categories.find((cat) => cat.value === categoryValue);
//     const page = category?.pages.find((p) => p.value === pageValue);

//     if (!page) return false;

//     // Check if all required fields have values
//     return page.fields
//         .filter((field) => field.required)
//         .every((field) => {
//             const fieldName = slugify(field.name);
//             const value = formData[fieldName];

//             // For checkboxes, boolean false is a valid value
//             if (field.type === "checkbox") {
//                 return value !== undefined;
//             }

//             // For all other field types, check if value exists and is not an empty string
//             return value !== undefined && value !== "";
//         });
// };

export const useFormStore = create<FormStore>()(
    persist(
        (set, get) => ({
            completedPages: {},
            formData: {},

            isPageAccessible: (categoryValue, pageValue) => {
                const category = categories.find((cat) => cat.value === categoryValue);
                if (!category) return false;

                // Find the index of the requested page
                const pageIndex = category.pages.findIndex((p) => p.value === pageValue);
                if (pageIndex === -1) return false;

                // First page of any category is always accessible
                if (pageIndex === 0) {
                    // For categories other than the first one, check if previous category is completed
                    if (categoryValue !== categories[0].value) {
                        const categoryIndex = categories.findIndex(
                            (cat) => cat.value === categoryValue
                        );
                        const previousCategory = categories[categoryIndex - 1];

                        // Previous category should be fully completed to access this one
                        const completedPagesInPrevCategory =
                            get().completedPages[previousCategory.value] || [];
                        return (
                            completedPagesInPrevCategory.length === previousCategory.pages.length
                        );
                    }
                    return true;
                }

                // For other pages, check if previous page is completed
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
                    // Merge the new page data with existing data for the category
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
