import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export const useSettings = () => {
  const { user, setUser, logout } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const defaultFormData = {
    image: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      setIsChanged(
        JSON.stringify(updatedData) !==
          JSON.stringify({ ...user, password: "" })
      );
      return updatedData;
    });
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
      setIsChanged(false);

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

  return {
    formData: formData ?? defaultFormData,
    error,
    isChanged,
    handleChange,
    handleSubmit,
    user,
  };
};
