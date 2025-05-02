import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field } from "@/data";
import FieldContainer from "../FieldContainer";

interface SelectFieldProps {
    fieldConfig: Field;
    value: string | undefined;
    onChange: (value: string) => void;
    fieldName: string;
}

export default function SelectField({ fieldConfig, value, onChange, fieldName }: SelectFieldProps) {
    return (
        <FieldContainer label={fieldConfig.name} fieldName={fieldName}>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id={fieldName} className="w-full mt-1">
                    <SelectValue placeholder={fieldConfig.placeholder || "Select an option"} />
                </SelectTrigger>
                <SelectContent>
                    {(fieldConfig.options ?? []).map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FieldContainer>
    );
}
