import { notFound } from "next/navigation";
import { findCategoryAndPage } from "@/lib/utils";
import DynamicForm from "@/components/dynamic-forms/DynamicForm";

export default async function DynamicFormPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;

    if (!slug || slug.length !== 2) {
        console.error("Invalid slug:", slug);
        notFound();
    }

    const [categoryValue, pageValue] = slug;
    const { category, page } = findCategoryAndPage(categoryValue, pageValue);

    if (!category || !page) {
        console.error("Category or Page not found for:", categoryValue, pageValue);
        notFound();
    }

    return (
        <div className="container mx-auto py-8">
            <DynamicForm pageData={page} />
        </div>
    );
}
