// src/data/index.ts

export interface Field {
    name: string;
    value: string;
    type:
        | "text"
        | "email"
        | "number"
        | "tel"
        | "textarea"
        | "select"
        | "radio"
        | "checkbox"
        | "password";
    required?: boolean;
    placeholder?: string;
    options?: string[];
}

export interface Page {
    name: string;
    value: string;
    fields: Field[];
}

export interface Category {
    name: string;
    value: string;
    pages: Page[];
}

interface RawPageData {
    name: string;
    value: string;
    fields: Field[];
}

interface RawCategoryData {
    name: string;
    value: string;
    pages: RawPageData[];
}

const rawCategoriesData: RawCategoryData[] = [
    {
        name: "Personal Information",
        value: "personal-information",
        pages: [
            {
                name: "Basic Details",
                value: "basic-details",
                fields: [
                    {
                        name: "Full Name",
                        value: "full-name",
                        type: "text",
                        required: true,
                        placeholder: "Enter your full name",
                    },
                    {
                        name: "Email Address",
                        value: "email-address",
                        type: "email",
                        required: true,
                        placeholder: "your.email@example.com",
                    },
                ],
            },
            {
                name: "Contact Details",
                value: "contact-details",
                fields: [
                    {
                        name: "Phone Number",
                        value: "phone-number",
                        type: "tel",
                        required: true,
                        placeholder: "e.g., +1 123 456 7890",
                    },
                    {
                        name: "Country",
                        value: "country",
                        type: "select",
                        required: true,
                        options: ["USA", "Canada", "UK", "Australia", "Other"],
                    },
                ],
            },
            {
                name: "Address",
                value: "address",
                fields: [
                    {
                        name: "Street Address",
                        value: "street-address",
                        type: "text",
                        required: true,
                        placeholder: "123 Main St",
                    },
                    {
                        name: "City",
                        value: "city",
                        type: "text",
                        required: true,
                        placeholder: "Anytown",
                    },
                    {
                        name: "Postal Code",
                        value: "postal-code",
                        type: "text",
                        required: true,
                        placeholder: "12345",
                    },
                ],
            },
        ],
    },
    {
        name: "Preferences",
        value: "preferences",
        pages: [
            {
                name: "Notification Settings",
                value: "notification-settings",
                fields: [
                    {
                        name: "Receive Email Updates",
                        value: "receive-email-updates",
                        type: "checkbox",
                        required: false,
                    },
                    {
                        name: "Preferred Contact Method",
                        value: "preferred-contact-method",
                        type: "radio",
                        required: true,
                        options: ["Email", "Phone", "SMS"],
                    },
                ],
            },
            {
                name: "Interests",
                value: "interests",
                fields: [
                    {
                        name: "Primary Interest",
                        value: "primary-interest",
                        type: "select",
                        required: true,
                        options: ["Technology", "Sports", "Arts", "Music", "Travel"],
                    },
                    {
                        name: "Feedback",
                        value: "feedback",
                        type: "textarea",
                        required: false,
                        placeholder: "Any additional feedback?",
                    },
                ],
            },
            {
                name: "Account Security",
                value: "account-security",
                fields: [
                    {
                        name: "Enable Two-Factor Auth",
                        value: "enable-two-factor-auth",
                        type: "checkbox",
                        required: false,
                    },
                    {
                        name: "Security Question",
                        value: "security-question",
                        type: "text",
                        required: true,
                        placeholder: "e.g., Mother's maiden name?",
                    },
                    {
                        name: "Security Answer",
                        value: "security-answer",
                        type: "password",
                        required: true,
                        placeholder: "Your secret answer",
                    },
                ],
            },
        ],
    },
];

const categories: Category[] = rawCategoriesData.map((categoryData) => ({
    name: categoryData.name,
    value: categoryData.value,
    pages: categoryData.pages.map((pageData) => ({
        name: pageData.name,
        value: pageData.value,
        fields: pageData.fields,
    })),
}));

export default categories;
