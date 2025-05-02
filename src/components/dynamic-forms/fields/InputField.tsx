import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/data";
import FieldContainer from "../FieldContainer";

interface InputFieldProps {
    fieldConfig: Field;
    value: string | number | undefined;
    onChange: (value: string | number) => void;
    fieldName: string;
}

export default function InputField({ fieldConfig, value, onChange, fieldName }: InputFieldProps) {
    const inputType = ["text", "email", "password", "number", "tel"].includes(fieldConfig.type)
        ? fieldConfig.type
        : "text";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (fieldConfig.type === "number") {
            onChange(Number(e.target.value));
        } else {
            onChange(e.target.value);
        }
    };

    return (
        <FieldContainer label={fieldConfig.name} fieldName={fieldName}>
            {fieldConfig.type === "textarea" ? (
                <Textarea
                    id={fieldName}
                    value={value as string}
                    onChange={handleChange}
                    placeholder={fieldConfig.placeholder}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            ) : (
                <Input
                    id={fieldName}
                    type={inputType}
                    value={value ?? ""}
                    onChange={handleChange}
                    placeholder={fieldConfig.placeholder}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            )}
        </FieldContainer>
    );
}
