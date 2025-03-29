declare module "@/interfaces/settings" {
  export interface FormData {
    image: string;
    username: string;
    bio: string;
    email: string;
    password: string;
  }

  export interface SettingsFormProps {
    formData: FormData;
    isChanged: boolean;
    handleChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    error: string | null;
  }

  export interface SettingsProps extends SettingsFormProps {}
}
