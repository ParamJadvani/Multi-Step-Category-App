// import { notFound } from "next/navigation";
// import { findCategoryAndPage } from "@/lib/utils";
// import DynamicForm from "@/components/dynamic-forms/DynamicForm";

// export default async function DynamicFormPage({ params }: { params: Promise<{ slug: string[] }> }) {
//     const { slug } = await params;

//     if (!slug || slug.length !== 2) {
//         console.error("Invalid slug:", slug);
//         notFound();
//     }

//     const [categoryValue, pageValue] = slug;
//     const { category, page } = findCategoryAndPage(categoryValue, pageValue);

//     if (!category || !page) {
//         console.error("Category or Page not found for:", categoryValue, pageValue);
//         notFound();
//     }

//     return (
//         <div className="container mx-auto py-8">
//             <DynamicForm pageData={page} />
//         </div>
//     );
// }

"use client";

import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { findCategoryAndPage } from "@/lib/utils";
import DynamicForm from "@/components/dynamic-forms/DynamicForm";
import { useFormStore } from "@/store/formStore";
import { FormProgress } from "@/components/dynamic-forms/FormProgress";

export default function DynamicFormPage({ params }: { params: { slug: string[] } }) {
    const router = useRouter();
    const { isPageAccessible } = useFormStore();

    if (!params.slug || params.slug.length !== 2) {
        console.error("Invalid slug:", params.slug);
        notFound();
    }

    const [categoryValue, pageValue] = params.slug;
    const { category, page } = findCategoryAndPage(categoryValue, pageValue);

    if (!category || !page) {
        console.error("Category or Page not found for:", categoryValue, pageValue);
        notFound();
    }

    // Check if this page is accessible based on form progression rules
    useEffect(() => {
        if (!isPageAccessible(categoryValue, pageValue)) {
            // Redirect to the next accessible page
            const nextAccessiblePage = useFormStore.getState().getNextAccessiblePage();
            if (nextAccessiblePage) {
                router.push(
                    `/dashboard/${nextAccessiblePage.categoryValue}/${nextAccessiblePage.pageValue}`
                );
            } else {
                // If no accessible page is found, redirect to home
                router.push("/");
            }
        }
    }, [categoryValue, pageValue, isPageAccessible, router]);

    return (
        <div className="container mx-auto py-8">
            <FormProgress categoryValue={categoryValue} />
            <DynamicForm pageData={page} categoryValue={categoryValue} />
        </div>
    );
}
