import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/data";

interface CheckboxFieldProps {
    fieldConfig: Field;
    value: boolean | undefined;
    onChange: (value: boolean) => void;
    fieldName: string;
}

export default function CheckboxField({
    fieldConfig,
    value,
    onChange,
    fieldName,
}: CheckboxFieldProps) {
    return (
        <div className="mb-4 flex items-start space-x-3">
            <Checkbox
                id={fieldName}
                checked={value}
                onChange={() => onChange(!value)}
                className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={fieldName} className="text-base font-medium text-gray-700">
                    {fieldConfig.name}
                </Label>
                {fieldConfig.placeholder && (
                    <p className="text-sm text-gray-500">{fieldConfig.placeholder}</p>
                )}
            </div>
        </div>
    );
}
