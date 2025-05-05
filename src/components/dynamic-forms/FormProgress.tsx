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
    
    const { isPageAccessible, isPageCompleted, getCategoryProgress } = useFormStore();

   
    const category = categories.find((cat) => cat.value === categoryValue);


    const { completedPages, totalPages } = getCategoryProgress(categoryValue);

   
    const progress = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

    
    if (!category) return null;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{category.name}</h1>
                <div className="text-sm text-gray-500">
                    {completedPages} of {totalPages} completed ({progress}%)
                </div>
            </div>

    
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="flex flex-wrap gap-2">
                {category.pages.map((page, index) => {
                    const isAccessible = isPageAccessible(categoryValue, page.value);
                    const isCompleted = isPageCompleted(categoryValue, page.value);

                    return (
                        <div key={page.value} className="flex items-center">
                            {index > 0 && <ArrowRight className="mx-1 text-gray-400 w-4 h-4" />}

                            {isAccessible ? (
                                
                                <Link
                                    href={`/dashboard/${categoryValue}/${page.value}`}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium flex items-center",
                                        isCompleted
                                            ? "bg-green-100 text-green-800"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    )}
                                >
                                    {isCompleted && <Check className="w-4 h-4 mr-1" />}
                                    {page.name}
                                </Link>
                            ) : (
                                
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
