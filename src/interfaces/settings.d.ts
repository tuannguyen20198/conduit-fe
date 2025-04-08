// Không cần `declare module`
interface FormData {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
}

interface User {
  image: string;
  username: string;
  bio: string;
  email: string;
}

interface SettingsFormData extends User {
  password?: string;
}

interface SettingsFormProps {
  formData: {
    image: string;
    username: string;
    bio: string;
    email: string;
    password: string;
  };
  isChanged: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  error: string | null;
}
interface SettingsProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleUpdate: (data: FormData) => Promise<void>;
  error: string | null;
  loading: boolean;
  success: boolean;
}
interface SettingsForm {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
}
