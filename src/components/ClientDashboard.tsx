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

    const { category, page } = findCategoryAndPage(categoryValue, pageValue);

    useEffect(() => {
        if (!categoryValue || !pageValue) return;

        if (!category || !page || !isPageAccessible(categoryValue, pageValue)) {
            const nextPage = getNextAccessiblePage();
            if (nextPage) {
                router.replace(`/dashboard/${nextPage.categoryValue}/${nextPage.pageValue}`);
            } else {
                router.replace("/");
            }
        }
    }, [categoryValue, pageValue, category, page, isPageAccessible, getNextAccessiblePage, router]);

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

    if (!category || !page) {
        console.error("Data not found for:", categoryValue, pageValue);
        notFound();
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <FormProgress categoryValue={categoryValue} />
            <DynamicForm pageData={page} categoryValue={categoryValue} />
        </div>
    );
}
