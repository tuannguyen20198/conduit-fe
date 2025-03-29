import { createArticle } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useArticles = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (articleData: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
    }) => createArticle(articleData),
    onSuccess: () => {
      alert("Bài viết đã được đăng!");
      reset();
      navigate("/");
      setTags([]);
    },
    onError: (error: any) => {
      try {
        const parsedErrors = JSON.parse(error.message) as Record<
          string,
          string[]
        >;
        setErrorMessages(Object.values(parsedErrors).flat());
      } catch {
        setErrorMessages(["Có lỗi xảy ra, vui lòng thử lại."]);
      }
    },
  });

  const onSubmit = (data: any) => {
    const articleData = {
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: tags,
    };
    mutation.mutate(articleData);
  };
  return {
    tags,
    setTags,
    errorMessages,
    setErrorMessages,
    register,
    handleSubmit,
    onSubmit,
    mutation,
  };
};

export default useArticles;
