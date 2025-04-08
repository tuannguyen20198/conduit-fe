import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, getArticleBySlug, updateArticle } from "@/lib/api";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";

const useEditor = (refreshArticles?: () => void) => {
  const { slug, articleId } = useParams(); // Lấy slug từ URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [articleData, setArticleData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Đặt cấu hình form với type bao gồm cả body
  const methods = useForm<{
    tags: string[];
    title: string;
    description: string;
    body: string; // Thêm trường body vào
  }>({
    mode: "onSubmit",
    defaultValues: { tags: [], body: "" }, // Đặt giá trị mặc định cho body
  });

  const { setValue, clearErrors, setError, formState: { errors } } = methods;

  // Hàm xử lý tags
  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
    if (tags.length > 0) clearErrors("tags");
  };

  // Fetch dữ liệu bài viết khi slug thay đổi
  const fetchArticleData = async () => {
    if (slug) {
      try {
        const data = await getArticleBySlug(slug);
        setArticleData(data);
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("body", data.body); // Cập nhật body
        setValue("tags", data.tagList || []); // Cập nhật tags từ tagList
        setLoading(false);
      } catch (error:unknown) {
        if (error instanceof Error) {
          setApiErrors([error.message || "Something went wrong!"]);
        } else {
          setApiErrors(["An unknown error occurred"]);
        }
      }
    }
  };

  // Submit bài viết mới hoặc cập nhật bài viết
  const onSubmitArticles = async (data: any) => {
    if (!data.tags || data.tags.length === 0) {
      setError("tags", { type: "required", message: "Tags is required" });
      return;
    }

    try {
      if (articleId) {
        await updateArticle(articleId, data);
        alert("Bài viết đã được cập nhật");
        refreshArticles?.(); // refresh the list of articles after update
        navigate("/", { replace: true });
      } else {
        await createArticle(data);
        alert("Bài viết đã được tạo mới");
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiErrors([error.message || "Something went wrong!"]);
      } else {
        setApiErrors(["Đã xảy ra lỗi khi cập nhật bài viết!"]);
      }
    }
  };

  // Gọi fetch dữ liệu bài viết nếu slug có
  useEffect(() => {
    if (slug) {
      fetchArticleData();
    }
  }, [slug]);

  return {
    articleData,
    handleTagsChange,
    onSubmitArticles,
    loading,
    apiErrors,
    errors,
    methods, // Trả về `methods` từ useForm để EditorForm có thể dùng
  };
};

export default useEditor;
