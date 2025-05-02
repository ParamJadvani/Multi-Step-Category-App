// src/app/dashboard/[categoryValue]/[pageValue]/page.tsx
"use client";

import React, { useEffect } from "react"; 
import { notFound, useRouter } from "next/navigation";
import { findCategoryAndPage } from "@/lib/utils";
import { useFormStore } from "@/store/formStore";
import categories from "@/data";
import { FormProgress } from "@/components/dynamic-forms/FormProgress";
import DynamicForm from "@/components/dynamic-forms/DynamicForm";


interface DynamicFormPageProps {
    params: {
        categoryValue: string;
        pageValue: string;
    };
}

export default function DynamicFormPage({ params }: DynamicFormPageProps) {
    const router = useRouter();
    const { isPageAccessible, getNextAccessiblePage } = useFormStore();

  
    const { categoryValue, pageValue } = params;

   
    const { category, page } = findCategoryAndPage(categoryValue, pageValue);

   
    useEffect(() => {
       
        if (category && page && !isPageAccessible(categoryValue, pageValue)) {
            const nextAccessiblePage = getNextAccessiblePage();
            console.log("Redirecting: Page not accessible. Next:", nextAccessiblePage);
            if (nextAccessiblePage) {
                router.replace(
                    `/dashboard/${nextAccessiblePage.categoryValue}/${nextAccessiblePage.pageValue}`
                );
            } else {
                router.replace("/");
            }
        }
    }, [categoryValue, pageValue, category, page, isPageAccessible, getNextAccessiblePage, router]);

    if (!categoryValue || !pageValue) {
        console.error("Invalid route params received:", params);
        const firstCat = categories[0];
        if (firstCat && firstCat.pages.length > 0) {
            router.replace(`/dashboard/${firstCat.value}/${firstCat.pages[0].value}`);
        } else {
            router.replace("/");
        }
        return (
            <div className="container mx-auto py-8 text-center">Invalid route parameters...</div>
        );
    }

    if (!category || !page) {
        console.error("Data not found for:", categoryValue, pageValue);
        notFound();
    }


    if (!category || !page || !isPageAccessible(categoryValue, pageValue)) {
        return (
            <div className="container mx-auto py-8 text-center">Loading or checking access...</div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <FormProgress categoryValue={categoryValue} />
            <DynamicForm pageData={page} categoryValue={categoryValue} />
        </div>
    );
}
