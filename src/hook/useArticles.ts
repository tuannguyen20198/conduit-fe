import { useAuth } from "@/context/AuthContext";
import { createArticle } from "@/lib/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useArticles = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ tags: string[] }>({
    mode: "onSubmit",
    defaultValues: { tags: [] }, // ✅ Đảm bảo `tags` là array từ đầu
  });

  const [apiErrors, setApiErrors] = useState<string[]>([]); // Lưu lỗi từ API
  const [tags, setTags] = useState<string[]>([]); // State lưu tags
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags); // ✅ Cập nhật `tags` vào form
    if (tags.length > 0) clearErrors("tags"); // ✅ Xóa lỗi nếu có
  };

  const onSubmit = async (data: any) => {
    if (!data.tags || data.tags.length === 0) {
      setError("tags", { type: "required", message: "Tags is required" });
      return;
    }
    console.log("Final Payload:", data); // ✅ Kiểm tra dữ liệu gửi đi
  };

  const onSubmitArticles = async (data: any) => {
    setApiErrors([]);
    createArticle(data);
    alert("Bài viết đã được đăng");
    navigate("/");
  };
  return {
    register,
    handleSubmit,
    onSubmit,
    user,
    onSubmitArticles,
    errors,
    apiErrors,
    setApiErrors,
    tags,
    setTags,
    handleTagsChange,
  };
};

export default useArticles;
