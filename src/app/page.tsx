"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/store/formStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw } from "lucide-react";
import categories from "@/data";

export default function Home() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { getNextAccessiblePage, resetProgress } = useFormStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleContinue = () => {
        const nextPage = getNextAccessiblePage();
        if (nextPage) {
            router.push(`/dashboard/${nextPage.categoryValue}/${nextPage.pageValue}`);
        }
    };

    const handleReset = () => {
        if (
            confirm(
                "Are you sure you want to reset all your progress? This action cannot be undone."
            )
        ) {
            resetProgress();
            // Redirect to first page of first category
            if (categories.length > 0 && categories[0].pages.length > 0) {
                router.push(`/dashboard/${categories[0].value}/${categories[0].pages[0].value}`);
            }
        }
    };

    if (!mounted) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl border border-gray-200 p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Multi-Page Form System</h1>
                <p className="text-gray-600 mb-8">
                    This system allows you to fill out forms across multiple categories. Each
                    category has multiple pages that will become accessible as you complete previous
                    ones.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        onClick={handleContinue}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                        Continue Form
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                        Reset Progress
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            <div className="max-w-3xl w-full">
                <h2 className="text-xl font-semibold mb-4">Categories Overview</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {categories.map((category) => {
                        const { completedPages, totalPages } = useFormStore().getCategoryProgress(
                            category.value
                        );
                        const progress =
                            totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

                        return (
                            <div
                                key={category.value}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow"
                            >
                                <h3 className="font-medium mb-2">{category.name}</h3>
                                <div className="text-sm text-gray-600 mb-2">
                                    {completedPages} of {totalPages} completed
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
