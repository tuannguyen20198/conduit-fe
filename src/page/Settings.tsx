import SettingsForm from "@/component/SettingForms";
import { SettingsProps } from "@/interfaces/settings";
import React from "react";



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
