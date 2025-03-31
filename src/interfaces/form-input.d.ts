export interface FormInputProps {
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "textarea" | "markdown";
  rows?: number;
}
