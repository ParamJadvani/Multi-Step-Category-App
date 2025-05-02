// src/app/dashboard/[categoryValue]/[pageValue]/page.tsx
"use client";

import React, { useEffect } from "react"; // Import React if using React features like useEffect
import { notFound, useRouter } from "next/navigation";
import { findCategoryAndPage } from "@/lib/utils";
import { useFormStore } from "@/store/formStore";
import categories from "@/data";
import { FormProgress } from "@/components/dynamic-forms/FormProgress";
import DynamicForm from "@/components/dynamic-forms/DynamicForm";

// Define the expected structure of the params prop
interface DynamicFormPageProps {
    params: {
        categoryValue: string;
        pageValue: string;
    };
}

export default function DynamicFormPage({ params }: DynamicFormPageProps) {
    const router = useRouter();
    const { isPageAccessible, getNextAccessiblePage } = useFormStore();

    // Access params directly from props
    const { categoryValue, pageValue } = params;

    // Validate params presence early

    // Find category and page data using the validated params
    const { category, page } = findCategoryAndPage(categoryValue, pageValue);

    // Handle case where category or page is not found

    // Check accessibility and redirect if necessary (Runs after initial render and on dependency change)
    useEffect(() => {
        // Ensure category and page are found before checking accessibility
        if (category && page && !isPageAccessible(categoryValue, pageValue)) {
            const nextAccessiblePage = getNextAccessiblePage();
            console.log("Redirecting: Page not accessible. Next:", nextAccessiblePage);
            if (nextAccessiblePage) {
                // Use replace to avoid adding incorrect history entries
                router.replace(
                    `/dashboard/${nextAccessiblePage.categoryValue}/${nextAccessiblePage.pageValue}`
                );
            } else {
                router.replace("/"); // Redirect home if no other page is accessible
            }
        }
        // Dependencies: Check when route changes or accessibility status might change
    }, [categoryValue, pageValue, category, page, isPageAccessible, getNextAccessiblePage, router]);

    if (!categoryValue || !pageValue) {
        console.error("Invalid route params received:", params);
        // Redirect logic if params are missing
        const firstCat = categories[0];
        if (firstCat && firstCat.pages.length > 0) {
            router.replace(`/dashboard/${firstCat.value}/${firstCat.pages[0].value}`);
        } else {
            router.replace("/");
        }
        return (
            <div className="container mx-auto py-8 text-center">Invalid route parameters...</div>
        ); // Render placeholder during redirect
    }

    if (!category || !page) {
        console.error("Data not found for:", categoryValue, pageValue);
        notFound(); // Trigger Next.js 404 page
    }

    // Render loading/redirecting state if data isn't ready or access check hasn't passed yet
    // Crucially, also check access *before* attempting to render the form
    if (!category || !page || !isPageAccessible(categoryValue, pageValue)) {
        // Don't render the form if the page isn't accessible, wait for useEffect redirect
        return (
            <div className="container mx-auto py-8 text-center">Loading or checking access...</div>
        );
    }

    // Render the form and progress if data is found and page is accessible
    return (
        <div className="container mx-auto py-8 px-4">
            <FormProgress categoryValue={categoryValue} />
            <DynamicForm pageData={page} categoryValue={categoryValue} />
        </div>
    );
}
