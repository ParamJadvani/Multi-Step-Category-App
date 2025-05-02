import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field } from "@/data";
import FieldContainer from "../FieldContainer";

interface RadioGroupFieldProps {
    fieldConfig: Field;
    value: string | undefined;
    onChange: (value: string) => void;
    fieldName: string;
}

export default function RadioGroupField({
    fieldConfig,
    value,
    onChange,
    fieldName,
}: RadioGroupFieldProps) {
    return (
        <FieldContainer label={fieldConfig.name} fieldName={fieldName}>
            <RadioGroup value={value} onValueChange={onChange} className="flex flex-col space-y-1">
                {(fieldConfig.options ?? []).map((option) => (
                    <div key={option} className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={option} id={`${fieldName}-${option}`} />
                        <Label htmlFor={`${fieldName}-${option}`}>{option}</Label>
                    </div>
                ))}
            </RadioGroup>
        </FieldContainer>
    );
}
