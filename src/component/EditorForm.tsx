import { FormProvider } from "react-hook-form";
import FormInput from "./FormInput";
import FormTags from "./FormTags";
import useEditor from "@/hook/useEditor";

const EditorForm = ({ onSubmit, apiErrors }: any) => {
  // Sử dụng hook useEditor để lấy các giá trị cần thiết
  const {
    articleData,
    handleTagsChange,
    onSubmitArticles,
    loading,
    errors,
    methods, // Phương thức từ useForm
  } = useEditor(); // Sử dụng hook đã viết sẵn của bạn

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmitArticles)}>
        <div className="form-group mb-3">
          <FormInput name="title" placeholder="Article Title" type="text" />
        </div>

        <div className="form-group mb-3">
          <FormInput name="description" placeholder="What's this article about?" type="text" />
        </div>

        <div className="form-group mb-3">
          <FormInput name="body" placeholder="Write your article" type="markdown" />
        </div>

        <div className="form-group mb-3">
          <fieldset className="form-group">
            <FormTags
              onTagsChange={handleTagsChange}
              defaultTags={articleData?.tagList || []} // Truyền tags nếu có từ bài viết
            />
            {errors.tags && <p className="text-danger">{String(errors.tags.message)}</p>}
          </fieldset>
        </div>

        <button className="btn btn-primary" type="submit">
          {articleData?.slug ? "Update Article" : "Create Article"} {/* Hiển thị nút khác nhau cho tạo mới và cập nhật */}
        </button>
      </form>
    </FormProvider>
  );
};

export default EditorForm;
