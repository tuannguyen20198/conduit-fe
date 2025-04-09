import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, getArticleBySlug, updateArticle } from "@/lib/api";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";

const useEditor = (refreshArticles?: () => void) => {
  const { slug } = useParams(); // Lấy slug từ URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [articleData, setArticleData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Đặt cấu hình form với type bao gồm cả body
  const methods = useForm<EditorFormData>({
    mode: "onSubmit",
    defaultValues: { tags: [], body: "" },
  });

  const {
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = methods;

  // Hàm xử lý tags
  const handleTagsChange = (tags: string[]) => {
    // Cập nhật giá trị tags trong form
    setValue("tags", tags);
    if (tags.length > 0) {
      clearErrors("tags"); // Nếu có tags, xóa lỗi tags
    }
  };

  // Fetch dữ liệu bài viết khi slug có
  const fetchArticleData = async () => {
    if (slug) {
      try {
        const data = await getArticleBySlug(slug);
        console.log("Fetched Article Data:", data); // Kiểm tra cấu trúc dữ liệu
        setArticleData(data);

        // Cập nhật dữ liệu cho form
        if (data && data.body) {
          setValue("body", data.body); // Cập nhật body
        }

        // Cập nhật title, description, và tags
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("tags", data.tagList || []); // Cập nhật tags từ data.tagList

        setLoading(false);
      } catch (error: unknown) {
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
      setError("tags", { type: "required", message: "Tags are required" });
      return;
    }

    try {
      if (slug) {
        // If slug exists, update the article
        await updateArticle(slug, data);
        alert("Bài viết đã được cập nhật");
        refreshArticles?.();
        navigate("/", { replace: true });
      } else {
        // If slug is not present, create a new article
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
    } else {
      setLoading(false); // Nếu không có slug, không cần fetch dữ liệu
    }
  }, [slug]);

  return {
    articleData,
    handleTagsChange,
    onSubmitArticles,
    loading,
    apiErrors,
    errors,
    methods,
  };
};

export default useEditor;
