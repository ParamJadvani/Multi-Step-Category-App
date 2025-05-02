// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { Page } from "@/data";
// // import { slugify } from "@/lib/utils";
// // import { Button } from "@/components/ui/button";
// // import { FormValues } from "@/types/form";
// // import FormField from "@/components/dynamic-forms/FormFields";

// // interface DynamicFormProps {
// //     pageData: Page;
// // }

// // export default function DynamicForm({ pageData }: DynamicFormProps) {
// //     const [formValues, setFormValues] = useState<FormValues>({});
// //     const [isMounted, setIsMounted] = useState(false);

// //     useEffect(() => {
// //         setIsMounted(true);
// //         if (typeof window !== "undefined") {
// //             const savedData = localStorage.getItem(pageData.name);
// //             if (savedData) {
// //                 setFormValues(JSON.parse(savedData));
// //             }
// //         }
// //     }, [pageData.name]);

// //     const handleChange = (fieldName: string, value: number | string | boolean) => {
// //         setFormValues((prev) => ({ ...prev, [fieldName]: value }));
// //     };

// //     const onSubmit = (e: React.FormEvent) => {
// //         e.preventDefault();
// //         if (typeof window !== "undefined") {
// //             localStorage.setItem(pageData.name, JSON.stringify(formValues));
// //         }
// //         console.log("Form Data:", formValues);
// //     };

// //     if (!isMounted) {
// //         return <div className="text-center p-4">Loading...</div>;
// //     }

// //     return (
// //         <div className="min-h-screen  flex items-center justify-center py-12">
// //             <form
// //                 onSubmit={onSubmit}
// //                 className="space-y-6 p-6 md:p-8 lg:p-10 max-w-3xl w-full bg-white shadow-lg rounded-xl border border-gray-200"
// //             >
// //                 <h2 className="text-3xl font-bold text-gray-800 text-center">{pageData.name}</h2>
// //                 <div className="space-y-6">
// //                     {pageData.fields.map((field) => {
// //                         const fieldName = slugify(field.name);
// //                         return (
// //                             <FormField
// //                                 key={fieldName}
// //                                 fieldConfig={field}
// //                                 value={formValues[fieldName]}
// //                                 onChange={(value) => handleChange(fieldName, value)}
// //                                 fieldName={fieldName}
// //                             />
// //                         );
// //                     })}
// //                 </div>
// //                 <div className="flex justify-center mt-8">
// //                     <Button
// //                         type="submit"
// //                         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
// //                     >
// //                         Submit
// //                     </Button>
// //                 </div>
// //             </form>
// //         </div>
// //     );
// // }

// "use client";

// import React, { useState, useEffect } from "react";
// import { Page } from "@/data";
// import { slugify } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { FormValues } from "@/types/form";
// import FormField from "@/components/dynamic-forms/FormFields";

// interface DynamicFormProps {
//     pageData: Page;
// }

// export default function DynamicForm({ pageData }: DynamicFormProps) {
//     const [formValues, setFormValues] = useState<FormValues>({});
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//         setIsMounted(true);
//         if (typeof window !== "undefined") {
//             const savedData = localStorage.getItem(pageData.name);
//             if (savedData) {
//                 setFormValues(JSON.parse(savedData));
//             }
//         }
//     }, [pageData.name]);

//     const handleChange = (fieldName: string, value: number | string | boolean) => {
//         setFormValues((prev) => ({ ...prev, [fieldName]: value }));
//     };

//     const onSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (typeof window !== "undefined") {
//             localStorage.setItem(pageData.name, JSON.stringify(formValues));
//         }
//         console.log("Form Data:", formValues);
//     };

//     if (!isMounted) {
//         return <div className="text-center p-4">Loading...</div>;
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center py-12">
//             <form
//                 onSubmit={onSubmit}
//                 className="space-y-6 p-6 md:p-8 lg:p-10 max-w-3xl w-full bg-white shadow-lg rounded-xl border border-gray-200"
//             >
//                 <h2 className="text-3xl font-bold text-gray-800 text-center">{pageData.name}</h2>
//                 <div className="space-y-6">
//                     {pageData.fields.map((field) => {
//                         const fieldName = slugify(field.name);
//                         return (
//                             <FormField
//                                 key={fieldName}
//                                 fieldConfig={field}
//                                 value={formValues[fieldName]}
//                                 onChange={(value) => handleChange(fieldName, value)}
//                                 fieldName={fieldName}
//                             />
//                         );
//                     })}
//                 </div>
//                 <div className="flex justify-center mt-8">
//                     <Button
//                         type="submit"
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
//                     >
//                         Submit
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Page } from "@/data";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormValues } from "@/types/form";
import FormField from "@/components/dynamic-forms/FormFields";
import { useFormStore } from "@/store/formStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Save, Check } from "lucide-react";

interface DynamicFormProps {
    pageData: Page;
    categoryValue: string;
}

export default function DynamicForm({ pageData, categoryValue }: DynamicFormProps) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<FormValues>({});
    const [isMounted, setIsMounted] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        getFormData,
        updateFormData,
        markPageAsCompleted,
        isPageCompleted,
        isPageAccessible,
        getNextAccessiblePage,
    } = useFormStore();

    // Load existing form data from the store
    useEffect(() => {
        setIsMounted(true);
        const existingData = getFormData(categoryValue);

        // Filter data for fields that belong to this page
        const pageFieldNames = pageData.fields.map((field) => slugify(field.name));
        const pageValues: FormValues = {};

        for (const key of pageFieldNames) {
            if (existingData[key] !== undefined) {
                pageValues[key] = existingData[key];
            }
        }

        setFormValues(pageValues);
    }, [pageData, categoryValue, getFormData]);

    const handleChange = (fieldName: string, value: number | string | boolean) => {
        setFormValues((prev) => {
            const newValues = { ...prev, [fieldName]: value };
            return newValues;
        });
    };

    const validateForm = (): boolean => {
        // Check if all required fields are filled
        for (const field of pageData.fields) {
            if (field.required) {
                const fieldName = slugify(field.name);
                const value = formValues[fieldName];

                if (value === undefined || (typeof value === "string" && value.trim() === "")) {
                    return false;
                }
            }
        }
        return true;
    };

    const saveProgress = () => {
        updateFormData(categoryValue, formValues);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setHasError(true);
            return;
        }

        setHasError(false);

        // Update form data in store
        updateFormData(categoryValue, formValues);

        // Mark page as completed
        markPageAsCompleted(categoryValue, pageData.value);

        // Find next page to navigate to
        const nextPage = getNextAccessiblePage();
        if (nextPage) {
            router.push(`/dashboard/${nextPage.categoryValue}/${nextPage.pageValue}`);
        }
    };

    if (!isMounted) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div className="space-y-6 p-6 md:p-8 lg:p-10 max-w-3xl w-full bg-white shadow-lg rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{pageData.name}</h2>
                    {isPageCompleted(categoryValue, pageData.value) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-4 h-4 mr-1" />
                            Completed
                        </span>
                    )}
                </div>

                {hasError && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            Please fill in all required fields before proceeding.
                        </AlertDescription>
                    </Alert>
                )}

                {showSuccess && (
                    <Alert
                        variant="default"
                        className="bg-green-50 text-green-800 border-green-200"
                    >
                        <AlertDescription>Progress saved successfully!</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-6">
                        {pageData.fields.map((field) => {
                            const fieldName = slugify(field.name);
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

                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            onClick={saveProgress}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Progress
                        </Button>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
