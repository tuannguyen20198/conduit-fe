import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { SettingsFormData } from "@/interfaces/settings";

export const useSettings = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const defaultFormData: SettingsFormData = {
    image: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<SettingsFormData>(defaultFormData);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] =
    useState<SettingsFormData>(defaultFormData);

  useEffect(() => {
    if (user) {
      const newUserData = {
        image: user.image || "",
        username: user.username || "",
        bio: user.bio || "",
        email: user.email || "",
        password: "",
      };
      setFormData(newUserData);
      setOriginalData(newUserData); // Cập nhật originalData để so sánh đúng
    }
  }, [user]);

  const isChanged = useMemo(() => {
    if (!formData || !originalData) return false;

    const { password, ...currentData } = formData;
    const { password: _, ...original } = originalData;

    return (
      JSON.stringify(currentData) !== JSON.stringify(original) ||
      (password ?? "").trim() !== ""
    );
  }, [formData, originalData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChanged) return;

    setError(null);
    const { password, ...updatedUserData } = formData;
    const finalData = password
      ? { ...updatedUserData, password }
      : updatedUserData;

    try {
      const response = await updateUser(finalData);
      console.log("API response:", response); // Kiểm tra API trả về

      if (!response || !response.user) {
        throw new Error("Update failed: No user data returned.");
      }

      setUser((prev) => ({ ...prev, ...response.user }));
      setOriginalData(response.user);

      if (password) {
        logout();
        navigate("/login");
      } else {
        navigate("/settings");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Update failed. Please try again.");
    }
  };

  return { formData, error, isChanged, handleChange, handleSubmit, user };
};
