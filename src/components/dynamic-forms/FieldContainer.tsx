import React from "react";
import { Label } from "@/components/ui/label";

interface FieldContainerProps {
    label: string;
    fieldName: string;
    children: React.ReactNode;
}

export default function FieldContainer({ label, fieldName, children }: FieldContainerProps) {
    return (
        <div className="mb-4">
            <Label htmlFor={fieldName}>{label}</Label>
            {children}
        </div>
    );
}
