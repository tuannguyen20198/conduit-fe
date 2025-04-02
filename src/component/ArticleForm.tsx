import { FormProvider, useForm } from "react-hook-form";
import FormInput from "./FormInput";
import FormTags from "./FormTags";
import SubmitButton from "./SubmitButton";

const ArticleForm = ({ onSubmit, apiErrors }: any) => {
  const methods = useForm({ mode: "onChange" });
  const { handleSubmit, setValue, formState: { errors } } = methods;

  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <FormTags onTagsChange={handleTagsChange} setError={methods.setError} clearErrors={methods.clearErrors} />
            {errors.tags && <p className="text-danger">{String(errors.tags.message)}</p>}
          </fieldset>
        </div>

        <button className="btn btn-primary" type="submit">Publish Article</button>
      </form>
    </FormProvider>
  );
};

export default ArticleForm;
