import SettingsForm from "@/component/SettingForms";
import React from "react";

interface SettingsProps {
  formData: {
    image: string;
    username: string;
    bio: string;
    email: string;
    password: string;
  };
  isChanged: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  error: string | null;
}

const Settings: React.FC<SettingsProps> = (props) => {
  return (
    <div className="settings-page">
      <div className="container page">
        <h1>Your Settings</h1>
        <SettingsForm {...props} />
      </div>
    </div>
  );
};

export default Settings;
