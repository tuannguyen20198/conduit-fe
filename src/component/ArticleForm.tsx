import { ArticleFormProps } from "@/interfaces/article";
import { useForm } from "react-hook-form";

const ArticleForm = ({ onSubmit, apiErrors }: ArticleFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onSubmit" });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Hiển thị lỗi từ API */}
      {apiErrors.length > 0 && (
        <ul className="error-messages">
          {apiErrors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}

      <fieldset>
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

        <fieldset className="form-group">
          <input
            {...register("tags", { required: "Tags are required" })}
            type="text"
            className="form-control"
            placeholder="Enter tags (comma separated)"
          />
          {errors.tags && <p className="text-danger">{String(errors.tags.message)}</p>}
        </fieldset>

        <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
          Publish Article
        </button>
      </fieldset>
    </form>
  );
};

export default ArticleForm;
