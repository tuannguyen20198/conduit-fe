import { useForm } from "react-hook-form";
import FormTags from "./FormTags";

const ArticleForm = ({ onSubmit, apiErrors }: any) => {
  const { register,clearErrors, handleSubmit, setValue, setError, formState: { errors,isValid  } } = useForm({ mode: "onSubmit" });

  // Hàm cập nhật `tags`
  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
  };

console.log(errors.tags)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Hiển thị lỗi từ API */}
      {apiErrors.length > 0 && (
        <ul className="error-messages">
          {apiErrors.map((err:any, index: number) => (
            <li key={index} className="text-danger">{err}</li>
          ))}
        </ul>
      )}

      <fieldset className="form-group">
        <input
          {...register("title", { required: "Title is required" })}
          type="text"
          className="form-control"
          placeholder="Article Title"
        />
        {errors.title && <p className="text-danger">{String(errors.title.message)}</p>}
      </fieldset>

      <fieldset className="form-group">
        <input
          {...register("description", { required: "Description is required" })}
          type="text"
          className="form-control"
          placeholder="What's this article about?"
        />
        {errors.description && <p className="text-danger">{String(errors.description.message)}</p>}
      </fieldset>

      <fieldset className="form-group">
        <textarea
          {...register("body", { required: "Content is required" })}
          className="form-control"
          rows={8}
          placeholder="Write your article (in markdown)"
        />
        {errors.body && <p className="text-danger">{String(errors.body.message)}</p>}
      </fieldset>

      {/* Component nhập Tags */}
      <fieldset className="form-group">
        <FormTags onTagsChange={handleTagsChange} setError={setError} clearErrors={clearErrors} />
        {errors.tags && <p className="text-danger">{String(errors.tags.message)}</p>}
      </fieldset>
      <button className="btn btn-lg pull-xs-left btn-primary" type="submit" disabled={!isValid}>
        Publish Article
      </button>
    </form>
  );
};

export default ArticleForm;
