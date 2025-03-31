import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user } = useAuth();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      login(user);
      navigate("/", { replace: true });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  useEffect(() => {
    if (user) {
      navigate("/"); // Chuyển hướng về trang chủ nếu đã đăng nhập
    }
  }, [user, navigate]);

  return {
    formData,
    handleChange,
    handleLogin,
    isPending,
    error,
    user,
  };
};

export default useLogin;
