// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useFormStore } from "@/store/formStore";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, RefreshCw } from "lucide-react";
// import categories from "@/data";

// export default function Home() {
//     const router = useRouter();
//     const [mounted, setMounted] = useState(false);
//     const { getNextAccessiblePage, resetProgress } = useFormStore();

//     useEffect(() => {
//         setMounted(true);
//     }, []);

//     const handleContinue = () => {
//         const nextPage = getNextAccessiblePage();
//         if (nextPage) {
//             router.push(`/dashboard/${nextPage.categoryValue}/${nextPage.pageValue}`);
//         }
//     };

//     const handleReset = () => {
//         if (
//             confirm(
//                 "Are you sure you want to reset all your progress? This action cannot be undone."
//             )
//         ) {
//             resetProgress();
//             // Redirect to first page of first category
//             if (categories.length > 0 && categories[0].pages.length > 0) {
//                 router.push(`/dashboard/${categories[0].value}/${categories[0].pages[0].value}`);
//             }
//         }
//     };

//     if (!mounted) {
//         return <div className="text-center p-4">Loading...</div>;
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
//             <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl border border-gray-200 p-8 text-center">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-4">Multi-Page Form System</h1>
//                 <p className="text-gray-600 mb-8">
//                     This system allows you to fill out forms across multiple categories. Each
//                     category has multiple pages that will become accessible as you complete previous
//                     ones.
//                 </p>

//                 <div className="flex flex-col sm:flex-row justify-center gap-4">
//                     <Button
//                         onClick={handleContinue}
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
//                     >
//                         Continue Form
//                         <ArrowRight className="w-4 h-4 ml-2" />
//                     </Button>

//                     <Button
//                         onClick={handleReset}
//                         variant="outline"
//                         className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
//                     >
//                         Reset Progress
//                         <RefreshCw className="w-4 h-4 ml-2" />
//                     </Button>
//                 </div>
//             </div>

//             <div className="max-w-3xl w-full">
//                 <h2 className="text-xl font-semibold mb-4">Categories Overview</h2>
//                 <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//                     {categories.map((category) => {
//                         const { completedPages, totalPages } = useFormStore().getCategoryProgress(
//                             category.value
//                         );
//                         const progress =
//                             totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

//                         return (
//                             <div
//                                 key={category.value}
//                                 className="bg-white p-4 rounded-lg border border-gray-200 shadow"
//                             >
//                                 <h3 className="font-medium mb-2">{category.name}</h3>
//                                 <div className="text-sm text-gray-600 mb-2">
//                                     {completedPages} of {totalPages} completed
//                                 </div>
//                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                     <div
//                                         className="bg-blue-600 h-2 rounded-full"
//                                         style={{ width: `${progress}%` }}
//                                     ></div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }

// src/app/page.tsx
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
    const { getNextAccessiblePage, resetProgress, getCategoryProgress } = useFormStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleContinue = () => {
        const nextPage = getNextAccessiblePage();
        if (nextPage) {
            router.push(`/dashboard/${nextPage.categoryValue}/${nextPage.pageValue}`);
        } else {
            // Handle case where all forms might be completed or no categories exist
            const firstCat = categories[0];
            if (firstCat && firstCat.pages.length > 0 && !isCategoryComplete(firstCat.value)) {
                router.push(`/dashboard/${firstCat.value}/${firstCat.pages[0].value}`);
            } else {
                alert("No further forms to fill or all completed!");
                // Optionally, navigate to a summary page
            }
        }
    };

    const isCategoryComplete = (catValue: string): boolean => {
        const progress = getCategoryProgress(catValue);
        return progress.totalPages > 0 && progress.completedPages === progress.totalPages;
    };

    const handleReset = () => {
        if (
            window.confirm(
                // Use window.confirm for browser confirmation
                "Are you sure you want to reset all your progress? This action cannot be undone."
            )
        ) {
            resetProgress();
            // Redirect to the very first page after reset
            if (categories.length > 0 && categories[0].pages.length > 0) {
                router.push(`/dashboard/${categories[0].value}/${categories[0].pages[0].value}`);
                // Force reload to ensure store state is fresh if needed, though Zustand should update reactively
                // window.location.reload(); // Uncomment if state inconsistencies occur after reset+redirect
            }
        }
    };

    if (!mounted) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-gray-50">
            <div className="w-full max-w-4xl space-y-10">
                <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Multi-Category Form System
                    </h1>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Welcome! Please proceed through the forms category by category. Your
                        progress will be saved automatically.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={handleContinue}
                            size="lg"
                            className="flex items-center gap-2"
                        >
                            Start / Continue Form
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        <Button
                            onClick={handleReset}
                            variant="destructive"
                            size="lg"
                            className="flex items-center gap-2"
                        >
                            Reset Progress
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="w-full">
                    <h2 className="text-2xl font-semibold mb-5 text-center text-gray-700">
                        Categories Overview
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => {
                            const { completedPages, totalPages } = getCategoryProgress(
                                category.value
                            );
                            const progress =
                                totalPages > 0
                                    ? Math.round((completedPages / totalPages) * 100)
                                    : 0;
                            const isComplete = totalPages > 0 && completedPages === totalPages;

                            return (
                                <div
                                    key={category.value}
                                    className={`bg-white p-6 rounded-lg border ${
                                        isComplete ? "border-green-300" : "border-gray-200"
                                    } shadow-md transition-shadow hover:shadow-lg`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {category.name}
                                        </h3>
                                        {isComplete && (
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Complete
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {completedPages} of {totalPages} pages completed
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                                                isComplete ? "bg-green-500" : "bg-blue-600"
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
