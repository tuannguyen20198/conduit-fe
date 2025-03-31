export interface FormInputProps {
  name?: string;
  placeholder?: string;
  type?: "text" | "textarea" | "markdown";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
