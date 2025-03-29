// Không cần `declare module`
export interface FormData {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
}

export interface User {
  image?: string;
  username: string;
  bio?: string;
  email: string;
}

export interface SettingsFormData extends User {
  password?: string;
}

export interface SettingsFormProps {
  formData: SettingsFormData;
  isChanged: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  error: string | null;
}

// Nếu SettingsFormProps giống hệt thì không cần tạo thêm interface
export type SettingsProps = SettingsFormProps;
