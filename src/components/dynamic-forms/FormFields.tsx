import React from "react";
import { Field } from "@/data";
import InputField from "./fields/InputField";
import RadioGroupField from "./fields/RadioGroupField";
import SelectField from "./fields/SelectField";
import CheckboxField from "./fields/CheckBoxField";

interface FormFieldProps {
    fieldConfig: Field;
    value: string | number | boolean | undefined;
    onChange: (value: string | number | boolean) => void;
    fieldName: string;
}

export default function FormField({ fieldConfig, value, onChange, fieldName }: FormFieldProps) {
    switch (fieldConfig.type) {
        case "radio":
            return (
                <RadioGroupField
                    fieldConfig={fieldConfig}
                    value={value as string}
                    onChange={onChange}
                    fieldName={fieldName}
                />
            );
        case "select":
            return (
                <SelectField
                    fieldConfig={fieldConfig}
                    value={value as string}
                    onChange={onChange}
                    fieldName={fieldName}
                />
            );
        case "checkbox":
            return (
                <CheckboxField
                    fieldConfig={fieldConfig}
                    value={value as boolean}
                    onChange={onChange}
                    fieldName={fieldName}
                />
            );
        default:
            return (
                <InputField
                    fieldConfig={fieldConfig}
                    value={value as string | number}
                    onChange={onChange}
                    fieldName={fieldName}
                />
            );
    }
}
