"use client";

import DynamicForm from "@/components/dynamic-forms/DynamicForm";
import { FormProgress } from "@/components/dynamic-forms/FormProgress";
import categories from "@/data";
import { findCategoryAndPage } from "@/lib/utils";
import { useFormStore } from "@/store/formStore";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientDashboard({
    categoryValue,
    pageValue,
}: {
    categoryValue: string;
    pageValue: string;
}) {
    const router = useRouter();
    const { isPageAccessible, getNextAccessiblePage } = useFormStore();

    // Find the category and page data from the URL parameters
    const { category, page } = findCategoryAndPage(categoryValue, pageValue);

    // Handle navigation and page access
    useEffect(() => {
        // Skip if we don't have URL parameters
        if (!categoryValue || !pageValue) return;

        // Redirect to a valid page if current page isn't accessible
        if (!category || !page || !isPageAccessible(categoryValue, pageValue)) {
            // Find the next accessible page
            const nextPage = getNextAccessiblePage();

            if (nextPage) {
                // Go to the next accessible page
                router.replace(`/dashboard/${nextPage.categoryValue}/${nextPage.pageValue}`);
            } else {
                // No pages are accessible, go to home
                router.replace("/");
            }
        }
    }, [categoryValue, pageValue, category, page, isPageAccessible, getNextAccessiblePage, router]);

    // If no parameters, redirect to first page
    if (!categoryValue || !pageValue) {
        const firstCat = categories[0];
        const firstPage = firstCat?.pages[0];

        if (firstPage) {
            router.replace(`/dashboard/${firstCat.value}/${firstPage.value}`);
            return <div className="container mx-auto py-8 text-center">Redirecting...</div>;
        }

        router.replace("/");
        return (
            <div className="container mx-auto py-8 text-center">Invalid route parameters...</div>
        );
    }

    // If category or page doesn't exist, show 404
    if (!category || !page) {
        console.error("Data not found for:", categoryValue, pageValue);
        notFound();
    }

    // Render form with progress indicator
    return (
        <div className="container mx-auto py-8 px-4">
            <FormProgress categoryValue={categoryValue} />
            <DynamicForm pageData={page} categoryValue={categoryValue} />
        </div>
    );
}
