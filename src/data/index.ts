// src/data/index.ts
import { slugify } from "@/lib/utils";

export interface Field {
    name: string;
    type:
        | "text"
        | "email"
        | "number"
        | "tel"
        | "textarea"
        | "select"
        | "radio"
        | "checkbox"
        | "password"; // Added password
    required?: boolean;
    placeholder?: string;
    options?: string[];
}

export interface Page {
    name: string;
    value: string; // Unique value for the page (e.g., slug)
    fields: Field[];
}

export interface Category {
    name: string;
    value: string; // Unique value for the category (e.g., slug)
    pages: Page[];
}

// Define the raw data structure clearly
interface RawPageData {
    name: string;
    fields: Field[];
}

interface RawCategoryData {
    name: string;
    pages: RawPageData[];
}

const rawCategoriesData: RawCategoryData[] = [
    {
        name: "Personal Information",
        pages: [
            {
                name: "Basic Details",
                fields: [
                    {
                        name: "Full Name",
                        type: "text",
                        required: true,
                        placeholder: "Enter your full name",
                    },
                    {
                        name: "Email Address",
                        type: "email",
                        required: true,
                        placeholder: "your.email@example.com",
                    },
                ],
            },
            {
                name: "Contact Details",
                fields: [
                    {
                        name: "Phone Number",
                        type: "tel",
                        required: true,
                        placeholder: "e.g., +1 123 456 7890",
                    },
                    {
                        name: "Country",
                        type: "select",
                        required: true,
                        options: ["USA", "Canada", "UK", "Australia", "Other"],
                    },
                ],
            },
            {
                name: "Address",
                fields: [
                    {
                        name: "Street Address",
                        type: "text",
                        required: true,
                        placeholder: "123 Main St",
                    },
                    { name: "City", type: "text", required: true, placeholder: "Anytown" },
                    { name: "Postal Code", type: "text", required: true, placeholder: "12345" },
                ],
            },
        ],
    },
    {
        name: "Preferences",
        pages: [
            {
                name: "Notification Settings",
                fields: [
                    { name: "Receive Email Updates", type: "checkbox", required: false },
                    {
                        name: "Preferred Contact Method",
                        type: "radio",
                        required: true,
                        options: ["Email", "Phone", "SMS"],
                    },
                ],
            },
            {
                name: "Interests",
                fields: [
                    {
                        name: "Primary Interest",
                        type: "select",
                        required: true,
                        options: ["Technology", "Sports", "Arts", "Music", "Travel"],
                    },
                    {
                        name: "Feedback",
                        type: "textarea",
                        required: false,
                        placeholder: "Any additional feedback?",
                    },
                ],
            },
            {
                name: "Account Security",
                fields: [
                    { name: "Enable Two-Factor Auth", type: "checkbox", required: false },
                    {
                        name: "Security Question",
                        type: "text",
                        required: true,
                        placeholder: "e.g., Mother's maiden name?",
                    },
                    {
                        name: "Security Answer",
                        type: "password",
                        required: true,
                        placeholder: "Your secret answer",
                    },
                ],
            },
        ],
    },
];

// Generate the final categories array with slugs (values)
const categories: Category[] = rawCategoriesData.map((categoryData) => ({
    name: categoryData.name, // Keep the name
    value: slugify(categoryData.name), // Generate category slug
    pages: categoryData.pages.map((pageData) => ({
        name: pageData.name, // Keep the name
        value: slugify(pageData.name), // Generate page slug
        fields: pageData.fields, // Keep the fields
    })),
}));

export default categories;
