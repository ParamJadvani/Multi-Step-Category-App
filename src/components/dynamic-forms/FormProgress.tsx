"use client";

import React from "react";
import { useFormStore } from "@/store/formStore";
import categories from "@/data";
import Link from "next/link";
import { Check, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormProgressProps {
    categoryValue: string;
}

export function FormProgress({ categoryValue }: FormProgressProps) {
    // Get form store functions
    const { isPageAccessible, isPageCompleted, getCategoryProgress } = useFormStore();

    // Find the current category
    const category = categories.find((cat) => cat.value === categoryValue);

    // Get progress stats for the category
    const { completedPages, totalPages } = getCategoryProgress(categoryValue);

    // Calculate percentage completed
    const progress = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

    // If category not found, don't render anything
    if (!category) return null;

    return (
        <div className="mb-8">
            {/* Header with progress stats */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{category.name}</h1>
                <div className="text-sm text-gray-500">
                    {completedPages} of {totalPages} completed ({progress}%)
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Page navigation links */}
            <div className="flex flex-wrap gap-2">
                {category.pages.map((page, index) => {
                    // Check if this page is accessible and/or completed
                    const isAccessible = isPageAccessible(categoryValue, page.value);
                    const isCompleted = isPageCompleted(categoryValue, page.value);

                    return (
                        <div key={page.value} className="flex items-center">
                            {/* Add arrow between pages (except first page) */}
                            {index > 0 && <ArrowRight className="mx-1 text-gray-400 w-4 h-4" />}

                            {isAccessible ? (
                                // Accessible page - show as link
                                <Link
                                    href={`/dashboard/${categoryValue}/${page.value}`}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium flex items-center",
                                        isCompleted
                                            ? "bg-green-100 text-green-800" // Completed style
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200" // In progress style
                                    )}
                                >
                                    {isCompleted && <Check className="w-4 h-4 mr-1" />}
                                    {page.name}
                                </Link>
                            ) : (
                                // Locked page - show as disabled
                                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 flex items-center">
                                    <Lock className="w-3 h-3 mr-1" />
                                    {page.name}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
