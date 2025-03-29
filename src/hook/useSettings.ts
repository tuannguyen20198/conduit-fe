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
      setFormData({
        image: user.image || "", // Thêm giá trị mặc định
        username: user.username || "",
        bio: user.bio || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const isChanged = useMemo(() => {
    const { password, ...currentData } = formData;
    const { password: _, ...original } = originalData;
    return (
      JSON.stringify(currentData) !== JSON.stringify(original) ||
      password !== ""
    );
  }, [formData, originalData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChanged) return; // Ngăn chặn cập nhật nếu không có thay đổi
    setError(null);

    const { password, ...updatedUserData } = formData;
    const finalData = password
      ? { ...updatedUserData, password }
      : updatedUserData;

    try {
      const response = await updateUser(finalData);
      if (!response?.user) throw new Error("Update failed.");

      setUser((prev) => ({ ...prev, ...response.user }));
      setOriginalData(response.user); // Cập nhật dữ liệu gốc sau khi thành công

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
