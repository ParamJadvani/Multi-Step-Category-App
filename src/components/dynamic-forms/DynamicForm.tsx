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
//         <div className="min-h-screen  flex items-center justify-center py-12">
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
import { Page } from "@/data";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormValues } from "@/types/form";
import FormField from "@/components/dynamic-forms/FormFields";

interface DynamicFormProps {
    pageData: Page;
}

export default function DynamicForm({ pageData }: DynamicFormProps) {
    const [formValues, setFormValues] = useState<FormValues>({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem(pageData.name);
            if (savedData) {
                setFormValues(JSON.parse(savedData));
            }
        }
    }, [pageData.name]);

    const handleChange = (fieldName: string, value: number | string | boolean) => {
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof window !== "undefined") {
            localStorage.setItem(pageData.name, JSON.stringify(formValues));
        }
        console.log("Form Data:", formValues);
    };

    if (!isMounted) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <form
                onSubmit={onSubmit}
                className="space-y-6 p-6 md:p-8 lg:p-10 max-w-3xl w-full bg-white shadow-lg rounded-xl border border-gray-200"
            >
                <h2 className="text-3xl font-bold text-gray-800 text-center">{pageData.name}</h2>
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
                <div className="flex justify-center mt-8">
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
