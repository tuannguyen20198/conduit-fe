import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const useArticles = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const [apiErrors, setApiErrors] = useState<string[]>([]); // Lưu lỗi từ API
  const onSubmit = async (data: any) => {
    setApiErrors([]); // Xóa lỗi trước đó

    try {
      const response = await axios.post("/api/articles", {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tags
          ? data.tags.split(",").map((tag: string) => tag.trim())
          : [], // Đúng tên backend mong đợi
      });

      if (response.status === 200) {
        alert("Article published successfully!");
      }
    } catch (error: any) {
      console.error("Error:", error);

      if (error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message.map((msg: any) =>
              Object.values(msg.constraints || {}).join(", ")
            )
          : [error.response.data.message];

        setApiErrors(messages);
      } else {
        setApiErrors(["Failed to publish article."]);
      }
    }
  };
  return {
    register: register,
    handleSubmit,
    errors,
    apiErrors,
    onSubmit,
  };
};

export default useArticles;
