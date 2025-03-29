import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { SettingsFormData } from "@/interfaces/settings"; // ✅ Import đúng

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

  useEffect(() => {
    if (user) {
      setFormData({
        image: user.image || "",
        username: user.username || "",
        bio: user.bio || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const isChanged = useMemo(() => {
    if (!user) return false;
    const { password, ...currentData } = formData;
    return (
      JSON.stringify(currentData) !== JSON.stringify(user) || password !== ""
    );
  }, [formData, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      if (!response?.user) throw new Error("Update failed.");

      setUser((prev) => ({ ...prev, ...response.user }));

      if (password) {
        logout();
        navigate("/login");
      } else {
        navigate("/settings");
      }
    } catch {
      setError("Update failed. Please try again.");
    }
  };

  return { formData, error, isChanged, handleChange, handleSubmit, user };
};
