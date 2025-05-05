"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Page } from "@/data";
import { Button } from "@/components/ui/button";
import { FormValues } from "@/types/form";
import { useFormStore } from "@/store/formStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Save, Check } from "lucide-react";
import FormField from "@/components/dynamic-forms/FormFields";

interface DynamicFormProps {
    pageData: Page;
    categoryValue: string;
}

export default function DynamicForm({ pageData, categoryValue }: DynamicFormProps) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<FormValues>({});
    const [isMounted, setIsMounted] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const {
        getFormData,
        updateFormData,
        markPageAsCompleted,
        isPageCompleted,
        getNextAccessiblePage,
    } = useFormStore();

    useEffect(() => {
        setIsMounted(true);
        const existingData = getFormData(categoryValue);
        const pageFieldNames = pageData.fields.map((field) => field.value);
        const pageValues: FormValues = {};

        for (const key of pageFieldNames) {
        
            if (existingData[key] !== undefined) {
                pageValues[key] = existingData[key];
            }
        }
        setFormValues(pageValues);
    }, [pageData, categoryValue, getFormData]);

    const handleChange = (fieldName: string, value: number | string | boolean) => {
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
        setValidationError(null);
    };

    const validateForm = (): boolean => {
        for (const field of pageData.fields) {
            if (field.required) {
                const fieldName = field.value;
                const value = formValues[fieldName];

                if (
                    value === undefined ||
                    value === null ||
                    (typeof value === "string" && value.trim() === "")
                ) {
                    setValidationError(`Field "${field.name}" is required.`);
                    return false;
                }
                if (field.type === "checkbox" && value === false) {
                    setValidationError(`Field "${field.name}" must be checked.`);
                    return false;
                }
            }
        }
        setValidationError(null);
        return true;
    };

    const saveProgress = () => {
        updateFormData(categoryValue, formValues);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        updateFormData(categoryValue, formValues);
        markPageAsCompleted(categoryValue, pageData.value);

        const nextPage = getNextAccessiblePage();
        if (nextPage) {
            router.push(`/dashboard/${nextPage.categoryValue}/${nextPage.pageValue}`);
        } else {
            // Maybe navigate to a summary or completion page?
            router.push("/");
            alert("All forms completed!");
        }
    };

    if (!isMounted) {
        return <div className="text-center p-4">Loading form...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 p-6 md:p-8 lg:p-10 max-w-3xl w-full bg-white shadow-xl rounded-xl border border-gray-200">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{pageData.name}</h2>
                    {isPageCompleted(categoryValue, pageData.value) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20">
                            <Check className="w-4 h-4 mr-1" />
                            Completed
                        </span>
                    )}
                </div>

                {validationError && (
                    <Alert variant="destructive">
                        <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                )}

                {showSaveSuccess && (
                    <Alert
                        variant="default"
                        className="bg-green-50 text-green-700 border-green-300"
                    >
                        <AlertDescription>Progress saved successfully!</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {pageData.fields.map((field) => {
                            const fieldName = field.value;
                            return (
                                <FormField
                                    key={fieldName}
                                    fieldConfig={field}
                                    value={formValues[fieldName]}
                                    onChange={(value) => handleChange(fieldName, value)}
                                    fieldName={fieldName}
                                />
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t mt-8">
                        <Button
                            type="button"
                            onClick={saveProgress}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Progress
                        </Button>

                        <Button type="submit" className="flex items-center gap-2">
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
