// data/index.ts

export type FieldType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "radio"
    | "select"
    | "checkbox"
    | "textarea";

export type Field = {
    name: string;
    type: FieldType;
    required: boolean;
    options?: string[];
    placeholder?: string;
};

export type Page = {
    name: string;
    value: string;
    fields: Field[];
};

export type Category = {
    name: string;
    value: string;
    protected: boolean;
    pages: Page[];
};

const categories: Category[] = [
    {
        name: "User Registration",
        value: "user-registration",
        protected: false,
        pages: [
            {
                name: "Account Info",
                value: "account-info",
                fields: [
                    {
                        name: "Full Name",
                        type: "text",
                        required: true,
                        placeholder: "Enter your full name",
                    },
                    {
                        name: "Email",
                        type: "email",
                        required: true,
                        placeholder: "you@example.com",
                    },
                    { name: "Password", type: "password", required: true },
                    { name: "Confirm Password", type: "password", required: true },
                ],
            },
            {
                name: "Profile Details",
                value: "profile-details",
                fields: [
                    {
                        name: "Username",
                        type: "text",
                        required: true,
                        placeholder: "Choose a username",
                    },
                    {
                        name: "Phone Number",
                        type: "tel",
                        required: false,
                        placeholder: "Optional phone number",
                    },
                    { name: "Country", type: "text", required: false },
                    { name: "City", type: "text", required: false },
                ],
            },
            {
                name: "Preferences",
                value: "preferences",
                fields: [
                    {
                        name: "Preferred Language",
                        type: "select",
                        required: false,
                        options: ["English", "Spanish", "French", "German"],
                    },
                    {
                        name: "Communication Method",
                        type: "radio",
                        required: true,
                        options: ["Email", "SMS", "Phone Call"],
                    },
                    { name: "Subscribe to Newsletter", type: "checkbox", required: false },
                ],
            },
        ],
    },
    {
        name: "Job Application",
        value: "job-application",
        protected: true,
        pages: [
            {
                name: "Personal Info",
                value: "personal-info",
                fields: [
                    { name: "First Name", type: "text", required: true },
                    { name: "Last Name", type: "text", required: true },
                    {
                        name: "Applicant Email",
                        type: "email",
                        required: true,
                        placeholder: "applicant@email.com",
                    },
                    { name: "Contact Phone", type: "tel", required: true },
                ],
            },
            {
                name: "Education History",
                value: "education-history",
                fields: [
                    {
                        name: "Highest Degree Achieved",
                        type: "select",
                        required: true,
                        options: [
                            "High School",
                            "Associate's",
                            "Bachelor's",
                            "Master's",
                            "Doctorate",
                        ],
                    },
                    {
                        name: "Field of Study",
                        type: "text",
                        required: true,
                        placeholder: "e.g., Computer Science",
                    },
                    { name: "University Name", type: "text", required: false },
                    {
                        name: "Graduation Year",
                        type: "number",
                        required: false,
                        placeholder: "YYYY",
                    },
                ],
            },
            {
                name: "Work Experience",
                value: "work-experience",
                fields: [
                    { name: "Most Recent Company", type: "text", required: false },
                    { name: "Job Title", type: "text", required: false },
                    { name: "Years Worked", type: "number", required: false },
                    {
                        name: "Job Description",
                        type: "textarea",
                        required: false,
                        placeholder: "Briefly describe your responsibilities",
                    },
                ],
            },
            {
                name: "Application Preferences",
                value: "application-preferences",
                fields: [
                    {
                        name: "Desired Salary Range",
                        type: "select",
                        required: false,
                        options: ["$40k-$60k", "$60k-$80k", "$80k-$100k", "$100k+"],
                    },
                    {
                        name: "Willing to Relocate",
                        type: "radio",
                        required: true,
                        options: ["Yes", "No", "Maybe"],
                    },
                    {
                        name: "Remote Work",
                        type: "checkbox",
                        required: false,
                        options: ["Open to remote"],
                    },
                ],
            },
        ],
    },
    {
        name: "Product Feedback",
        value: "product-feedback",
        protected: false,
        pages: [
            {
                name: "Product Usage",
                value: "product-usage",
                fields: [
                    {
                        name: "Product Used",
                        type: "select",
                        required: true,
                        options: ["Product A", "Product B", "Product C"],
                    },
                    {
                        name: "Frequency of Use",
                        type: "radio",
                        required: true,
                        options: ["Daily", "Weekly", "Monthly", "Rarely"],
                    },
                    {
                        name: "Primary Use Case",
                        type: "textarea",
                        required: false,
                        placeholder: "How do you primarily use the product?",
                    },
                ],
            },
            {
                name: "Satisfaction Survey",
                value: "satisfaction-survey",
                fields: [
                    {
                        name: "Overall Satisfaction",
                        type: "radio",
                        required: true,
                        options: [
                            "Very Satisfied",
                            "Satisfied",
                            "Neutral",
                            "Dissatisfied",
                            "Very Dissatisfied",
                        ],
                    },
                    {
                        name: "Likelihood to Recommend",
                        type: "select",
                        required: true,
                        options: [
                            "10 - Extremely Likely",
                            "9",
                            "8",
                            "7",
                            "6",
                            "5",
                            "4",
                            "3",
                            "2",
                            "1 - Not at all Likely",
                        ],
                    },
                    {
                        name: "Feature Request",
                        type: "textarea",
                        required: false,
                        placeholder: "Any features you'd like to see?",
                    },
                ],
            },
        ],
    },
];

export default categories;
