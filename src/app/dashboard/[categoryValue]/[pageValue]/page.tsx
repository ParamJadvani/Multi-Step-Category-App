// src/app/dashboard/[categoryValue]/[pageValue]/page.tsx

import CLientDashboard from "@/components/ClientDashboard";

interface DynamicFormPageProps {
    params: Promise<{
        categoryValue: string;
        pageValue: string;
    }>;
}

export default async function DynamicFormPage({ params }: DynamicFormPageProps) {
    const { categoryValue, pageValue } = await params;
    return <CLientDashboard categoryValue={categoryValue} pageValue={pageValue} />;
}
